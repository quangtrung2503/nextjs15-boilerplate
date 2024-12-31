import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.TagCreateArgs) {
    return this.prismaService.tag.create(args)
  }

  findAll(args: Prisma.TagFindManyArgs) {
    return this.prismaService.tag.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.TagFindFirstArgs) {
    return this.prismaService.tag.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.TagUpdateInput) {
    return this.prismaService.tag.update({ where: { id }, data: args })
  }

  count(args: Prisma.TagCountArgs) {
    return this.prismaService.tag.count(args)
  }

  async updateMany(where: Prisma.TagWhereInput, args: Prisma.TagUncheckedUpdateInput) {
    return this.prismaService.tag.updateMany({ where, data: args });
  }

  async remove(args: Prisma.TagDeleteArgs) {
    return this.prismaService.tag.delete(args);
  }

  async createMany(args: Prisma.TagCreateManyArgs) {
    return this.prismaService.tag.createMany(args);
  }

  async deleteMany(args: Prisma.TagDeleteManyArgs) {
    return this.prismaService.tag.deleteMany(args);
  }
}
