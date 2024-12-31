import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TagService } from './tag.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateTagDto, CreateTagDtoKeys } from './dto/create-tag.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { FilterTagDto } from './dto/filter-tag.dto';
import moment from 'moment';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('Tag (Administrator)')
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateTagDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateTagDto) => !CreateTagDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tag.create.wrong_parameter', { keyNotInDto })));

    return await this.tagService.create({
      data: body
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterTagDto) {
    let where: Prisma.TagWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } }
        ]
      });
    }

    if (typeof options.isActive === 'boolean') {
      where = {
        ...where,
        isActive: options.isActive,
      }
    }

    if (options?.from || options?.to) {
      // @ts-ignore
      where.AND = where.AND.concat([
        { createdAt: { gte: moment(options?.from).toDate() } },
        { createdAt: { lte: moment(options?.to).toDate() } },
      ])
    }

    const whereInput: Prisma.TagFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.tagService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const tag = await this.tagService.findOne({
      where: { id }
    });
    if (!tag) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tag.findOne.not_found')));

    return tag;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateTagDto) {
    const existingTag = await this.tagService.findOne({ where: { id } });
    if (!existingTag) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tag.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateTagDto) => !CreateTagDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.tag.update.wrong_parameter', { keyNotInDto })));

    return this.tagService.update(id, body);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id', ParseIdPipe) id: number) {
    const existingTag = await this.tagService.findOne({ where: { id } });
    if (!existingTag) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tag.setActive.not_found')));

    return await this.tagService.update(existingTag.id, { isActive: !existingTag.isActive });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    const tag = await this.tagService.findOne({ where: { id } });
    if (!tag) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.tag.remove.not_found')));

    return this.tagService.remove({ where: { id } });
  }
}
