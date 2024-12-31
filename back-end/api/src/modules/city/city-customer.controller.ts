import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { SortOrder } from 'src/helpers/constants/enum.constant';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { CityService } from './city.service';
import { FilterCityCustomerDto } from './dto/filter-city.dto';

@ApiTags('City (Customer)')
@Controller('city-customer')
export class CityCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cityService: CityService,
    private readonly i18n: I18nCustomService,
  ) { }

  @Get()
  async findAllPopularCities(@Query() options: FilterCityCustomerDto) {
    const where: Prisma.CityWhereInput = { AND: [] };

    // @ts-ignore
    where.AND.push({ isActive: true });

    const whereInput: Prisma.CityFindManyArgs = {
      where: {
        ...where,
        Tour: {
          some: {}
        }
      },
      include: {
        CityTag: {
          include: {
            Tag: true
          }
        }
      },
      orderBy: {
        Tour: {
          _count: SortOrder.DESC
        }
      },
    };

    const raw = await funcListPaging(
      this.cityService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    const modifiedResults = {
      ...raw,
      items: raw?.items.map(city => {
        const Tag = city.CityTag.map(cityTag => cityTag.Tag);
        delete city.CityTag;
        return {
          ...city,
          Tag
        };
      })
    }

    return modifiedResults;
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const city = await this.prismaService.city.findFirst({
      where: { slug, isActive: true },
      include: {
        CityTag: {
          include: {
            Tag: true
          }
        },
        Tour: {
          where: {
            isActive: true,
          },
          include: {
            TourImage: true,
            Review: {
              where: { isActive: true },
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                Review: {
                  where: { isActive: true }
                }
              }
            }
          },
          orderBy: {
            Booking: {
              _count: SortOrder.DESC
            }
          },
          take: 4
        }
      }
    });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.findOne.not_found')));

    city.Tour = city.Tour.map(tour => {
      const totalReviews = tour.Review.length;
      const averageRating = totalReviews > 0
        ? tour.Review.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

      delete tour.Review;
      delete tour._count;

      return {
        ...tour,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
      };
    });

    const Tag = city.CityTag.map(cityTag => cityTag.Tag);

    delete city.CityTag;

    return {
      ...city,
      Tag
    };

  }

}