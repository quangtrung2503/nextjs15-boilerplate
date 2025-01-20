import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { TokenMessage, TopicMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { PrismaService } from 'prisma/prisma.service';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { FirebaseService, TopicNoti } from 'src/core/services/firebase.service';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { SendNotiDto } from './dto/create-notification-log.dto';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
interface NotificationLogs extends Omit<Prisma.NotificationLogsUncheckedCreateInput, 'NotificationLogsWith'> {
  NotificationLogsWith?: Prisma.NotificationLogsWithUncheckedCreateInput[]
}
@Injectable()
export class NotificationLogsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) { }
  create(args: Prisma.NotificationLogsCreateArgs) {
    return this.prismaService.notificationLogs.create(args)
  }

  findAll(args: Prisma.NotificationLogsFindManyArgs) {
    return this.prismaService.notificationLogs.findMany(args)
  }

  findOne(args: Prisma.NotificationLogsFindFirstArgs): Promise<NotificationLogs> {
    return this.prismaService.notificationLogs.findFirst(args)
  }

  update(id: number, args: Prisma.NotificationLogsUpdateInput) {
    return this.prismaService.notificationLogs.update({ where: { id }, data: args })
  }

  count(args: Prisma.NotificationLogsCountArgs) {
    return this.prismaService.notificationLogs.count(args)
  }

  async updateMany(where: Prisma.NotificationLogsWhereInput, args: Prisma.NotificationLogsUncheckedCreateInput) {
    return this.prismaService.notificationLogs.updateMany({ where, data: args });
  }

  async remove(args: Prisma.NotificationLogsDeleteArgs) {
    return this.prismaService.notificationLogs.delete(args);
  }

  async createMany(args: Prisma.NotificationLogsCreateManyArgs) {
    return this.prismaService.notificationLogs.createMany(args);
  }

  async deleteMany(args: Prisma.NotificationLogsDeleteManyArgs) {
    return this.prismaService.notificationLogs.deleteMany(args);
  }

  // firebase serivce
  async send(body: SendNotiDto, user?: IUserJwt, i18n?: I18nCustomService) {
    const userId = user?.data?.id
    const topic = body?.topic;
    const uniqueUserIds = [...new Set<number>(body?.userReceiveIds)];
    if (!!topic && uniqueUserIds.length > 0)
      throw new BaseException(Errors.BAD_REQUEST(i18n.t('common-message.notification-log.send_service.notification_send_conflict')));
    // create noti param
    const dataNoti: Prisma.XOR<Prisma.NotificationLogsCreateInput, Prisma.NotificationLogsUncheckedCreateInput> = {
      title: body?.title,
      body: body?.body,
      data: body?.data,
      imageUrl: body?.imageUrl,
      subTitle: body?.subTitle,
      type: body?.type,
      userCreatedId: userId,
    };

    // send to topic
    if (topic) {
      let roleFilter: { role: { in: UserRole[] } } | null = null;

      if (topic === TopicNoti.TopicForAllAdminStaff) {
        roleFilter = { role: { in: [UserRole.ADMIN, UserRole.STAFF] } };
      } else if (topic === TopicNoti.TopicForAllCustomer) {
        roleFilter = { role: { in: [UserRole.CUSTOMER] } };
      }

      if (!roleFilter) return false;

      const listUser = await this.prismaService.user.findMany({
        where: {
          fcmToken: { not: null },
          ...roleFilter
        },
        select: {
          id: true,
          fcmToken: true
        }
      });

      const message: TopicMessage = {
        topic: body.topic,
        data: body?.data ? JSON.parse(body?.data) : undefined,
        notification: {
          title: body?.title,
          body: body?.body,
          imageUrl: body?.imageUrl,
        }
      };

      const listFcmRequest = listUser.map((user) => user.fcmToken)
      const sended = await this.firebaseService.firebaseSendTopic(
        message,
        listFcmRequest,
        topic
      );

      if (sended) {
        await this.prismaService.notificationLogs.create({
          data: {
            ...dataNoti,
            NotificationLogsWith: {
              createMany: {
                data: listUser.map((user) => {
                  return {
                    isRead: false,
                    userReceiveId: user.id
                  }
                })
              }
            }
          }
        });
        return true;
      }
    }

    // send to each user
    if (uniqueUserIds.length > 0) {
      const listUser = await this.prismaService.user.findMany({
        where: { id: { in: uniqueUserIds } },
        select: {
          id: true,
          fcmToken: true
        }
      })
      // send noti
      const message: TokenMessage = {
        token: '',
        data: body?.data ? JSON.parse(body?.data) : undefined,
        notification: {
          title: body?.title,
          body: body?.body,
          imageUrl: body?.imageUrl,
        }
      }
      const listFcmRequest = listUser.map((user) => user.fcmToken)
      const sended = await this.firebaseService.firebaseSendEach(message, listFcmRequest)
      // create noti with
      if (sended) {
        await this.prismaService.notificationLogs.create({
          data: {
            ...dataNoti,
            NotificationLogsWith: {
              createMany: {
                data: listUser.map((user) => {
                  return {
                    isRead: false,
                    userReceiveId: user.id
                  }
                })
              }
            }
          }
        });
        return true;
      }
    }

    return false
  }
}
