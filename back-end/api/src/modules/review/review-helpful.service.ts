import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReviewHelpfulService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  create(args: Prisma.ReviewHelpfulCreateArgs) {
    return this.prismaService.reviewHelpful.create(args)
  }

  findAll(args: Prisma.ReviewHelpfulFindManyArgs) {
    return this.prismaService.reviewHelpful.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.ReviewHelpfulFindFirstArgs) {
    return this.prismaService.reviewHelpful.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.ReviewHelpfulUpdateInput) {
    return this.prismaService.reviewHelpful.update({ where: { id }, data: args })
  }

  count(args: Prisma.ReviewHelpfulCountArgs) {
    return this.prismaService.reviewHelpful.count(args)
  }

  async updateMany(where: Prisma.ReviewHelpfulWhereInput, args: Prisma.ReviewHelpfulUncheckedUpdateInput) {
    return this.prismaService.reviewHelpful.updateMany({ where, data: args });
  }

  async remove(args: Prisma.ReviewHelpfulDeleteArgs) {
    return this.prismaService.reviewHelpful.delete(args);
  }

  async createMany(args: Prisma.ReviewHelpfulCreateManyArgs) {
    return this.prismaService.reviewHelpful.createMany(args);
  }

  async deleteMany(args: Prisma.ReviewHelpfulDeleteManyArgs) {
    return this.prismaService.reviewHelpful.deleteMany(args);
  }
}
