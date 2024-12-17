import { forwardRef, Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { DestinationCustomerController } from './destination-customer.controller';
import { TourModule } from '../tour/tour.module';

@Module({
  controllers: [DestinationController, DestinationCustomerController],
  providers: [DestinationService],
  exports: [DestinationModule, DestinationService],
  imports: [
    I18nCustomModule,
    PrismaModule,
    forwardRef(() => TourModule)
  ],
})
export class DestinationModule {}
