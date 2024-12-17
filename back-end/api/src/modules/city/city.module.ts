import { forwardRef, Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { CityCustomerController } from './city-customer.controller';
import { TourModule } from '../tour/tour.module';

@Module({
  controllers: [CityController, CityCustomerController],
  providers: [CityService],
  exports: [CityModule, CityService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule)
  ],
})
export class CityModule {}
