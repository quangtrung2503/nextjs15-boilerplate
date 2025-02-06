import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { DestinationService } from './destination.service';
import { FilterDestinationDto, FilterPopularDestinationDto } from './dto/filter-destination.dto';
import { BookingStatus } from 'src/helpers/constants/enum.constant';

@ApiTags('Destination (Customer)')
@Controller('destination-customer')
export class DestinationCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly destinationService: DestinationService,
    private readonly i18n: I18nCustomService,
  ) { }

  @Get()
  async findAll(@Query() options: FilterDestinationDto) {
    let where: Prisma.DestinationWhereInput = { AND: [] };

    // @ts-ignore
    where.AND.push({ isActive: true });

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } }
        ]
      });
    }

    if (typeof options?.isFeature === 'boolean') {
      where = {
        ...where,
        isFeature: options.isFeature
      }
    }

    if (options?.from || options?.to) {
      // @ts-ignore
      where.AND.push({
        createdAt: {
          ...(options.from && { gte: moment(options.from).toDate() }),
          ...(options.to && { lte: moment(options.to).toDate() }),
        },
      });
    }

    const whereInput: Prisma.DestinationFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.destinationService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const destination = await this.destinationService.findOne({
      where: { slug, isActive: true }
    });
    if (!destination) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.destination.findOne.not_found')));

    return destination;
  }

  @Get('popular/get-popular-destinations')
  async getPopularDestinatons(@Query() options: FilterPopularDestinationDto) {
    const where: Prisma.DestinationWhereInput = {
      isActive: true,
      AND: [
        {
          TourDestination: {
            some: {
              Tour: {
                Booking: {
                  some: {
                    status: BookingStatus.COMPLETED
                  }
                }
              }
            }
          }
        }
      ]
    };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } }
        ]
      });
    }

    const raws = await this.prismaService.destination.findMany({
      where: where,
      include: {
        TourDestination: {
          include: {
            Tour: {
              include: {
                Booking: {
                  where: {
                    status: BookingStatus.COMPLETED
                  }
                }
              }
            }
          }
        }
      },
      take: 20
    });

    // Tính toán số lượng booking COMPLETED
    const processedDestinations = raws.map((destination) => {
      const completedBookingCount = destination.TourDestination.reduce(
        (count, tourDest) =>
          count + (tourDest.Tour?.Booking ? tourDest.Tour.Booking.length : 0),
        0
      );

      delete destination.TourDestination;
      return {
        ...destination,
        completedBookingCount,
      };
    });

    // Sắp xếp theo số lượng booking COMPLETED
    processedDestinations.sort((a, b) => b.completedBookingCount - a.completedBookingCount);

    return {
      items: processedDestinations,
    };
  }

}