import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';
import { BookingService } from './booking.service';
import { FilterAllBooking } from './dto/filter-booking.dto';
import { UpdateBookingDto, UpdateBookingDtoKeys } from './dto/update-booking.dto';
import moment from 'moment';

@ApiTags('Booking (Administrator)')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookingService: BookingService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterAllBooking) {
    const where: Prisma.BookingWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          {
            bookingCode: {
              contains: options.textSearch
            }
          },
          {
            User: {
              phone: {
                contains: options.textSearch
              }
            }
          },
          {
            User: {
              email: {
                contains: options.textSearch
              }
            }
          },
        ]
      });
    }

    if (options.statuses && options.statuses.length > 0) {
      // @ts-ignore
      where.AND.push({
        status: { in: options.statuses },
      });
    }

    const whereInput: Prisma.BookingFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        },
        Tour: {
          include: {
            City: true,
            TourImage: true,
            Review: true,
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
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-booking/:id')
  async updateBooking(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number, @Body() body: UpdateBookingDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateBookingDto) => !UpdateBookingDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.updateBooking.wrong_parameter', { keyNotInDto })));

    const booking = await this.bookingService.findOne({
      where: {
        id: id
      },
      include: {
        Tour: true
      }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.updateBooking.not_found')));

    if (body.startDate) {
      if (moment().startOf('day').isAfter(moment(body.startDate)))
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.updateBooking.invalid_start_date')));
    }
  
    if (body.endDate) {
      const startDate = body.startDate || booking.startDate;
      if (moment(body.endDate).isBefore(startDate))
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.updateBooking.invalid_end_date')));
    }
  
    const updateData: Prisma.BookingUpdateInput = {
      ...body,
      updatedBy: user.data.id + ' - ' + user.data.name,
    };
  
    if (body.numberOfAdults || body.numberOfChildren) {
      const newNumberOfAdults = body.numberOfAdults ?? booking.numberOfAdults;
      const newNumberOfChildren = body.numberOfChildren ?? booking.numberOfChildren;
      const totalGuests = newNumberOfAdults + newNumberOfChildren;
      
      if (totalGuests <= 0) {
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.updateBooking.invalid_number_of_guests')));
      }
  
      const totalPrice = booking.Tour.price * totalGuests;
      updateData.totalPrice = totalPrice;
    }
  
    return await this.bookingService.update(
      booking.id,
      updateData
    );
  }
}
