import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { BookingService } from '../booking/booking.service';
import { RequestRefundService } from './request-refund.service';
import { FilterRequestRefund } from './dto/filter-request-refund.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { UpdateRequestRefundDto, UpdateRequestRefundDtoKeys } from './dto/update-request-refund.dto';
import { BookingStatus, NotificationType, PaymentStatus, RequestRefundStatus } from 'src/helpers/constants/enum.constant';
import { CreateNotificationLogsDto } from '../notification-log/dto/create-notification-log.dto';
import { NotificationLogsService } from '../notification-log/notification-log.service';

@ApiTags('Request Refund (Administrator)')
@Controller('request-refund')
export class RequestRefundController {
  constructor(
    private readonly requestRefundService: RequestRefundService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly bookingService: BookingService,
    private readonly notificationLogsService: NotificationLogsService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterRequestRefund) {
    const where: Prisma.RequestRefundWhereInput = { AND: [] };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          {
            Booking: {
              User: {
                email: {
                  contains: options.textSearch,
                },
                name: {
                  contains: options.textSearch,
                },
                phone: {
                  contains: options.textSearch,
                },
              }
            },
            reason: {
              contains: options.textSearch,
            },
          },
        ],
      });
    }

    if (options.statuses && options.statuses.length > 0) {
      // @ts-ignore
      where.AND.push({
        status: { in: options.statuses },
      });
    }

    const whereInput: Prisma.RequestRefundFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        Booking: {
          select: {
            id: true,
            bookingCode: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            Tour: {
              select: {
                id: true,
                name: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
              },
            },
            Payment: {
              select: {
                id: true,
                amount: true,
                payDate: true,
                transactionStatus: true,
              },
              where: {
                transactionStatus: PaymentStatus.SUCCESS
              }
            }
          },
        },
      },
    }

    return await funcListPaging(
      this.requestRefundService,
      whereInput,
      options?.page,
      options?.perPage,
    )
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const requestRefund = await this.prismaService.requestRefund.findFirst({
      where: {
        id: id
      },
      include: {
        Booking: {
          select: {
            id: true,
            bookingCode: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            Tour: {
              select: {
                id: true,
                name: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
              },
            },
            Payment: {
              select: {
                id: true,
                amount: true,
                payDate: true,
                transactionStatus: true,
              },
              where: {
                transactionStatus: PaymentStatus.SUCCESS
              }
            }
          },
        },
      }
    });

    if (!requestRefund)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.request-refund.findOne.not_found')));

    return requestRefund;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-status/:id')
  async updateStatus(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number, @Body() body: UpdateRequestRefundDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateRequestRefundDto) => !UpdateRequestRefundDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.request-refund.updateStatus.wrong_parameter', { keyNotInDto })));

    const requestRefund = await this.requestRefundService.findOne({
      where: {
        id: id
      },
      include: {
        User: true,
        Booking: true,
      }
    });

    if (!requestRefund)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.request-refund.updateStatus.not_found')));

    const updateData: Prisma.RequestRefundUpdateInput = {
      ...body,
      updatedBy: user.data.id + ' - ' + user.data.name,
    };

    if (body.status === RequestRefundStatus.APPROVED)
      await this.bookingService.update(requestRefund.bookingId, { status: BookingStatus.CANCELLED });

    const updateRequest = await this.requestRefundService.update(
      requestRefund.id,
      updateData
    );

    if (updateRequest) {
      const notificationDataCustomer: CreateNotificationLogsDto = {
        title: `Cập nhật yêu cầu hoàn tiền: ${requestRefund?.Booking?.bookingCode}`,
        subTitle: body.status === RequestRefundStatus.APPROVED ? 'Đã chấp nhận' : body.status === RequestRefundStatus.REJECTED ? 'Đã từ chối' : 'Đang chờ xử lý',
        body: `Mã yêu cầu hoàn tiền: ${requestRefund.id}`,
        userReceiveIds: [requestRefund?.User?.id],
        type: NotificationType.REQUEST_REFUND,
      }

      await this.notificationLogsService.send(notificationDataCustomer, user);

      return updateRequest;
    } else {
      return false;
    }
  }
}
