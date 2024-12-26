import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { TourModule } from '../tour/tour.module';
import { ReviewCustomerController } from './review-customer.controller';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewCustomerController, ReviewController],
  providers: [ReviewService],
  exports: [ReviewModule, ReviewService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule)
  ]
})
export class ReviewModule {}
