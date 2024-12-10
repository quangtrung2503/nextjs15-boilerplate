import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CronTasksService {
  constructor(
    private primsa: PrismaService,
  ) { }
  private readonly logger = new Logger(CronTasksService.name);

  // cron updates user's numbersAbsentOfYear every 1/1 of every year
  @Cron('0 0 0 1 1 *')
  async cronTask() {
    return true;
  }
}