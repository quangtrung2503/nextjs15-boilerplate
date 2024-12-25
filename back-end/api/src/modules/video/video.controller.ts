import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateVideoDto, CreateVideoDtoKeys } from './dto/create-video.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { FilterVideoDto } from './dto/filter-video.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { UpdateVideoDto } from './dto/update-video.dto';

@ApiTags('Video (Administrator)')
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly i18n: I18nCustomService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateVideoDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateVideoDto) => !CreateVideoDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.video.create.wrong_parameter', { keyNotInDto })));

    await this.videoService.updateMany(
      { isDisplay: true },
      { isDisplay: false }
    );

    return await this.videoService.create({
      data: {
        ...body,
        isDisplay: body.isDisplay ?? true
      }
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterVideoDto) {
    let where: Prisma.VideoWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { title: { contains: options.textSearch } }
        ]
      });
    }

    if (options.isDisplay !== undefined) {
      where = {
        ...where,
        isDisplay: options.isDisplay,
      }
    }

    const whereInput: Prisma.VideoFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.videoService,
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
    const video = await this.videoService.findOne({
      where: { id }
    });
    if (!video) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.video.findOne.not_found')));

    return video;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateVideoDto) {
    const existingVideo = await this.videoService.findOne({ where: { id } });
    if (!existingVideo) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.video.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateVideoDto) => !CreateVideoDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.video.update.wrong_parameter', { keyNotInDto })));

    if (body.isDisplay === false && existingVideo.isDisplay) {
      const latestVideo = await this.videoService.findOne({
        where: {
          id: { not: id }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (latestVideo) {
        await this.videoService.update(latestVideo.id, {
          isDisplay: true
        });
      }
    }
    else if (body.isDisplay !== false) {
      await this.videoService.updateMany(
        { 
          id: { not: id },
          isDisplay: true
        },
        { isDisplay: false }
      );
    }

    return this.videoService.update(id, {
      ...body,
      isDisplay: body.isDisplay ?? true
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    const video = await this.videoService.findOne({ where: { id } });
    if (!video) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.video.remove.not_found')));

    if (video.isDisplay) {
      const latestVideo = await this.videoService.findOne({
        where: {
          id: { not: id }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (latestVideo) {
        await this.videoService.update(latestVideo.id, {
          isDisplay: true
        });
      }
    }

    return this.videoService.remove({ where: { id } });
  }
}
