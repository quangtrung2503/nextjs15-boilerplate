import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  create(args: Prisma.VideoCreateArgs) {
    return this.prismaService.video.create(args)
  }

  findAll(args: Prisma.VideoFindManyArgs) {
    return this.prismaService.video.findMany({ ...args })
  }

  findOne(args: Prisma.VideoFindFirstArgs) {
    return this.prismaService.video.findFirst({ ...args })
  }

  update(id: number, args: Prisma.VideoUpdateInput) {
    return this.prismaService.video.update({ where: { id }, data: args })
  }

  count(args: Prisma.VideoCountArgs) {
    return this.prismaService.video.count(args)
  }

  async updateMany(where: Prisma.VideoWhereInput, args: Prisma.VideoUncheckedUpdateInput) {
    return this.prismaService.video.updateMany({ where, data: args });
  }

  async remove(args: Prisma.VideoDeleteArgs) {
    return this.prismaService.video.delete(args);
  }

  async createMany(args: Prisma.VideoCreateManyArgs) {
    return this.prismaService.video.createMany(args);
  }

  async deleteMany(args: Prisma.VideoDeleteManyArgs) {
    return this.prismaService.video.deleteMany(args);
  }
}
