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
import { BookingStatus, PaymentStatus, RequestRefundStatus } from 'src/helpers/constants/enum.constant';

@ApiTags('Request Refund (Administrator)')
@Controller('request-refund')
export class RequestRefundController {
  constructor(
    private readonly requestRefundService: RequestRefundService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly bookingService: BookingService,
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
              },
              take: 1
            }
          },
        },
      },
    }

    const raw = await funcListPaging(
      this.requestRefundService,
      whereInput,
      options?.page,
      options?.perPage,
    )

    const modifiedResults = {
      ...raw,
      items: raw?.items.map(requestRefund => {
        const Payment = requestRefund.Booking.Payment[0];
        requestRefund.Booking.Payment = Payment;

        return requestRefund;
      })

    };

    return modifiedResults;
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
              },
              take: 1
            }
          },
        },
      }
    });

    if (!requestRefund)
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.request-refund.findOne.not_found')));

    const Payment = requestRefund.Booking.Payment[0];
    delete requestRefund.Booking.Payment;

    return {
      ...requestRefund,
      Booking: {
        ...requestRefund.Booking,
        Payment: Payment
      }
    };
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

    return await this.requestRefundService.update(
      requestRefund.id,
      updateData
    );
  }
}
