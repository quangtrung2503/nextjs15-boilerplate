"use client"

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { HistoryBookingTour } from "@/services/modules/tour/interfaces/tour";
import useGetBookingHistory from "@/services/modules/tour/hooks/useGetBookingHistory";
import moment from "moment";
import Loading from "@/components/common/Loading";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import { useNotifications } from "@/helpers/toast";
import TourCard from "./orderCard";
import { DateTimeFormat } from "@/helpers/common";
import { VND } from "@/constants/env";

interface IPropsListOrder {
  onViewDetail: (id: number) => void
}

const groupToursByDate = (tours: HistoryBookingTour[]) => {
  return tours.reduce((groups: Record<string, HistoryBookingTour[]>, tour) => {
    const date = moment(tour.createdAt).format(DateTimeFormat.FullYearFormatDash);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tour);
    return groups;
  }, {});
};



const ListOrder = ({ onViewDetail }: IPropsListOrder) => {
  //! Hook + const
  const t = useTranslations("profile.bookingHistory");
  const { data: tours, loading } = useGetBookingHistory();
  const { showError } = useNotifications();

  //! Call function
  const groupedTours = groupToursByDate(tours || []);

  //! Function
  const navigateToPaymentPage = async (tourId: number) => {
    try {
      const res = await tourCustomerServices.pendingBookingService(tourId);
      window.location.href = res.data.data.paymentUrl;
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  }
  const handleNavigateToDetail = (id: number) => {
    onViewDetail?.(id)
  };
  
  const handleCancelTour = (tourId: number) => {
    // console.log(`Cancel Tour: ${tourId}`);
  };

  return (
    <Box className="tw-flex-grow tw-rounded-sm tw-bg-gray-50 tw-px-10">
      {loading ?? <Loading/>}
      <Typography
        variant="h6"
        className="tw-pt-9 tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
      >
        {t("booking")}
      </Typography>
      <Box>
        {Object.entries(groupedTours).map(([date, tours]) => (
          <Box key={date} className="tw-mb-6">
            <Typography
              variant="subtitle1"
              className="tw-mb-2 tw-font-bold tw-text-gray-700"
            >
              {date}
            </Typography>

            {tours.map((tour) => {
              return (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onNavigateToDetail={handleNavigateToDetail}
                  onCancelTour={handleCancelTour}
                  onNavigateToPaymentPage={navigateToPaymentPage}
                  t={t}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ListOrder;