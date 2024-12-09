import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  controllers: [CityController],
  providers: [CityService],
  exports: [CityModule, CityService],
  imports: [
    PrismaModule,
    I18nCustomModule
  ],
})
export class CityModule {}
