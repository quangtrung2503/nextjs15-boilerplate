import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { VideoService } from './video.service';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';

@ApiTags('Video (Customer)')
@Controller('video-customer')
export class VideoCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly videoService: VideoService,
    private readonly i18n: I18nCustomService,
  ) { }

  @Get('display')
  async getVideoDisplay() {
    const video = await this.videoService.findOne({
      where: {
        isDisplay: true
      }
    });

    if (!video) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.video.findOne.not_found')));
    }

    return video;
  }

}