import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { ThemeService } from '../theme/theme.service';
import { FilterTourImageDto } from './dto/filter-tour-image.dto';
import { FilterTourDto } from './dto/filter-tour.dto';
import { TourImageService } from './tour-image.service';
import { TourService } from './tour.service';
import { processTourList } from './functions/tour.utils';
import { FilterReviewDto } from './dto/filter-review.dto';
import { ReviewService } from '../review/review.service';
import { Duration } from 'src/helpers/constants/enum.constant';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

@ApiTags('Tour (Customer)')
@Controller('tour-customer')
export class TourCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tourService: TourService,
    private readonly tourImageService: TourImageService,
    private readonly i18n: I18nCustomService,
    private readonly themeService: ThemeService,
    private readonly reviewService: ReviewService
  ) { }

  @Get()
  async findAll(@Query() options: FilterTourDto) {
    let where: Prisma.TourWhereInput = {
      AND: [
        {
          isActive: true,
          startDate: { gte: moment().startOf('day').toDate() }
        }
      ]
    };

    if (options.textSearch) {
      const searchNumber = Number(options.textSearch);

      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } },
          {
            numberOfPeople: !isNaN(searchNumber)
              ? { gte: searchNumber - 5, lte: searchNumber + 5 }  // Xấp xỉ ±5
              : undefined
          },
          { price: !isNaN(searchNumber) ? { gte: searchNumber * 0.9, lte: searchNumber * 1.1 } : undefined } // ±10% giá
        ]
      });
    }

    if (options?.isFeature !== undefined) {
      where = {
        ...where,
        isFeature: options.isFeature
      }
    }

    if (options?.cityId) {
      where = {
        ...where,
        cityId: options.cityId
      }
    }

    if (options?.themeIds && options.themeIds.length > 0) {
      where = {
        ...where,
        themeId: { in: options.themeIds }
      }
    }

    if (options?.destinationIds && options.destinationIds.length > 0) {
      where = {
        ...where,
        TourDestination: {
          some: {
            destinationId: { in: options.destinationIds }
          }
        }
      }
    }

    if (options?.durations && options.durations.length > 0) {
      const durationFilters = options.durations.map(duration => {
        switch (duration) {
          case Duration.ZERO_TO_THREE_HOURS:
            return { numberOfHours: { gt: 0, lte: 3 } };
          case Duration.THREE_TO_FIVE_HOURS:
            return { numberOfHours: { gt: 3, lte: 5 } };
          case Duration.FIVE_TO_SEVEN_HOURS:
            return { numberOfHours: { gt: 5, lte: 7} };
          case Duration.FULL_DAY:
            return { numberOfHours: { gt: 7, lte: 24 } };
          case Duration.MULTI_DAY:
            return { numberOfHours: { gt: 24 } };
          default:
            return {};
        }
      });

      // @ts-ignore
      where.AND.push({ OR: durationFilters });
    }

    if (options?.from || options?.to) {
      const dateFilters: Prisma.TourWhereInput[] = [];

      if (options?.from) {
        dateFilters.push({ startDate: { gte: moment(options.from).startOf('day').toDate() } });
      }

      if (options?.to) {
        dateFilters.push({ startDate: { lte: moment(options.to).endOf('day').toDate() } });
      }

      if (dateFilters.length > 0) {
        // @ts-ignore
        where.AND.push(...dateFilters);
      }
    }

    const whereInput: Prisma.TourFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        City: true,
        Theme: true,
        TourDestination: {
          include: {
            Destination: true
          }
        },
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
      }
    };

    const raw = await funcListPaging(
      this.tourService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    const modifiedResults = {
      ...raw,
      items: raw?.items.map(tour => {
        const reviews = tour.Review || [];
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        delete tour.Review;
        const { _count, ...tourWithoutReview } = tour;

        return {
          ...tourWithoutReview,
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews: _count.Review
        };
      })

    };

    return modifiedResults;
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const tour = await this.tourService.findOne({
      where: {
        slug,
        isActive: true,
        startDate: { gte: moment().startOf('day').toDate() }
      },
      include: {
        City: true,
        Theme: true,
        TourDestination: {
          include: {
            Destination: true
          }
        },
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
      }
    });
    if (!tour) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.findOne.not_found')));

    const reviews = tour.Review || [];
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    delete tour.Review;

    const { _count, ...tourWithoutReview } = tour;

    const [listTourInToday, listTourSameCity] = await Promise.all([
      this.tourService.findAll({
        where: {
          AND: [
            { isActive: true },
            { startDate: moment().startOf('day').toDate() },
            { id: { not: tour.id } }
          ]
        },
        include: {
          City: true,
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
        take: 10
      }),

      this.tourService.findAll({
        where: {
          AND: [
            { isActive: true },
            { cityId: tour.cityId },
            { id: { not: tour.id } },
            { startDate: { gte: moment().startOf('day').toDate() } }
          ]
        },
        include: {
          City: true,
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
        take: 10
      })
    ]);

    return {
      tour: {
        ...tourWithoutReview,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: _count.Review
      },
      listTourInToday: processTourList(listTourInToday),
      listTourSameCity: processTourList(listTourSameCity)
    };
  }

  @Get('get-review/:tourId')
  async getReviewTour(@Param('tourId', ParseIdPipe) tourId: number, @Query() options: FilterReviewDto) {
    let where: Prisma.ReviewWhereInput = {
      tourId: tourId,
      isActive: true
    };

    if (options.textSearch) {
      where = {
        ...where,
        OR: [
          { title: { contains: options.textSearch } },
          {
            User: {
              name: { contains: options.textSearch },
              email: { contains: options.textSearch }
            }
          }
        ]
      }
    }

    if (options.ratings) {
      where = {
        ...where,
        rating: { in: options.ratings }
      }
    }

    const stats = await this.prismaService.review.aggregate({
      where: {
        tourId: tourId,
        isActive: true
      },
      _avg: {
        rating: true,
        ratingGuide: true,
        ratingTransportation: true,
        ratingValueOfMoney: true,
        ratingSafety: true
      },
      _count: {
        _all: true
      }
    });

    const whereInput: Prisma.ReviewFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    }

    const reviews = await funcListPaging(
      this.reviewService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    return {
      ...reviews,
      stats: {
        avgRating: Number(stats._avg.rating?.toFixed(1)) || 0,
        avgRatingGuide: Number(stats._avg.ratingGuide?.toFixed(1)) || 0,
        avgRatingTransportation: Number(stats._avg.ratingTransportation?.toFixed(1)) || 0,
        avgRatingValueOfMoney: Number(stats._avg.ratingValueOfMoney?.toFixed(1)) || 0,
        avgRatingSafety: Number(stats._avg.ratingSafety?.toFixed(1)) || 0,
        totalReviews: stats._count._all
      }
    };
  }

  @Get('/galary/get-images')
  async findAllTourImages(@Query() options: FilterTourImageDto) {
    const whereInput: Prisma.TourImageFindManyArgs = {
      where: {
        Tour: {
          isActive: true,
          startDate: { gte: moment().startOf('day').toDate() }
        }
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.tourImageService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @Get('/outside/three-themes-tours')
  async getThreeThemesWithTours() {
    const latestThemes = await this.themeService.findAll({
      where: {
        isDisplay: true,
        Tour: {
          some: {
            isActive: true,
            startDate: { gte: moment().startOf('day').toDate() }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      include: {
        Tour: {
          where: {
            isActive: true,
            startDate: { gte: moment().startOf('day').toDate() }
          },
          orderBy: { updatedAt: 'desc' },
          take: 10,
          include: {
            City: true,
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
          }
        }
      }
    });

    const modifiedThemes = latestThemes.map(theme => {
      const modifiedTours = processTourList(theme.Tour);

      return {
        ...theme,
        Tour: modifiedTours
      };
    });

    return modifiedThemes;
  }
}