import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  controllers: [TagController],
  providers: [TagService],
  exports: [TagModule, TagService],
  imports: [
    PrismaModule,
    I18nCustomModule,
  ]
})
export class TagModule {}
