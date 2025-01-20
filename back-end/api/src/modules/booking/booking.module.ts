import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingCustomerController } from './booking-customer.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { TourModule } from '../tour/tour.module';
import { BookingController } from './booking.controller';
import { PaymentService } from './payment.service';
import { NotificationLogsModule } from '../notification-log/notification-log.module';

@Module({
  controllers: [BookingController, BookingCustomerController],
  providers: [BookingService, PaymentService],
  exports: [BookingModule, BookingService, PaymentService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule),
    forwardRef(() => NotificationLogsModule)
  ]
})
export class BookingModule {}
