import {
  Body,
  Controller, Delete, Get, Param, Patch,
  Post,
  Query, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Prisma,
  UserRole
} from '@prisma/client';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { BackendConfigService } from 'src/core/services/backend-config.service';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { UserService } from '../user/user.service';
import { NotificationLogsFilterDto } from './dto/notification-log-filter.dto';
import { NotificationLogsService } from './notification-log.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNotificationLogsDto, CreateNotificationLogsDtoKeys } from './dto/create-notification-log.dto';
import { NotificationLogsFilterManagerDto } from './dto/notification-log-manager-filter.dto';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';

@ApiTags('Notification Logs')
@Controller('notification-logs')
export class NotificationLogsController {
  constructor(
    private readonly i18n: I18nCustomService,
    private readonly configService: BackendConfigService,
    private readonly notificationLogsService: NotificationLogsService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserDecorator() user: IUserJwt, @Body() body: CreateNotificationLogsDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateNotificationLogsDto) => !CreateNotificationLogsDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.notification-log.create.wrong_parameter', { keyNotInDto })));

    const result = await this.notificationLogsService.send(body, user, this.i18n);
    if (!result) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.notification-log.create.send_fail')));
    }
    return result;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@UserDecorator() user: IUserJwt, @Query() options: NotificationLogsFilterDto) {
    let where: Prisma.NotificationLogsWhereInput = { AND: [] };
    let whereNotiWith: Prisma.NotificationLogsWithWhereInput = { AND: [], userReceiveId: user.data.id };

    if (typeof options?.isRead == 'boolean') {
      whereNotiWith = {
        ...whereNotiWith,
        isRead: options?.isRead,
      }
    }

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: { title: { contains: options.textSearch } }
      });
    }

    if (options?.type) {
      where = {
        ...where,
        type: options?.type,
      };
    }

    const whereInput: Prisma.NotificationLogsFindManyArgs = {
      where: {
        ...where,
        NotificationLogsWith: {
          some: whereNotiWith
        },
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        NotificationLogsWith: {
          include: {
            UserReceive: true,
          }
        },
      }
    };

    const listPagingRaw = await funcListPaging(
      this.notificationLogsService,
      whereInput,
      options?.page,
      options?.perPage,
    );

    const items = listPagingRaw.items.map((el) => {
      const isRead = el?.NotificationLogsWith.find((el) => el?.userReceiveId == user.data.id)?.isRead
      delete el.NotificationLogsWith
      if (isRead == null || isRead == undefined) return el
      return {
        ...el,
        isRead,
      }
    })
    return { ...listPagingRaw, items };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('list-manger')
  async findAllManger(
    @UserDecorator() user: IUserJwt,
    @Query() options: NotificationLogsFilterManagerDto
  ) {
    let where: Prisma.NotificationLogsWhereInput = { AND: [] };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { title: { contains: options.textSearch } },
        ],
      });
    }

    if (options?.type) {
      where = {
        ...where,
        type: options?.type,
      };
    }

    const whereInput: Prisma.NotificationLogsFindManyArgs = {
      where: {
        ...where,
      },
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        NotificationLogsWith: {
          include: {
            UserReceive: true,
          }
        }
      }
    };

    return await funcListPaging(
      this.notificationLogsService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    if (user.role == UserRole.STAFF) { // staff can only see noti they receive
      const hasSendToThisUser = await this.notificationLogsService.findOne({ where: { id, NotificationLogsWith: { some: { userReceiveId: user.data.id } } } });
      if (!hasSendToThisUser) throw new BaseException(Errors.FORBIDDEN(this.i18n.t('common-message.notification-log.findOne.forbidden')));
    }

    const raw = await this.notificationLogsService.findOne({ where: { id } });
    return { ...raw };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @UserDecorator() user: IUserJwt) {
    return this.notificationLogsService.remove({ where: { id: id } });
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/readed')
  async readed(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    const notiWith = await this.prismaService.notificationLogsWith.findFirst({
      where: {
        userReceiveId: user.data.id,
        NotificationLogs: { id: id },
      }
    });
    if (!notiWith) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.notification-log.readed.not_found')));

    await this.prismaService.notificationLogsWith.update({ where: { id: notiWith.id }, data: { isRead: true } })
    return true;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('read-all')
  async readAll(@UserDecorator() user: IUserJwt) {
    await this.prismaService.notificationLogsWith.updateMany({
      where: { userReceiveId: user.data.id },
      data: { isRead: true },
    })
    return true;
  }
}
