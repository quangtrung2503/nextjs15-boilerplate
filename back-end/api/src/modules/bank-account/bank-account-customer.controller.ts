import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { BankAccountService } from './bank-account.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';

@ApiTags('Bank Account (Customer)')
@Controller('bank-account-customer')
export class BankAccountCustomerController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bankAccountService: BankAccountService,
    private readonly i18n: I18nCustomService,
  ) { }

  @Get('display')
  async getBankAccountDisplay() {
    const bankAccount = await this.bankAccountService.findOne({
      where: {
        isDisplay: true
      }
    });

    if (!bankAccount) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.bank_account.findOne.not_found')));
    }

    return bankAccount;
  }

}