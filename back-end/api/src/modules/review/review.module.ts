import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewCustomerController } from './review-customer.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { TourModule } from '../tour/tour.module';
import { ReviewHelpfulService } from './review-helpful.service';
import { ReviewController } from './review.controller';

@Module({
  controllers: [ReviewCustomerController, ReviewController],
  providers: [ReviewService, ReviewHelpfulService],
  exports: [ReviewModule, ReviewService, ReviewHelpfulService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => TourModule)
  ]
})
export class ReviewModule {}
