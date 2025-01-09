import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsModule, StatsService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => BookingModule)
  ],
})
export class StatsModule {}
