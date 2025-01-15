import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RequestRefundService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.RequestRefundCreateArgs) {
    return this.prismaService.requestRefund.create(args)
  }

  findAll(args: Prisma.RequestRefundFindManyArgs) {
    return this.prismaService.requestRefund.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.RequestRefundFindFirstArgs) {
    return this.prismaService.requestRefund.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.RequestRefundUpdateInput) {
    return this.prismaService.requestRefund.update({ where: { id }, data: args })
  }

  count(args: Prisma.RequestRefundCountArgs) {
    return this.prismaService.requestRefund.count(args)
  }

  async updateMany(where: Prisma.RequestRefundWhereInput, args: Prisma.RequestRefundUncheckedUpdateInput) {
    return this.prismaService.requestRefund.updateMany({ where, data: args });
  }

  async remove(args: Prisma.RequestRefundDeleteArgs) {
    return this.prismaService.requestRefund.delete(args);
  }

  async createMany(args: Prisma.RequestRefundCreateManyArgs) {
    return this.prismaService.requestRefund.createMany(args);
  }

  async deleteMany(args: Prisma.RequestRefundDeleteManyArgs) {
    return this.prismaService.requestRefund.deleteMany(args);
  }
}
