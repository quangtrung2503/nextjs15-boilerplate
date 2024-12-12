import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  controllers: [ThemeController],
  providers: [ThemeService],
  exports: [ThemeModule, ThemeService],
  imports: [
    PrismaModule,
    I18nCustomModule
  ],
})
export class ThemeModule {}
