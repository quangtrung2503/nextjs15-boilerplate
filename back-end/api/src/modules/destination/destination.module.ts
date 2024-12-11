import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationModule, DestinationService],
  imports: [
    I18nCustomModule,
    PrismaModule,
  ],
})
export class DestinationModule {}
