import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TourService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.TourCreateArgs) {
    return this.prismaService.tour.create(args)
  }

  findAll(args: Prisma.TourFindManyArgs) {
    return this.prismaService.tour.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.TourFindFirstArgs) {
    return this.prismaService.tour.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.TourUpdateInput) {
    return this.prismaService.tour.update({
      where: { id }, data: args, include: {
        City: true,
        Theme: true,
        Destination: true,
        TourImage: true,
        Review: true
      }
    })
  }

  count(args: Prisma.TourCountArgs) {
    return this.prismaService.tour.count(args)
  }

  async updateMany(where: Prisma.TourWhereInput, args: Prisma.TourUncheckedCreateInput) {
    return this.prismaService.tour.updateMany({ where, data: args });
  }

  async remove(args: Prisma.TourDeleteArgs) {
    return this.prismaService.tour.delete(args);
  }

  async createMany(args: Prisma.TourCreateManyArgs) {
    return this.prismaService.tour.createMany(args);
  }

  async deleteMany(args: Prisma.TourDeleteManyArgs) {
    return this.prismaService.tour.deleteMany(args);
  }
}
