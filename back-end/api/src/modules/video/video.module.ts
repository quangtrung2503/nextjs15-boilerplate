import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { VideoCustomerController } from './video-customer.controller';

@Module({
  controllers: [VideoController, VideoCustomerController],
  providers: [VideoService],
  exports: [VideoModule, VideoService],
  imports: [
    PrismaModule,
    I18nCustomModule,
  ]
})
export class VideoModule {}
