import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { BookingStatus, FORMAT_DATE, SortOrder } from 'src/helpers/constants/enum.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { BookingService } from '../booking/booking.service';
import { FilterBookingMonthlyStats, FilterNewBookingStats } from './dto/filter-stats.dto';
import { StatsService } from './stats.service';
import { funcListPaging } from 'src/helpers/common/list-paging';

@ApiTags('Stats (Administrator)')
@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly prismaService: PrismaService,
    private readonly bookingService: BookingService,
    private readonly i18n: I18nCustomService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('total-bookings-revenue-by-month')
  async getStatsTotalBookingAndRevenue() {
    // Lấy thời điểm đầu và cuối của tháng hiện tại
    const startOfCurrentMonth = moment().startOf('month');
    const currentMoment = moment();

    // Lấy thời điểm đầu và cuối của tháng trước
    const startOfPreviousMonth = moment().subtract(1, 'months').startOf('month');
    const endOfPreviousMonth = moment().subtract(1, 'months').endOf('month');

    // Đếm số booking tháng này
    const currentMonthBookings = await this.bookingService.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth.toDate(),
          lte: currentMoment.toDate()
        },
        status: BookingStatus.COMPLETED
      }
    });

    // Đếm số booking tháng trước
    const previousMonthBookings = await this.bookingService.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth.toDate(),
          lte: endOfPreviousMonth.toDate()
        },
        status: BookingStatus.COMPLETED
      }
    });

    // Tính tổng doanh thu tháng này
    const currentMonthRevenue = await this.bookingService.aggregate({
      where: {
        createdAt: {
          gte: startOfCurrentMonth.toDate(),
          lte: currentMoment.toDate()
        },
        status: BookingStatus.COMPLETED
      },
      _sum: {
        totalPrice: true
      }
    });

    // Tính tổng doanh thu tháng trước 
    const previousMonthRevenue = await this.bookingService.aggregate({
      where: {
        createdAt: {
          gte: startOfPreviousMonth.toDate(),
          lte: endOfPreviousMonth.toDate()
        },
        status: BookingStatus.COMPLETED
      },
      _sum: {
        totalPrice: true
      }
    });

    // Lấy giá trị doanh thu, xử lý null
    const currentRevenue = currentMonthRevenue._sum.totalPrice || 0;
    const previousRevenue = previousMonthRevenue._sum.totalPrice || 0;

    // Tính tỉ lệ tăng trưởng
    const bookingGrowthRate = previousMonthBookings === 0
      ? currentMonthBookings > 0 ? 100 : 0
      : ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100;

    const revenueGrowthRate = previousRevenue === 0
      ? currentRevenue > 0 ? 100 : 0
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    return {
      period: {
        current: {
          start: startOfCurrentMonth.format(FORMAT_DATE.DATE),
          end: currentMoment.format(FORMAT_DATE.DATE)
        },
        previous: {
          start: startOfPreviousMonth.format(FORMAT_DATE.DATE),
          end: endOfPreviousMonth.format(FORMAT_DATE.DATE)
        }
      },
      bookings: {
        current: currentMonthBookings,
        previous: previousMonthBookings,
        growthRate: Number(bookingGrowthRate.toFixed(2))
      },
      revenue: {
        current: Number(currentRevenue.toFixed(2)),
        previous: Number(previousRevenue.toFixed(2)),
        growthRate: Number(revenueGrowthRate.toFixed(2))
      }
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get-monthly-stats')
  async getMonthlyStats(@Query() options?: FilterBookingMonthlyStats) {
    const targetYear = options?.year ? moment(options.year).year() : moment().year();

    // Tạo mảng 12 tháng của năm
    const months = Array.from({ length: 12 }, (_, index) => {
      const startOfMonth = moment().year(targetYear).month(index).startOf('month');
      const endOfMonth = moment().year(targetYear).month(index).endOf('month');

      return {
        startDate: startOfMonth.toDate(),
        endDate: endOfMonth.toDate(),
        month: index + 1,
      };
    });

    // Lấy dữ liệu booking theo từng tháng
    const monthlyStats = await Promise.all(
      months.map(async ({ startDate, endDate, month }) => {
        // Đếm số lượng booking
        const bookingCount = await this.bookingService.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: BookingStatus.COMPLETED
          }
        });

        // Tính tổng doanh thu
        const revenue = await this.bookingService.aggregate({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: BookingStatus.COMPLETED
          },
          _sum: {
            totalPrice: true
          }
        });

        return {
          month,
          bookingCount,
          revenue: Number(revenue._sum.totalPrice?.toFixed(2)) || 0
        };
      })
    );

    // Tính tổng cả năm
    const yearlyTotal = monthlyStats.reduce(
      (acc, curr) => ({
        bookingCount: acc.bookingCount + curr.bookingCount,
        revenue: acc.revenue + curr.revenue
      }),
      { bookingCount: 0, revenue: 0 }
    );

    return {
      year: targetYear,
      monthlyStats,
      yearlyTotal: {
        bookingCount: yearlyTotal.bookingCount,
        revenue: Number(yearlyTotal.revenue.toFixed(2))
      }
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('get-new-bookings')
  async getNewBookings(@Query() options: FilterNewBookingStats) {
    const where: Prisma.BookingWhereInput = { AND: [] };

    if (options.dateApplied) {
      const startOfMonth = moment(options.dateApplied).startOf('month').toDate();
      const endOfMonth = moment(options.dateApplied).endOf('month').toDate();

      // @ts-ignore
      where.AND.push({
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      });
    }
    
    const whereInput: Prisma.BookingFindManyArgs = {
      where: where,
      orderBy: {
        createdAt: SortOrder.DESC
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        },
      }
    }

    return await funcListPaging(
      this.bookingService,
      whereInput,
      options?.page,
      options?.perPage,
    )
  }
}
