import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TourImageService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.TourImageCreateArgs) {
    return this.prismaService.tourImage.create(args)
  }

  findAll(args: Prisma.TourImageFindManyArgs) {
    return this.prismaService.tourImage.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.TourImageFindFirstArgs) {
    return this.prismaService.tourImage.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.TourImageUpdateInput) {
    return this.prismaService.tourImage.update({where: { id }, data: args})
  }

  count(args: Prisma.TourImageCountArgs) {
    return this.prismaService.tourImage.count(args)
  }

  async updateMany(where: Prisma.TourImageWhereInput, args: Prisma.TourImageUncheckedUpdateInput) {
    return this.prismaService.tourImage.updateMany({ where, data: args });
  }

  async remove(args: Prisma.TourImageDeleteArgs) {
    return this.prismaService.tourImage.delete(args);
  }

  async createMany(args: Prisma.TourImageCreateManyArgs) {
    return this.prismaService.tourImage.createMany(args);
  }

  async deleteMany(args: Prisma.TourImageDeleteManyArgs) {
    return this.prismaService.tourImage.deleteMany(args);
  }
}
