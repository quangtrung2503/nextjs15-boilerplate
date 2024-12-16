import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { DestinationService } from './destination.service';
import { FilterDestinationDto } from './dto/filter-destination.dto';

@ApiTags('Destination (Customer)')
@Controller('destination-customer')
export class DestinationCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly destinationService: DestinationService,
    private readonly i18n: I18nCustomService,
  ) { }

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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const destination = await this.destinationService.findOne({ 
      where: { id }
    });
    if (!destination) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.destination.findOne.not_found')));

    return destination;
  }

}