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
        Tour: {
          select: {
            id: true,
            name: true
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
        }
      }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.findOne.not_found')));

    const tourId = booking.Tour.id;
    const tourName = booking.Tour.name;
    const TourImage = booking.Tour.TourImage;
    const TourDestination = booking.Tour.TourDestination;
    const User = booking.User;

    delete booking.Tour;

    return {
      ...booking,
      Tour: {
        id: tourId,
        name: tourName,
        TourImage: TourImage,
        TourDestination: TourDestination
      },
      User: User
    };
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
      }
    });

    if (!booking)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.updateBooking.not_found')));

    const updateData: Prisma.BookingUpdateInput = {
      ...body,
      updatedBy: user.data.id + ' - ' + user.data.name,
    };

    return await this.bookingService.update(
      booking.id,
      updateData
    );
  }
}
