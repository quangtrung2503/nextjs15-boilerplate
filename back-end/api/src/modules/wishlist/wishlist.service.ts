import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.WishlistCreateArgs) {
    return this.prismaService.wishlist.create(args)
  }

  findAll(args: Prisma.WishlistFindManyArgs) {
    return this.prismaService.wishlist.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.WishlistFindFirstArgs) {
    return this.prismaService.wishlist.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.WishlistUpdateInput) {
    return this.prismaService.wishlist.update({ where: { id }, data: args })
  }

  count(args: Prisma.WishlistCountArgs) {
    return this.prismaService.wishlist.count(args)
  }

  async updateMany(where: Prisma.WishlistWhereInput, args: Prisma.WishlistUncheckedUpdateInput) {
    return this.prismaService.wishlist.updateMany({ where, data: args });
  }

  async remove(args: Prisma.WishlistDeleteArgs) {
    return this.prismaService.wishlist.delete(args);
  }

  async createMany(args: Prisma.WishlistCreateManyArgs) {
    return this.prismaService.wishlist.createMany(args);
  }

  async deleteMany(args: Prisma.WishlistDeleteManyArgs) {
    return this.prismaService.wishlist.deleteMany(args);
  }
}
