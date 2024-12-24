import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingCustomerController } from './booking-customer.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { TourModule } from '../tour/tour.module';
import { BookingController } from './booking.controller';

@Module({
  controllers: [BookingController, BookingCustomerController],
  providers: [BookingService],
  exports: [BookingModule, BookingService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule)
  ]
})
export class BookingModule {}
