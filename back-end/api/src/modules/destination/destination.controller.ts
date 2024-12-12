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
import { DestinationService } from './destination.service';
import { CreateDestinationDto, CreateDestinationDtoKeys } from './dto/create-destination.dto';
import { FilterDestinationDto } from './dto/filter-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';

@ApiTags('Destination')
@Controller('destination')
export class DestinationController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly destinationService: DestinationService,
    private readonly i18n: I18nCustomService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateDestinationDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateDestinationDto) => !CreateDestinationDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.destination.create.wrong_parameter', { keyNotInDto })));

    return this.destinationService.create({
      data: body
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterDestinationDto) {
    const where: Prisma.DestinationWhereInput = { AND: [] };
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

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const destination = await this.destinationService.findOne({ 
      where: { id }
    });
    if (!destination) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.destination.findOne.not_found')));

    return destination;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateDestinationDto) {
    const existingDestination = await this.destinationService.findOne({ where: { id } });
    if (!existingDestination) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.destination.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateDestinationDto) => !CreateDestinationDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.destination.update.wrong_parameter', { keyNotInDto })));

    return this.destinationService.update(id, body);

  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const destination = await this.destinationService.findOne({ where: { id } });
    if (!destination) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.destination.remove.not_found')));

    return this.destinationService.remove({ where: { id } });
  }
}