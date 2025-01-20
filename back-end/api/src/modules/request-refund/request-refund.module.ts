import { forwardRef, Module } from '@nestjs/common';
import { RequestRefundService } from './request-refund.service';
import { RequestRefundCustomerController } from './request-refund-customer.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { BookingModule } from '../booking/booking.module';
import { RequestRefundController } from './request-refund.controller';
import { NotificationLogsModule } from '../notification-log/notification-log.module';

@Module({
  controllers: [RequestRefundCustomerController, RequestRefundController],
  providers: [RequestRefundService],
  exports: [RequestRefundModule, RequestRefundService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => BookingModule),
    forwardRef(() => NotificationLogsModule)
  ],
 
})
export class RequestRefundModule {}
