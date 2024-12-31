import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { CreateBankAccountDto, CreateBankAccountDtoKeys } from './dto/create-bank-account.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { FilterBankAccountDto } from './dto/filter-bank-account.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { SortOrder } from 'src/helpers/constants/enum.constant';

@ApiTags('Bank Account (Administrator)')
@Controller('bank-account')
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly i18n: I18nCustomService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateBankAccountDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateBankAccountDto) => !CreateBankAccountDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.bank_account.create.wrong_parameter', { keyNotInDto })));

    await this.bankAccountService.updateMany(
      { isDisplay: true },
      { isDisplay: false }
    );

    return await this.bankAccountService.create({
      data: {
        ...body,
        isDisplay: body.isDisplay ?? true
      }
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterBankAccountDto) {
    let where: Prisma.BankAccountWhereInput = { AND: [] };
    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { accountHolderName: { contains: options.textSearch } }
        ]
      });
    }

    if (typeof options.isDisplay === 'boolean') {
      where = {
        ...where,
        isDisplay: options.isDisplay,
      }
    }

    const whereInput: Prisma.BankAccountFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
    };

    return await funcListPaging(
      this.bankAccountService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const bankAccount = await this.bankAccountService.findOne({
      where: { id }
    });
    if (!bankAccount) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.bank_account.findOne.not_found')));

    return bankAccount;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: number, @Body() body: UpdateBankAccountDto) {
    const existingBankAccount = await this.bankAccountService.findOne({ where: { id } });
    if (!existingBankAccount) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.bank_account.update.not_found')));

    const keyNotInDto = Object.keys(body).find((key: keyof UpdateBankAccountDto) => !CreateBankAccountDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.bank_account.update.wrong_parameter', { keyNotInDto })));

    if (body.isDisplay === false && existingBankAccount.isDisplay) {
      const latestBankAccount = await this.bankAccountService.findOne({
        where: {
          id: { not: id }
        },
        orderBy: {
          createdAt: SortOrder.DESC
        }
      });

      if (latestBankAccount) {
        await this.bankAccountService.update(latestBankAccount.id, {
          isDisplay: true
        });
      }
    }
    else if (body.isDisplay !== false) {
      await this.bankAccountService.updateMany(
        {
          id: { not: id },
          isDisplay: true
        },
        { isDisplay: false }
      );
    }

    return this.bankAccountService.update(id, {
      ...body,
      isDisplay: body.isDisplay ?? true
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIdPipe) id: number) {
    const bankAccount = await this.bankAccountService.findOne({ where: { id } });
    if (!bankAccount) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.bank_account.remove.not_found')));

    if (bankAccount.isDisplay) {
      const latestBankAccount = await this.bankAccountService.findOne({
        where: {
          id: { not: id }
        },
        orderBy: {
          createdAt: SortOrder.DESC
        }
      });

      if (latestBankAccount) {
        await this.bankAccountService.update(latestBankAccount.id, {
          isDisplay: true
        });
      }
    }

    return this.bankAccountService.remove({ where: { id } });
  }

}
