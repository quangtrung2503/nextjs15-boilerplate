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
import { PostService } from './post.service';
import { CreatePostDto, CreatePostDtoKeys } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { _excludeObject } from 'src/helpers/functions/common.utils';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';

@ApiTags('Post (Administrator)')
@Controller('post')
export class PostController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly i18n: I18nCustomService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserDecorator() user: IUserJwt, @Body() body: CreatePostDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreatePostDto) => !CreatePostDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.post.create.wrong_parameter', { keyNotInDto })));

    return this.postService.create({
      data: {
        ...body,
        userCreatedId: user.data.id
      }
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterPostDto) {
    const where: Prisma.PostWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { title: { contains: options.textSearch } }
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

    const whereInput: Prisma.PostFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        User: true
      }
    };

    const raw = await funcListPaging(
      this.postService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    const items = raw?.items?.map((value) => {
      _excludeObject(value?.User, ['password', 'lastAccessToken']);
      value.UserCreated = value?.User;
      delete value?.User;
      return value;
    });

    return {
      ...raw,
      items
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postService.findOne({
      where: { id },
      include: {
        User: true
      }
    });
    if (!post) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.post.findOne.not_found')));

    const { User, ...rest } = post;

    const userCreated = _excludeObject(User, ['password', 'lastAccessToken']);

    return {
      ...rest,
      UserCreated: userCreated,
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdatePostDto) {
    const existingPost = await this.postService.findOne({ where: { id } });
    if (!existingPost) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.post.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdatePostDto) => !CreatePostDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.post.update.wrong_parameter', { keyNotInDto })));

    return this.postService.update(id, body);

  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id') id: number) {
    const existingPost = await this.postService.findOne({ where: { id } });
    if (!existingPost) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.post.setActive.not_found')));

    return await this.postService.update(existingPost.id, { isActive: !existingPost.isActive });
    
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const post = await this.postService.findOne({ where: { id } });
    if (!post) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.post.remove.not_found')));

    return this.postService.remove({ where: { id } });
  }
}