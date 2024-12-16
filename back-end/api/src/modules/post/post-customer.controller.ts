import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { _excludeObject } from 'src/helpers/functions/common.utils';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { PostService } from './post.service';

@ApiTags('Post (Customer)')
@Controller('post-customer')
export class PostCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly i18n: I18nCustomService,
  ) { }

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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postService.findOne({
      where: { id },
      include: {
        User: true
      }
    });
    if (!post) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.post.findOne.not_found')));

    const updatePost = await this.postService.update(+id, {
      views: post.views + 1
    });

    delete updatePost?.userCreatedId;

    return updatePost;
  }
}