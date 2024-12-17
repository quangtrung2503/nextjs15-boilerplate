import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ThemeService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.ThemeCreateArgs) {
    return this.prismaService.theme.create(args)
  }

  findAll(args: Prisma.ThemeFindManyArgs) {
    return this.prismaService.theme.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.ThemeFindFirstArgs) {
    return this.prismaService.theme.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.ThemeUpdateInput) {
    return this.prismaService.theme.update({ where: { id }, data: args })
  }

  count(args: Prisma.ThemeCountArgs) {
    return this.prismaService.theme.count(args)
  }

  async updateMany(where: Prisma.ThemeWhereInput, args: Prisma.ThemeUncheckedUpdateInput) {
    return this.prismaService.theme.updateMany({ where, data: args });
  }

  async remove(args: Prisma.ThemeDeleteArgs) {
    return this.prismaService.theme.delete(args);
  }

  async createMany(args: Prisma.ThemeCreateManyArgs) {
    return this.prismaService.theme.createMany(args);
  }

  async deleteMany(args: Prisma.ThemeDeleteManyArgs) {
    return this.prismaService.theme.deleteMany(args);
  }
}
