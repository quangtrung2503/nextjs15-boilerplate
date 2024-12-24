import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  create(args: Prisma.ReviewCreateArgs) {
    return this.prismaService.review.create(args)
  }

  findAll(args: Prisma.ReviewFindManyArgs) {
    return this.prismaService.review.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.ReviewFindFirstArgs) {
    return this.prismaService.review.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.ReviewUpdateInput) {
    return this.prismaService.review.update({ where: { id }, data: args })
  }

  count(args: Prisma.ReviewCountArgs) {
    return this.prismaService.review.count(args)
  }

  async updateMany(where: Prisma.ReviewWhereInput, args: Prisma.ReviewUncheckedUpdateInput) {
    return this.prismaService.review.updateMany({ where, data: args });
  }

  async remove(args: Prisma.ReviewDeleteArgs) {
    return this.prismaService.review.delete(args);
  }

  async createMany(args: Prisma.ReviewCreateManyArgs) {
    return this.prismaService.review.createMany(args);
  }

  async deleteMany(args: Prisma.ReviewDeleteManyArgs) {
    return this.prismaService.review.deleteMany(args);
  }
}
