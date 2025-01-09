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
import { CityService } from './city.service';
import { CreateCityDto, CreateCityDtoKeys } from './dto/create-city.dto';
import { FilterCityDto } from './dto/filter-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';
import { convertToEn } from 'src/helpers/functions/common.utils';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { TagService } from '../tag/tag.service';

@ApiTags('City (Administrator)')
@Controller('city')
export class CityController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cityService: CityService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService,
    private readonly tagService: TagService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateCityDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateCityDto) => !CreateCityDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.create.wrong_parameter', { keyNotInDto })));

    // Validate tags
    if (!body.tagIds || body.tagIds.length < 3) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.create.min_tags_required')));
    }

    if (body.tagIds.length > 5) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.create.max_tags_exceeded')));
    }

    // Check if all tags exist
    await Promise.all(
      body.tagIds.map(async (tagId) => {
        const tagExists = await this.tagService.findOne({
          where: { id: tagId, isActive: true }
        });
        if (!tagExists) {
          throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.create.tag_not_found')));
        }
        return tagExists;
      })
    );

    const cityData: Prisma.CityUncheckedCreateInput = {
      name: body.name,
      image: body.image,
      description: body.description,
      CityTag: {
        createMany: {
          data: body.tagIds.map((tagId: number) => ({ tagId }))
        }
      },
      slug: ''
    }

    const newCity = await this.cityService.create({
      data: cityData
    });

    return await this.cityService.update(newCity.id, {
      slug: `${convertToEn(newCity.name.split(' ').join('-'))}-i-${newCity.id}`
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterCityDto) {
    const where: Prisma.CityWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } }
        ]
      });
    }

    if (options?.from || options?.to) {
      // @ts-ignore
      where.AND = where.AND.concat([
        { createdAt: { gte: moment(options?.from).toDate() } },
        { createdAt: { lte: moment(options?.to).toDate() } },
      ])
    }

    const whereInput: Prisma.CityFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        CityTag: {
          include: {
            Tag: true
          }
        }
      }
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

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const city = await this.prismaService.city.findFirst({
      where: { id },
      include: {
        CityTag: {
          include: {
            Tag: true
          }
        }
      }
    });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.findOne.not_found')));

    const Tag = city.CityTag.map(cityTag => cityTag.Tag);

    delete city.CityTag;

    return {
      ...city,
      Tag
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateCityDto) {
    const existingCity = await this.cityService.findOne({ where: { id } });
    if (!existingCity) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateCityDto) => !CreateCityDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.update.wrong_parameter', { keyNotInDto })));

    if (body.tagIds) {
      if (body.tagIds.length < 3) {
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.update.min_tags_required')));
      }

      if (body.tagIds.length > 5) {
        throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.update.max_tags_exceeded')));
      }

      await Promise.all(
        body.tagIds.map(async (tagId) => {
          const tagExists = await this.tagService.findOne({
            where: { id: tagId, isActive: true }
          });
          if (!tagExists) {
            throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.update.tag_not_found')));
          }
          return tagExists;
        })
      )
    }

    const updatedData: Prisma.CityUpdateInput = {
      image: body.image,
      description: body.description
    };

    if (body.name && body.name !== existingCity.name) {
      updatedData.name = body.name;
      updatedData.slug = `${convertToEn(body.name.split(' ').join('-'))}-i-${id}`;
    }

    if (body.tagIds && body.tagIds.length > 0) {
      updatedData.CityTag = {
        deleteMany: { cityId: id },
        createMany: {
          data: body.tagIds.map((tagId: number) => ({ tagId }))
        }
      }
    }

    return this.cityService.update(id, updatedData);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id', ParseIdPipe) id: number) {
    const existingCity = await this.cityService.findOne({ where: { id } });
    if (!existingCity) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.setActive.not_found')));

    const newStatus = !existingCity.isActive;

    const updateCity = await this.cityService.update(existingCity.id, { isActive: newStatus });

    if (newStatus === false) {
      const toursToUpdate = await this.tourService.findAll({
        where: { cityId: existingCity.id },
        select: { id: true },
      });

      const tourIds = toursToUpdate.map(tour => tour.id);

      await this.tourService.updateMany(
        { id: { in: tourIds } },
        { isActive: newStatus }
      );

    }

    return updateCity;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    const city = await this.cityService.findOne({ where: { id } });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.remove.not_found')));

    return this.cityService.remove({ where: { id } });
  }
}