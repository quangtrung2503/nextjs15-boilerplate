import { forwardRef, Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { CityModule } from '../city/city.module';
import { ThemeModule } from '../theme/theme.module';
import { DestinationModule } from '../destination/destination.module';
import { TourImageService } from './tour-image.service';
import { TourCustomerController } from './tour-customer.controller';

@Module({
  controllers: [TourController, TourCustomerController],
  providers: [TourService, TourImageService],
  exports: [TourModule, TourService, TourImageService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => CityModule),
    forwardRef(() => ThemeModule),
    forwardRef(() => DestinationModule)
  ],
})
export class TourModule {}
