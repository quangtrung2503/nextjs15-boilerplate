import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BankAccountService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.BankAccountCreateArgs) {
    return this.prismaService.bankAccount.create(args)
  }

  findAll(args: Prisma.BankAccountFindManyArgs) {
    return this.prismaService.bankAccount.findMany({ ...args })
  }

  findOne(args: Prisma.BankAccountFindFirstArgs) {
    return this.prismaService.bankAccount.findFirst({ ...args })
  }

  update(id: number, args: Prisma.BankAccountUpdateInput) {
    return this.prismaService.bankAccount.update({ where: { id }, data: args })
  }

  count(args: Prisma.BankAccountCountArgs) {
    return this.prismaService.bankAccount.count(args)
  }

  async updateMany(where: Prisma.BankAccountWhereInput, args: Prisma.BankAccountUncheckedUpdateInput) {
    return this.prismaService.bankAccount.updateMany({ where, data: args });
  }

  async remove(args: Prisma.BankAccountDeleteArgs) {
    return this.prismaService.bankAccount.delete(args);
  }

  async createMany(args: Prisma.BankAccountCreateManyArgs) {
    return this.prismaService.bankAccount.createMany(args);
  }

  async deleteMany(args: Prisma.BankAccountDeleteManyArgs) {
    return this.prismaService.bankAccount.deleteMany(args);
  }
}
