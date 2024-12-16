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

@ApiTags('Tour (Customer)')
@Controller('tour-customer')
export class TourCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tourService: TourService,
    private readonly tourImageService: TourImageService,
    private readonly i18n: I18nCustomService,
    private readonly themeService: ThemeService,
  ) { }

  @Get()
  async findAll(@Query() options: FilterTourDto) {
    let where: Prisma.TourWhereInput = {
      AND: [
        {
          startDate: { gte: moment().startOf('day').toDate() }
        }
      ]
    };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } },
          { numberOfPeople: !isNaN(Number(options.textSearch)) ? Number(options.textSearch) : undefined },
          { price: !isNaN(Number(options.textSearch)) ? Number(options.textSearch) : undefined }
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

    if (options?.destinationId) {
      where = {
        ...where,
        destinationId: options.destinationId
      }
    }

    if (options?.duration) {
      where = {
        ...where,
        duration: options.duration
      }
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
        Destination: true,
        TourImage: true,
        Review: true,
      }
    };

    return await funcListPaging(
      this.tourService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const tour = await this.tourService.findOne({
      where: {
        id,
        startDate: { gte: moment().startOf('day').toDate() }
      },
      include: {
        City: true,
        Theme: true,
        Destination: true,
        TourImage: true,
        Review: true,
      }
    });
    if (!tour) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tour.findOne.not_found')));

    const [listTourInToday, listTourSameCity] = await Promise.all([
      this.tourService.findAll({
        where: {
          AND: [
            { startDate: moment().startOf('day').toDate() },
            { id: { not: tour.id } }
          ]
        },
        include: {
          City: true,
          TourImage: true,
          Review: true,
        },
        take: 10
      }),

      this.tourService.findAll({
        where: {
          AND: [
            { cityId: tour.cityId },
            { id: { not: tour.id } },
            { startDate: { gte: moment().startOf('day').toDate() } }
          ]
        },
        include: {
          City: true,
          TourImage: true,
          Review: true,
        },
        take: 10
      })
    ]);

    return {
      tour,
      listTourInToday,
      listTourSameCity
    };
  }

  @Get('/galary/get-images')
  async findAllTourImages(@Query() options: FilterTourImageDto) {
    const whereInput: Prisma.TourImageFindManyArgs = {
      where: {
        Tour: {
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
            startDate: { gte: moment().startOf('day').toDate() }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      include: {
        Tour: {
          where: {
            startDate: { gte: moment().startOf('day').toDate() }
          },
          orderBy: { updatedAt: 'desc' },
          take: 10,
          include: {
            City: true,
            TourImage: true,
            Review: true,
          }
        }
      }
    });

    return latestThemes;
  }
}
