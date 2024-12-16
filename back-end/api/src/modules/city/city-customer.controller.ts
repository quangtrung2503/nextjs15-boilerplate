import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { CityService } from './city.service';
import { FilterCityDto } from './dto/filter-city.dto';

@ApiTags('City (Customer)')
@Controller('city-customer')
export class CityCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cityService: CityService,
    private readonly i18n: I18nCustomService,
  ) { }

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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const city = await this.cityService.findOne({ 
      where: { id }
    });
    if (!city) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.city.findOne.not_found')));

    return city;
  }

}