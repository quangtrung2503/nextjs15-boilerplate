import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  create(args: Prisma.BookingCreateArgs) {
    return this.prismaService.booking.create(args)
  }

  findAll(args: Prisma.BookingFindManyArgs) {
    return this.prismaService.booking.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.BookingFindFirstArgs) {
    return this.prismaService.booking.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.BookingUpdateInput) {
    return this.prismaService.booking.update({ where: { id }, data: args })
  }

  count(args: Prisma.BookingCountArgs) {
    return this.prismaService.booking.count(args)
  }

  async updateMany(where: Prisma.BookingWhereInput, args: Prisma.BookingUncheckedUpdateInput) {
    return this.prismaService.booking.updateMany({ where, data: args });
  }

  async remove(args: Prisma.BookingDeleteArgs) {
    return this.prismaService.booking.delete(args);
  }

  async createMany(args: Prisma.BookingCreateManyArgs) {
    return this.prismaService.booking.createMany(args);
  }

  async deleteMany(args: Prisma.BookingDeleteManyArgs) {
    return this.prismaService.booking.deleteMany(args);
  }
}
