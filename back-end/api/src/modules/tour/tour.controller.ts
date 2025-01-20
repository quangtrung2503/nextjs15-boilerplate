import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { CityService } from '../city/city.service';
import { DestinationService } from '../destination/destination.service';
import { ThemeService } from '../theme/theme.service';
import { CreateTourDto, CreateTourDtoKeys } from './dto/create-tour.dto';
import { FilterTourDto } from './dto/filter-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourImageService } from './tour-image.service';
import { TourService } from './tour.service';
import { Duration, TourSortField } from 'src/helpers/constants/enum.constant';
import { convertToEn } from 'src/helpers/functions/common.utils';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

@ApiTags('Tour (Administrator)')
@Controller('tour')
export class TourController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tourService: TourService,
    private readonly tourImageService: TourImageService,
    private readonly i18n: I18nCustomService,
    private readonly cityService: CityService,
    private readonly themeService: ThemeService,
    private readonly destinationService: DestinationService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateTourDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateTourDto) => !CreateTourDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.wrong_parameter', { keyNotInDto })));

    if (!body.images || body.images.length === 0)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.images_required')));

    const cityExists = await this.cityService.findOne({
      where: { id: body.cityId, isActive: true }
    });
    if (!cityExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.city_not_found')));

    const themeExists = await this.themeService.findOne({
      where: { id: body.themeId, isActive: true }
    });
    if (!themeExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.theme_not_found')));

    // Validate destinations
    if (!body.destinationIds || body.destinationIds.length === 0) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.destinations_required')));
    }

    // Check if all destinations exist
    await Promise.all(
      body.destinationIds.map(async (destinationId) => {
        const destinationExists = await this.destinationService.findOne({
          where: { id: destinationId, isActive: true }
        });
        if (!destinationExists) {
          throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.create.destination_not_found')));
        }
        return destinationExists;
      })
    );

    const tourData: Prisma.TourUncheckedCreateInput = {
      name: body.name,
      slug: '',
      price: body.price,
      transport: body.transport,
      package: body.package,
      numberOfHours: body.numberOfHours,

      description: body.description,
      activity: body.activity,
      included: body.included,
      notIncluded: body.notIncluded,
      safety: body.safety,
      language: body.language,
      guideMeetingAddress: body.guideMeetingAddress,

      cityId: body.cityId,
      themeId: body.themeId,
      TourImage: {
        createMany: {
          data: body.images.map((image: string) => ({ image: image }))
        }
      },
      TourDestination: {
        createMany: {
          data: body.destinationIds.map((destinationId: number) => ({ destinationId }))
        }
      }
    }

    const newTour = await this.tourService.create({
      data: tourData,
    });

    return await this.tourService.update(newTour.id, {
      slug: `${convertToEn(newTour.name.split(' ').join('-'))}-i-${newTour.id}`
    })
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterTourDto) {
    let where: Prisma.TourWhereInput = { AND: [] };
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
        Review: true,
        _count: {
          select: {
            Review: true
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

        const Review = tour.Review;
        delete tour.Review;
        const { _count, ...tourWithoutReview } = tour;

        return {
          ...tourWithoutReview,
          Review,
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews: _count.Review
        };
      })

    };

    return modifiedResults;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const tour = await this.tourService.findOne({
      where: { id },
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
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            Review: true
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

    return {
      ...tourWithoutReview,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: _count.Review
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateTourDto) {
    const existingTour = await this.tourService.findOne({ where: { id } });
    if (!existingTour) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateTourDto) => !CreateTourDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.update.wrong_parameter', { keyNotInDto })));

    if (body.cityId) {
      const cityExists = await this.cityService.findOne({
        where: { id: body.cityId, isActive: true }
      });
      if (!cityExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.update.city_not_found')));
    }

    if (body.themeId) {
      const themeExists = await this.themeService.findOne({
        where: { id: body.themeId, isActive: true }
      });
      if (!themeExists) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.update.theme_not_found')));
    }

    // Validate destinations if provided
    if (body.destinationIds) {
      await Promise.all(
        body.destinationIds.map(async (destinationId) => {
          const destinationExists = await this.destinationService.findOne({
            where: { id: destinationId, isActive: true },
          });
          if (!destinationExists) {
            throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tour.update.destination_not_found')));
          }
        })
      );
    }

    const updateData: Prisma.TourUpdateInput = {
      price: body.price,
      transport: body.transport,
      package: body.package,
      numberOfHours: body.numberOfHours,

      description: body.description,
      activity: body.activity,
      included: body.included,
      notIncluded: body.notIncluded,
      safety: body.safety,
      language: body.language,
      guideMeetingAddress: body.guideMeetingAddress,

      ...(body.cityId && { City: { connect: { id: body.cityId } } }),
      ...(body.themeId && { Theme: { connect: { id: body.themeId } } }),
    };

    // Handle images update
    if (body.images && body.images.length > 0) {
      updateData.TourImage = {
        deleteMany: { tourId: id },
        createMany: {
          data: body.images.map((image: string) => ({ image: image }))
        }
      };
    }

    // Handle destinations update
    if (body.destinationIds && body.destinationIds.length > 0) {
      updateData.TourDestination = {
        deleteMany: { tourId: id },
        createMany: {
          data: body.destinationIds.map((destinationId: number) => ({ destinationId }))
        }
      };
    }

    if (body.name) {
      updateData.name = body.name;
      updateData.slug = `${convertToEn(body.name.split(' ').join('-'))}-i-${id}`;
    }

    return await this.tourService.update(id, updateData);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id', ParseIdPipe) id: number) {
    const existingTour = await this.prismaService.tour.findFirst({
      where: { id },
      include: {
        City: true,
        Theme: true,
        TourDestination: {
          include: {
            Destination: true
          }
        }
      }
    });

    if (!existingTour) {
      throw new BaseException(
        Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.setActive.not_found'))
      );
    }

    // Kiểm tra điều kiện active của City, Theme và Destinations
    const newStatus = !existingTour.isActive;

    // Nếu muốn active tour
    if (newStatus === true) {
      if (!existingTour.City.isActive) {
        throw new BaseException(
          Errors.BAD_REQUEST(this.i18n.t('common-message.tour.setActive.city_inactive', { city: existingTour.City.name }))
        );
      }

      if (!existingTour.Theme.isActive) {
        throw new BaseException(
          Errors.BAD_REQUEST(this.i18n.t('common-message.tour.setActive.theme_inactive', { theme: existingTour.Theme.name }))
        );
      }

      const activeDestinations = existingTour.TourDestination.filter(
        td => td.Destination.isActive
      );

      // Chỉ cho active tour nếu có ít nhất 1 destination hoạt động
      if (activeDestinations.length === 0) {
        throw new BaseException(
          Errors.BAD_REQUEST(this.i18n.t('common-message.tour.setActive.no_active_destination'))
        );
      }
    }

    const updatedTour = await this.tourService.update(existingTour.id, {
      isActive: newStatus
    });

    return updatedTour;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    const tour = await this.tourService.findOne({ where: { id } });
    if (!tour) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.remove.not_found')));

    return this.tourService.remove({ where: { id } });
  }
}