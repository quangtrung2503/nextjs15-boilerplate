import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { BankAccountCustomerController } from './bank-account-customer.controller';

@Module({
  controllers: [BankAccountController, BankAccountCustomerController],
  providers: [BankAccountService],
  exports: [BankAccountModule, BankAccountService],
  imports: [
    PrismaModule,
    I18nCustomModule
  ]
})
export class BankAccountModule {}
