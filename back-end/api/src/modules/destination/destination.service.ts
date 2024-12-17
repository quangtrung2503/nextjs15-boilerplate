import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DestinationService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.DestinationCreateArgs) {
    return this.prismaService.destination.create(args)
  }

  findAll(args: Prisma.DestinationFindManyArgs) {
    return this.prismaService.destination.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.DestinationFindFirstArgs) {
    return this.prismaService.destination.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.DestinationUpdateInput) {
    return this.prismaService.destination.update({ where: { id }, data: args })
  }

  count(args: Prisma.DestinationCountArgs) {
    return this.prismaService.destination.count(args)
  }

  async updateMany(where: Prisma.DestinationWhereInput, args: Prisma.DestinationUncheckedUpdateInput) {
    return this.prismaService.destination.updateMany({ where, data: args });
  }

  async remove(args: Prisma.DestinationDeleteArgs) {
    return this.prismaService.destination.delete(args);
  }

  async createMany(args: Prisma.DestinationCreateManyArgs) {
    return this.prismaService.destination.createMany(args);
  }

  async deleteMany(args: Prisma.DestinationDeleteManyArgs) {
    return this.prismaService.destination.deleteMany(args);
  }
}
