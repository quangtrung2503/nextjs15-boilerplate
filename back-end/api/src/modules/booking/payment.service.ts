import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { BackendConfigService } from 'src/core/services/backend-config.service';
import { BookingStatus, PaymentStatus } from 'src/helpers/constants/enum.constant';
import crypto from 'crypto';
import querystring from 'qs';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { SchedulerRegistry } from '@nestjs/schedule';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: BackendConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly i18n: I18nCustomService
  ) {}

  async createPaymentUrl(ipAddr: string, bookingId: number, bookingCode: string, amount: number, language = this.configService.getEnv('FALLBACK_LANGUAGE')): Promise<string> {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    const existingPayment = await this.prismaService.payment.findFirst({
      where: {
        bookingId,
        transactionStatus: PaymentStatus.PENDING
      }
    });

    // Nếu có payment session đang pending và chưa hết hạn
    if (existingPayment && moment().isBefore(existingPayment.expireDate)) {
      // Tạo lại payment URL với thông tin của payment session hiện tại
      const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.configService.getEnv('VNP_TMNCODE'),
        vnp_Locale: language,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: existingPayment.txnRef,
        vnp_OrderInfo: `Thanh toan cho booking ${bookingCode}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: this.configService.getEnv('VNP_RETURN_URL'),
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: moment(existingPayment.createdAt).format('YYYYMMDDHHmmss'),
        vnp_ExpireDate: moment(existingPayment.expireDate).format('YYYYMMDDHHmmss'),
      };

      const sortedParams = this.sortObject(vnpParams);
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac('sha512', this.configService.getEnv('VNP_HASHSECRET'));
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      
      vnpParams['vnp_SecureHash'] = signed;

      return `${this.configService.getEnv('VNP_URL')}?${querystring.stringify(vnpParams, { encode: false })}`;
    }

    // Nếu có payment session đã hết hạn, cập nhật status
    if (existingPayment && moment().isAfter(existingPayment.expireDate)) {
      await this.prismaService.payment.update({
        where: { id: existingPayment.id },
        data: {
          transactionStatus: PaymentStatus.EXPIRED,
        }
      });
    }

    // Tạo payment session mới
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const txnRef = `${timestamp}${bookingId}`;
    const expireDate = moment().add(15, 'minutes').toDate();

    // Create new payment record
    await this.prismaService.payment.create({
      data: {
        bookingId,
        amount,
        paymentCode: `PAY${timestamp}`,
        txnRef,
        transactionStatus: PaymentStatus.PENDING,
        expireDate,
      },
    });

    this.scheduleBookingCancellation(bookingId, expireDate);

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.configService.getEnv('VNP_TMNCODE'),
      vnp_Locale: language,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan cho booking ${bookingCode}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: this.configService.getEnv('VNP_RETURN_URL'),
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: timestamp,
      vnp_ExpireDate: moment(expireDate).format('YYYYMMDDHHmmss'),
    };

    const sortedParams = this.sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.configService.getEnv('VNP_HASHSECRET'));
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnpParams['vnp_SecureHash'] = signed;

    return `${this.configService.getEnv('VNP_URL')}?${querystring.stringify(vnpParams, { encode: false })}`;
  }

  async handlePaymentReturn(vnpParams: any) {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.configService.getEnv('VNP_HASHSECRET'));
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const txnRef = vnpParams['vnp_TxnRef'];
      const responseCode = vnpParams['vnp_ResponseCode'];

      const payment = await this.prismaService.payment.findFirst({
        where: { 
          txnRef,
          transactionStatus: PaymentStatus.PENDING
        },
        include: {
          Booking: true,
        },
      });

      if (!payment) {
        throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.vnpayReturn.not_found')));
      }
  
      // Kiểm tra trạng thái booking
      if (payment.Booking.status !== BookingStatus.PENDING) {
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.vnpayReturn.invalid_booking_status')));
      }

      // Update payment status
      const status = responseCode === '00' 
        ? PaymentStatus.SUCCESS 
        : PaymentStatus.FAILED;

      await this.prismaService.payment.update({
        where: { id: payment.id },
        data: {
          transactionStatus: status,
          responseCode,
          bankTranNo: vnpParams['vnp_BankTranNo'],
          cardType: vnpParams['vnp_CardType'],
          orderInfo: vnpParams['vnp_OrderInfo'],
          bankCode: vnpParams['vnp_BankCode'],
          payDate: moment(vnpParams['vnp_PayDate'], 'YYYYMMDDHHmmss').toDate(),
          transactionNo: vnpParams['vnp_TransactionNo'],
          secureHash: secureHash
        },
      });

      // Update booking status if payment successful
      if (status === PaymentStatus.SUCCESS) {
        await this.prismaService.booking.update({
          where: { id: payment.bookingId },
          data: { status: BookingStatus.CONFIRMED },
        });
      }

      return { code: responseCode };
    }

    return { code: '97' }; // Checksum failed
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const str: string[] = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    
    str.sort();
    
    for (const key of str) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    
    return sorted;
  }

  private async scheduleBookingCancellation(bookingId: number, expireDate: Date) {
    const timeoutId = setTimeout(async () => {
      try {
        const booking = await this.prismaService.booking.findUnique({
          where: { id: bookingId },
          include: {
            Payment: {
              where: {
                transactionStatus: PaymentStatus.PENDING
              }
            }
          }
        });

        // Chỉ hủy nếu booking vẫn PENDING và có payment đang PENDING
        if (booking?.status === BookingStatus.PENDING && booking.Payment.length > 0) {
          await this.prismaService.$transaction(async (tx) => {
            // Cập nhật payment status thành EXPIRED
            await tx.payment.updateMany({
              where: {
                bookingId,
                transactionStatus: PaymentStatus.PENDING
              },
              data: {
                transactionStatus: PaymentStatus.EXPIRED
              }
            });

            // Cập nhật booking status thành CANCELLED
            await tx.booking.update({
              where: { id: bookingId },
              data: {
                status: BookingStatus.CANCELLED
              }
            });
          });

          this.logger.log(`Đã hủy booking ${bookingId} do hết hạn thanh toán`);
        }
      } catch (error) {
        this.logger.error(`Lỗi khi hủy booking ${bookingId}:`, error);
      } finally {
        // Xóa timeout khỏi registry sau khi xử lý xong
        this.schedulerRegistry.deleteTimeout(`booking-${bookingId}`);
      }
    }, moment(expireDate).diff(moment()));

    // Lưu timeout vào registry để có thể quản lý sau này
    this.schedulerRegistry.addTimeout(`booking-${bookingId}`, timeoutId);
  }
}