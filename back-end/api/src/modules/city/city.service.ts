import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CityService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.CityCreateArgs) {
    return this.prismaService.city.create(args)
  }

  findAll(args: Prisma.CityFindManyArgs) {
    return this.prismaService.city.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.CityFindFirstArgs) {
    return this.prismaService.city.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.CityUpdateInput) {
    return this.prismaService.city.update({ where: { id }, data: args })
  }

  count(args: Prisma.CityCountArgs) {
    return this.prismaService.city.count(args)
  }

  async updateMany(where: Prisma.CityWhereInput, args: Prisma.CityUncheckedCreateInput) {
    return this.prismaService.city.updateMany({ where, data: args });
  }

  async remove(args: Prisma.CityDeleteArgs) {
    return this.prismaService.city.delete(args);
  }

  async createMany(args: Prisma.CityCreateManyArgs) {
    return this.prismaService.city.createMany(args);
  }

  async deleteMany(args: Prisma.CityDeleteManyArgs) {
    return this.prismaService.city.deleteMany(args);
  }
}
