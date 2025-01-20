import { Body, Controller, Get, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import moment from 'moment';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BookingStatus, NotificationType, PaymentMethod, PaymentStatus } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';
import { BookingService } from './booking.service';
import { CreateBookingDto, CreateBookingDtoKeys } from './dto/create-booking.dto';
import { FilterMyBooking } from './dto/filter-booking.dto';
import { PaymentService } from './payment.service';
import { CreateNotificationLogsDto } from '../notification-log/dto/create-notification-log.dto';
import { TopicNoti } from 'src/core/services/firebase.service';
import { NotificationLogsService } from '../notification-log/notification-log.service';

@ApiTags('Booking (Customer)')
@Controller('booking-customer')
export class BookingCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookingService: BookingService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService,
    private readonly paymentService: PaymentService,
    private readonly notificationLogsService: NotificationLogsService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserDecorator() user: IUserJwt, @Body() body: CreateBookingDto, @Ip() ipAddr: string) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateBookingDto) => !CreateBookingDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.wrong_parameter', { keyNotInDto })));

    const tourExists = await this.tourService.findOne({
      where: { id: body.tourId, isActive: true }
    });
    if (!tourExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.tour_not_found')));

    if (moment().startOf('day').isAfter(moment(body.startDate)))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_start_date')));

    if (moment(body.endDate).isBefore(body.startDate)) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_end_date')));
    }

    if (body.numberOfAdults + body.numberOfChildren <= 0) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_number_of_guests')));
    }

    const timestamp = moment().format('YYMMDDHHmmss');
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingCode = `BK${timestamp}${randomDigits}${user.data.id}`;

    const booking = await this.bookingService.create({
      data: {
        ...body,
        bookingCode: bookingCode,
        status: BookingStatus.PENDING,
        userId: user.data.id
      }
    })

    if (booking.paymentMethod === PaymentMethod.VNPAY) {
      const paymentUrl = await this.paymentService.createPaymentUrl(ipAddr, booking.id, booking.bookingCode, booking.totalPrice, I18nContext.current().lang);
      return { paymentUrl };
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get-payment-url/:bookingId')
  async getPaymentUrl(@Param('bookingId', ParseIdPipe) bookingId: number, @UserDecorator() user: IUserJwt, @Ip() ipAddr: string) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.data.id
      },
      include: {
        Payment: true
      }
    });

    if (!booking) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.getPaymentUrl.not_found')));
    }

    // Kiểm tra trạng thái booking
    switch (booking.status) {
      case BookingStatus.CANCELLED:
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.getPaymentUrl.cancelled')));

      case BookingStatus.CONFIRMED:
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.getPaymentUrl.already_paid')));

      case BookingStatus.COMPLETED:
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.getPaymentUrl.completed')));

      case BookingStatus.PENDING:
        // Kiểm tra nếu có payment thành công
        const latestPayment = booking.Payment;
        if (latestPayment?.transactionStatus === PaymentStatus.SUCCESS) {
          throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.getPaymentUrl.already_paid')));
        }

        // Tạo payment URL mới
        const paymentUrl = await this.paymentService.createPaymentUrl(
          ipAddr,
          booking.id,
          booking.bookingCode,
          booking.totalPrice,
          I18nContext.current().lang
        );

        return { paymentUrl };

      default:
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.getPaymentUrl.invalid_status')));
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('payment-return/vnpay-return')
  async vnpayReturn(@Query() query: any) {
    const result = await this.paymentService.handlePaymentReturn(query);

    if (result.code === '00') {
      const payment = result?.payment;
      const notificationDataCustomer: CreateNotificationLogsDto = {
        title: `Đặt tour thành công: ${payment?.Booking?.bookingCode}`,
        subTitle: `Từ ${moment(payment?.Booking?.startDate).format('DD-MM-YYYY')} đến ${moment(payment?.Booking?.endDate).format('DD-MM-YYYY')}`,
        body: `Giá: ${payment?.Booking?.totalPrice.toLocaleString('vi-VN')} VNĐ`,
        userReceiveIds: [payment?.Booking?.userId],
        type: NotificationType.NEW_BOOKING,
      }

      const notificationDataAdminStaff: CreateNotificationLogsDto = {
        title: `Có đơn đặt tour mới: ${payment?.Booking?.bookingCode}`,
        subTitle: `Từ ${moment(payment?.Booking?.startDate).format('DD-MM-YYYY')} đến ${moment(payment?.Booking?.endDate).format('DD-MM-YYYY')}`,
        body: `Giá: ${payment?.Booking?.totalPrice.toLocaleString('vi-VN')} VNĐ`,
        topic: TopicNoti.TopicForAllAdminStaff,
        type: NotificationType.NEW_BOOKING
      }

      await Promise.all(
        [
          this.notificationLogsService.send(notificationDataCustomer),
          this.notificationLogsService.send(notificationDataAdminStaff),
        ]
      )

      return {
        code: result.code,
        message: this.i18n.t('common-message.booking.vnpayReturn.success'),
      };
    } else {
      return {
        code: result.code,
        message: this.i18n.t('common-message.booking.vnpayReturn.fail'),
      };
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getMyBooking(@UserDecorator() user: IUserJwt, @Query() options: FilterMyBooking) {
    const where: Prisma.BookingWhereInput = { userId: user.data.id };
    if (options.textSearch) {
      where.OR = [
        {
          Tour: {
            name: {
              contains: options.textSearch,
            }
          }
        },
        {
          bookingCode: {
            contains: options.textSearch
          }
        }
      ]
    }

    const whereInput: Prisma.BookingFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder
      },
      include: {
        Tour: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            guideMeetingAddress: true,
            numberOfHours: true,
            City: true,
            TourImage: true
          }
        },
        Payment: {
          select: {
            id: true,
            paymentCode: true,
            amount: true,
            payDate: true,
            transactionStatus: true,
          }
        },
        RequestRefund: true
      }
    }

    // return await funcListPaging(
    //   this.bookingService,
    //   whereInput,
    //   options?.page,
    //   options?.perPage,
    // )

    const raws = await funcListPaging(
      this.bookingService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  
    const modifiedResults = {
      ...raws,
      items: raws.items.map(booking => {
        const cancellationDeadline = moment(booking.createdAt).add(3, 'days');
        const now = moment();
        
        return {
          ...booking,
          canRequestRefund: now.isBefore(cancellationDeadline),
          requestRefundDeadline: cancellationDeadline
        };
      })
    };
  
    return modifiedResults;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: id
      },
      include: {
        Tour: {
          include: {
            TourImage: true,
            TourDestination: {
              include: {
                Destination: true
              }
            }
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        },
        Payment: {
          select: {
            id: true,
            paymentCode: true,
            amount: true,
            payDate: true,
            transactionStatus: true,
          }
        },
        RequestRefund: true
      }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.findOne.not_found')));

    const tourId = booking.Tour.id;
    const tourName = booking.Tour.name;
    const tourSlug = booking.Tour.slug;
    const tourPrice = booking.Tour.price;
    const TourImage = booking.Tour.TourImage;
    const TourDestination = booking.Tour.TourDestination;
    const User = booking.User;
    const Payment = booking.Payment;
    const RequestRefund = booking.RequestRefund;

    delete booking.Tour;

    return {
      ...booking,
      Tour: {
        id: tourId,
        name: tourName,
        slug: tourSlug,
        price: tourPrice,
        TourImage: TourImage,
        TourDestination: TourDestination,
      },
      User: User,
      Payment: Payment,
      RequestRefund: RequestRefund,
    };
  }
}
