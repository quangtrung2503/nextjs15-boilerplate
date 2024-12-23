import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';
import { BookingService } from './booking.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { UpdateStatusBookingDto, UpdateStatusBookingDtoKeys } from './dto/update-status-booking.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { FilterAllBooking } from './dto/filter-booking.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

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
  @Patch('update-status/:id')
  async updateStatus(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateStatusBookingDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateStatusBookingDto) => !UpdateStatusBookingDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.booking.updateStatus.wrong_parameter', { keyNotInDto })));

    const booking = await this.bookingService.findOne({
      where: {
        id: id
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
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.booking.updateStatus.not_found')));

    return await this.bookingService.update(
      booking.id,
      {
        status: body.status
      }
    )
  }
}
