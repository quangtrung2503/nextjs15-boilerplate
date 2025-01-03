export interface StatsTotalBookingRevenue {
  period: {
    current: {
      start: string,
      end: string
    },
    previous: {
      start: string,
      end: string
    }
  }
  bookings: {
    current: number,
    previous: number,
    growthRate: number,
  },
  revenue: {
    current: number,
    previous: number,
    growthRate: number,
  }
}
export interface StatMonthly {
  year: number;
  monthlyStats: {
    month: number,
    bookingCount: number,
    revenue: number
  }[],
  yearlyTotal: {
    bookingCount: number,
    revenue: number
  }
}