import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateBookingDto, CreateBookingDtoKeys } from './dto/create-booking.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { TourService } from '../tour/tour.service';
import moment from 'moment';
import { FilterMyBooking } from './dto/filter-booking.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BookingStatus } from 'src/helpers/constants/enum.constant';
import { CancelBookingDto, CancelBookingDtoKeys } from './dto/cancel-booking.dto';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { UploadPaymentProofDto, UploadPaymentProofDtoKeys } from './dto/update-booking.dto';

@ApiTags('Booking (Customer)')
@Controller('booking-customer')
export class BookingCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookingService: BookingService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserDecorator() user: IUserJwt, @Body() body: CreateBookingDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateBookingDto) => !CreateBookingDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.wrong_parameter', { keyNotInDto })));

    const tourExists = await this.tourService.findOne({
      where: { id: body.tourId, isActive: true }
    });
    if (!tourExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.tour_not_found')));

    const existingBookings = await this.bookingService.findAll({
      where: {
        userId: user.data.id,
        tourId: body.tourId,
        status: {
          notIn: [BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.REFUNDED]
        }
      }
    });

    if (existingBookings.length > 0) {
      throw new BaseException(Errors.BAD_REQUEST(
        this.i18n.t('common-message.booking.create.already_booked')
      ));
    }

    if (moment().startOf('day').isAfter(moment(body.startDate)))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_start_date')));

    if (moment(body.endDate).isBefore(body.startDate)) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_end_date')));
    }

    if (body.numberOfAdults + body.numberOfChildren <= 0) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_number_of_guests')));
    }

    const timestamp = moment().format('YYMMDDHHmmss');
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const bookingCode = `BK${timestamp}${randomDigits}${user.data.id}`;

    return await this.bookingService.create({
      data: {
        ...body,
        bookingCode: bookingCode,
        status: BookingStatus.PAYMENT_PENDING,
        userId: user.data.id
      }
    })
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('payment-proof/:id')
  async uploadPaymentProof(@Param('id') id: number, @UserDecorator() user: IUserJwt, @Body() body: UploadPaymentProofDto) {
    const booking = await this.bookingService.findOne({
      where: { id, userId: user.data.id }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.uploadPaymentProof.not_found')));

    if (booking.status !== BookingStatus.PAYMENT_PENDING)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.uploadPaymentProof.invalid_status_for_payment')));

    const keyNotInDto = Object.keys(body).find((key: keyof UploadPaymentProofDto) => !UploadPaymentProofDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.uploadPaymentProof.wrong_parameter', { keyNotInDto })));

    return await this.bookingService.update(
      id,
      {
        paymentProof: body.paymentProof,
        status: BookingStatus.PAYMENT_UPLOADED
      }
    );
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
          include: {
            City: true,
            TourImage: true,
            Review: {
              where: {
                userId: user.data.id
              }
            },
          }
        }
      }
    }

    return await funcListPaging(
      this.bookingService,
      whereInput,
      options?.page,
      options?.perPage,
    )
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('cancel/:id')
  async cancelBooking(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number, @Body() body: CancelBookingDto) {
    const booking = await this.bookingService.findOne({
      where: {
        id: id,
        userId: user.data.id
      },
      include: {
        Tour: {
          include: {
            City: true,
            TourImage: true,
            Review: true,
          }
        }
      }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.cancelBooking.not_found')));

    if (booking.status === BookingStatus.CANCELLED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.cancelBooking.already_cancelled')));

    const keyNotInDto = Object.keys(body).find((key: keyof CancelBookingDto) => !CancelBookingDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.cancelBooking.wrong_parameter', { keyNotInDto })));

    if (booking.status !== BookingStatus.PAYMENT_PENDING)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.cancelBooking.cannot_cancel')));

    return await this.bookingService.update(
      booking.id,
      {
        status: BookingStatus.CANCELLED,
        cancelReason: body.cancelReason
      }
    )
  }
}
