import { forwardRef, Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { ThemeCustomerController } from './theme-customer.controller';
import { TourModule } from '../tour/tour.module';

@Module({
  controllers: [ThemeController, ThemeCustomerController],
  providers: [ThemeService],
  exports: [ThemeModule, ThemeService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule)
  ],
})
export class ThemeModule {}
