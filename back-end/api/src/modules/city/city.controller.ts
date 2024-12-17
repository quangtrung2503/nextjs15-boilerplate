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

@ApiTags('City (Administrator)')
@Controller('city')
export class CityController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cityService: CityService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateCityDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateCityDto) => !CreateCityDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.create.wrong_parameter', { keyNotInDto })));

    return this.cityService.create({
      data: body
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
    };

    return await funcListPaging(
      this.cityService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const city = await this.cityService.findOne({ 
      where: { id }
    });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.findOne.not_found')));

    return city;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateCityDto) {
    const existingCity = await this.cityService.findOne({ where: { id } });
    if (!existingCity) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateCityDto) => !CreateCityDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.city.update.wrong_parameter', { keyNotInDto })));

    return this.cityService.update(id, body);

  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id') id: number) {
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
  async remove(@Param('id') id: number) {
    const city = await this.cityService.findOne({ where: { id } });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.remove.not_found')));

    return this.cityService.remove({ where: { id } });
  }
}