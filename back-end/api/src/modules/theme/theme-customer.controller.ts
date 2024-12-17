import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { FilterThemeDto } from './dto/filter-theme.dto';
import { ThemeService } from './theme.service';

@ApiTags('Theme (Customer)')
@Controller('theme-customer')
export class ThemeCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly themeService: ThemeService,
    private readonly i18n: I18nCustomService,
  ) { }

  @Get()
  async findAll(@Query() options: FilterThemeDto) {
    const where: Prisma.ThemeWhereInput = { AND: [] };

    // @ts-ignore
    where.AND.push({ isActive: true });

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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const theme = await this.themeService.findOne({ 
      where: { id, isActive: true },
    });
    if (!theme) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.theme.findOne.not_found')));

    return theme;
  }
}
