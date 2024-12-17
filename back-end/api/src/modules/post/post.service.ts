import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.PostCreateArgs) {
    return this.prismaService.post.create(args)
  }

  findAll(args: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany({ ...args, include: args?.include })
  }

  findOne(args: Prisma.PostFindFirstArgs) {
    return this.prismaService.post.findFirst({ ...args, include: args?.include })
  }

  update(id: number, args: Prisma.PostUpdateInput) {
    return this.prismaService.post.update({ where: { id }, data: args })
  }

  count(args: Prisma.PostCountArgs) {
    return this.prismaService.post.count(args)
  }

  async updateMany(where: Prisma.PostWhereInput, args: Prisma.PostUncheckedUpdateInput) {
    return this.prismaService.post.updateMany({ where, data: args });
  }

  async remove(args: Prisma.PostDeleteArgs) {
    return this.prismaService.post.delete(args);
  }

  async createMany(args: Prisma.PostCreateManyArgs) {
    return this.prismaService.post.createMany(args);
  }

  async deleteMany(args: Prisma.PostDeleteManyArgs) {
    return this.prismaService.post.deleteMany(args);
  }
}
