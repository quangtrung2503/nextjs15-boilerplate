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
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

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
      where: { id: body.tourId }
    });
    if (!tourExists) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.create.tour_not_found')));

    if (moment(body.startDate).startOf('day').isBefore(moment(tourExists.startDate).startOf('day'))) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_start_date_before_tour')));
    }

    if (moment(body.endDate).startOf('day').isAfter(moment(tourExists.endDate).startOf('day'))) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_end_date_after_tour')));
    }

    if (moment().startOf('day').isSameOrAfter(moment(body.startDate)))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_start_date')));

    if (moment(body.endDate).isBefore(body.startDate)) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_end_date')));
    }

    if (body.numberOfAdults + body.numberOfChildren <= 0) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.create.invalid_number_of_guests')));
    }

    return await this.bookingService.create({
      data: {
        ...body,
        userId: user.data.id
      }
    })
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getMyBooking(@UserDecorator() user: IUserJwt, @Query() options: FilterMyBooking) {
    const where: Prisma.BookingWhereInput = { userId: user.data.id };
    if (options.textSearch) {
      where.Tour = {
        name: {
          contains: options.textSearch,
        }
      }
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
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.cancel.not_found')));

    if (booking.status === BookingStatus.CANCELLED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.cancel.already_cancelled')));

    const daysBeforeTour = moment(booking.Tour.startDate)
      .startOf('day')
      .diff(moment().startOf('day'), 'days');

    if (daysBeforeTour <= 1) {
      throw new BaseException(
        Errors.BAD_REQUEST(
          this.i18n.t('common-message.booking.cancel.too_late_to_cancel')
        )
      );
    }

    return await this.bookingService.update(
      booking.id,
      {
        status: BookingStatus.CANCELLED,
        cancelReason: body.cancelReason
      }
    )
  }
}
