import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDto, CreateThemeDtoKeys } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { FilterThemeDto } from './dto/filter-theme.dto';
import moment from 'moment';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';

@ApiTags('Theme (Administrator)')
@Controller('theme')
export class ThemeController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly themeService: ThemeService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateThemeDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateThemeDto) => !CreateThemeDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.theme.create.wrong_parameter', { keyNotInDto })));

    return this.themeService.create({
      data: body
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterThemeDto) {
    const where: Prisma.ThemeWhereInput = { AND: [] };
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

    const whereInput: Prisma.ThemeFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.themeService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const theme = await this.themeService.findOne({ 
      where: { id }
    });
    if (!theme) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.theme.findOne.not_found')));

    return theme;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateThemeDto) {
    const existingTheme = await this.themeService.findOne({ where: { id } });
    if (!existingTheme) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.theme.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateThemeDto) => !CreateThemeDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.theme.update.wrong_parameter', { keyNotInDto })));

    return this.themeService.update(id, body);

  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id') id: number) {
    const existingTheme = await this.themeService.findOne({ where: { id } });
    if (!existingTheme) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.theme.setActive.not_found')));

    const newStatus = !existingTheme.isActive;

    const updateTheme = await this.themeService.update(existingTheme.id, { isActive: newStatus });

    if (newStatus === false) {
      const toursToUpdate = await this.tourService.findAll({
        where: { cityId: existingTheme.id },
        select: { id: true },
      });

      const tourIds = toursToUpdate.map(tour => tour.id);

      await this.tourService.updateMany(
        { id: { in: tourIds } },
        { isActive: newStatus }
      );
      
    }

    return updateTheme;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const theme = await this.themeService.findOne({ where: { id } });
    if (!theme) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.theme.remove.not_found')));

    return this.themeService.remove({ where: { id } });
  }
}
