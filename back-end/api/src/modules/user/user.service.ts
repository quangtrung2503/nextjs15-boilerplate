import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

export interface IUser extends User {
}

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(args: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(args);
  }

  async count(args: Prisma.UserCountArgs) {
    return this.prismaService.user.count(args);
  }

  async findAll(args: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany({ ...args });
  }

  async findOne(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst({ ...args });
  }

  async update(id: number, args: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({ where: { id }, data: args });
  }

  async remove(args: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(args);
  }

  async createMany(args: Prisma.UserCreateManyArgs) {
    return this.prismaService.user.createMany(args);
  }

  async updateMany(args: Prisma.UserUpdateManyArgs) {
    return this.prismaService.user.updateMany(args);
  }
}
