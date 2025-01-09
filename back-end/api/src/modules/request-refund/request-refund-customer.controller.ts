import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { BookingStatus, RequestRefundStatus } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { BookingService } from '../booking/booking.service';
import { CreateRequestRefundDto, CreateRequestRefundDtoKeys } from './dto/create-request-refund.dto';
import { RequestRefundService } from './request-refund.service';
import { UpdateRequestRefundCustomerDto } from './dto/update-request-refund.dto';
import moment from 'moment';

@ApiTags('Request Refund (Customer)')
@Controller('request-refund-customer')
export class RequestRefundCustomerController {
  constructor(
    private readonly requestRefundService: RequestRefundService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly bookingService: BookingService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':bookingId')
  async create(@UserDecorator() user: IUserJwt, @Param('bookingId', ParseIdPipe) bookingId: number, @Body() body: CreateRequestRefundDto) {
    const booking = await this.bookingService.findOne({
      where: {
        id: bookingId,
        userId: user.data.id
      }
    });

    if (!booking)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.booking_not_found')));

    const currentDate = moment();
    const bookingDate = moment(booking.createdAt);
    const diffDays = currentDate.diff(bookingDate, 'days');
    
    if (diffDays > 3) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.expired_time')));
    }

    const keyNotInDto = Object.keys(body).find((key: keyof CreateRequestRefundDto) => !CreateRequestRefundDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.wrong_parameter', { keyNotInDto })));

    if (booking.status === BookingStatus.PENDING)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.pending')));
    if (booking.status === BookingStatus.CANCELLED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.cancelled')));
    if (booking.status === BookingStatus.COMPLETED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.create.completed')));
    
    return await this.prismaService.requestRefund.create({
      data: {
        userId: user.data.id,
        bookingId: booking.id,
        reason: body.reason,
        imageQRCode: body.imageQRCode,
        accountHolderName: body.accountHolderName,
        accountNumber: body.accountNumber,
        bankName: body.bankName,
        status: RequestRefundStatus.PENDING
      }
    })
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number, @Body() body: UpdateRequestRefundCustomerDto) {
    const requestRefund = await this.requestRefundService.findOne({
      where: {
        id: id,
      }
    });

    if (!requestRefund)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.update.not_found')));

    if (requestRefund.status === RequestRefundStatus.APPROVED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.update.approved')));

    if (requestRefund.status === RequestRefundStatus.REJECTED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.update.rejected')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateRequestRefundCustomerDto) => !CreateRequestRefundDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.update.wrong_parameter', { keyNotInDto })));

    return await this.requestRefundService.update(requestRefund.id, {
      ...body
    })
  }
}
