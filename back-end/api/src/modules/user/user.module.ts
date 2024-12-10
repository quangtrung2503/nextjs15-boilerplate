import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CsvService } from 'src/core/services/csv.service';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, CsvService],
  exports: [UserModule, UserService],
  imports: [
    I18nCustomModule,
    PrismaModule,
  ],
})
export class UserModule { }
