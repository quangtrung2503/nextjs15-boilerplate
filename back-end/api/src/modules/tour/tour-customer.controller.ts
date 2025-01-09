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
import { FilterReviewCustomerDto } from './dto/filter-review-customer.dto';
import { ReviewService } from '../review/review.service';
import { Duration, SortOrder, TourSortField } from 'src/helpers/constants/enum.constant';

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
        }
      ]
    };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } },
          {
            TourDestination: {
              some: {
                Destination: {
                  name: { contains: options.textSearch }
                }
              }
            }

          },
        ]
      });
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

    if (typeof options?.isFeatureDestination === 'boolean') {
      where = {
        ...where,
        TourDestination: {
          some: {
            ...where.TourDestination?.some,
            Destination: {
              isFeature: true
            }
          }
        }
      };
    }

    if (options?.durations && options.durations.length > 0) {
      const durationFilters = options.durations.map(duration => {
        switch (duration) {
          case Duration.ZERO_TO_THREE_HOURS:
            return { numberOfHours: { gt: 0, lte: 3 } };
          case Duration.THREE_TO_FIVE_HOURS:
            return { numberOfHours: { gt: 3, lte: 5 } };
          case Duration.FIVE_TO_SEVEN_HOURS:
            return { numberOfHours: { gt: 5, lte: 7 } };
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
      const fromDate = options?.from ? moment(options.from) : null;
      const toDate = options?.to ? moment(options.to) : null;

      if (fromDate && toDate) {
        const hoursDiff = toDate.diff(fromDate, 'hours');

        // @ts-ignore
        where.AND.push({
          numberOfHours: {
            lte: hoursDiff
          }
        });
      }
    }

    let orderBy: Prisma.TourOrderByWithRelationInput = {};

    if (options?.sortField === TourSortField.POPULARITY) {
      orderBy = {
        Booking: {
          _count: options?.sortOrder
        }
      };
    } else {
      orderBy = {
        [options?.sortField]: options?.sortOrder,
      };
    }

    const whereInput: Prisma.TourFindManyArgs = {
      where: where,
      orderBy: orderBy,
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
            },
            Booking: true
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

  @Get('get-review/:slug')
  async getReviewTour(@Param('slug') slug: string, @Query() options: FilterReviewCustomerDto) {
    const tour = await this.tourService.findOne({
      where: { slug: slug },
      select: { id: true }
    });

    if (!tour) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.getReviewTour.not_found')))
    }

    const tourId = tour.id;

    let where: Prisma.ReviewWhereInput = {
      tourId: tourId,
      isActive: true
    };

    if (options.ratings?.length) {
      where = {
        ...where,
        OR: options.ratings.map(rating => ({
          AND: [
            { rating: { gte: rating - 0.5 } },
            { rating: { lt: rating + 0.5 } }
          ]
        }))
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
        avgRatingGuide: Number(stats._avg.ratingGuide?.toFixed(1)) || 0,
        avgRatingTransportation: Number(stats._avg.ratingTransportation?.toFixed(1)) || 0,
        avgRatingValueOfMoney: Number(stats._avg.ratingValueOfMoney?.toFixed(1)) || 0,
        avgRatingSafety: Number(stats._avg.ratingSafety?.toFixed(1)) || 0,
        avgRating: Number((((Number(stats._avg.ratingGuide?.toFixed(1)) || 0) +
          (Number(stats._avg.ratingTransportation?.toFixed(1)) || 0) +
          (Number(stats._avg.ratingValueOfMoney?.toFixed(1)) || 0) +
          (Number(stats._avg.ratingSafety?.toFixed(1)) || 0)) / 4).toFixed(1)),
        totalReviews: stats._count._all
      }
    };
  }

  @Get('trending/get-best-trending')
  async getTrendingTour() {
    const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();

    const trendingTour = await this.tourService.findOne({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          Booking: {
            _count: SortOrder.DESC
          }
        },
        {
          Review: {
            _count: SortOrder.DESC
          }
        }
      ],
      include: {
        City: true,
        TourImage: true,
        Review: {
          where: {
            isActive: true,
            createdAt: {
              gte: thirtyDaysAgo
            }
          },
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            Review: {
              where: {
                isActive: true,
                createdAt: {
                  gte: thirtyDaysAgo
                }
              }
            },
            Booking: {
              where: {
                createdAt: {
                  gte: thirtyDaysAgo
                }
              }
            }
          }
        }
      }
    });

    if (!trendingTour) {
      return null;
    }

    // Tính toán rating trung bình
    const reviews = trendingTour.Review || [];
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    delete trendingTour.Review;
    const { _count, ...tourData } = trendingTour;

    return {
      ...tourData,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: _count.Review,
      totalBookings: _count.Booking,
      period: '30 days',
    };
  }

  @Get('/gallery/get-images')
  async findAllTourImages(@Query() options: FilterTourImageDto) {
    const whereInput: Prisma.TourImageFindManyArgs = {
      where: {
        Tour: {
          isActive: true,
        }
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        Tour: {
          select: {
            slug: true,
          }
        },
      }
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
          }
        }
      },
      orderBy: { updatedAt: SortOrder.DESC },
      take: 3,
      include: {
        Tour: {
          where: {
            isActive: true,
          },
          orderBy: { updatedAt: SortOrder.DESC },
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