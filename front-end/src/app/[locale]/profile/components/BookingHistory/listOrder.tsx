"use client"

import { LocationOn } from "@mui/icons-material";
import CommonIcons from "@/components/CommonIcons";
import { Box, CardMedia, Typography, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { CommonButton } from "@/components/common/Button";
import { HistoryBookingTour } from "@/services/modules/tour/interfaces/tour";
import { statusColors } from "@/utils/utils";
import useGetBookingHistory from "@/services/modules/tour/hooks/useGetBookingHistory";
import apiUrls from "@/constants/apiUrls";
import { BookingStatus, PaymentMethod } from "@/helpers/common";
import moment from "moment";
import Loading from "@/components/common/Loading";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import { useNotifications } from "@/helpers/toast";
import { useRouter } from "next/navigation";

const groupToursByDate = (tours: HistoryBookingTour[]) => {
  return tours.reduce((groups: Record<string, HistoryBookingTour[]>, tour) => {
    const date = moment(tour.createdAt).format('YYYY/MM/DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tour);
    return groups;
  }, {});
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const handleCancelTour = (tourId: number) => {
  // console.log(`Hủy tour với ID: ${tourId}`);
};

interface IPropsListOrder {
  onViewDetail: ( id: number) => void
}

const ListOrder = ({onViewDetail}: IPropsListOrder) => {
  //! Hook + const
  const t = useTranslations("profile.bookingHistory");
  const router = useRouter();
  const { data: tours, loading, error, refetchWithLoading } = useGetBookingHistory();
  const VND = Number(process.env.NEXT_PUBLIC_VND);
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

  if (error) {
    return (
      <Box className="tw-flex tw-justify-center tw-items-center tw-h-full">
        <Typography variant="h6" color="error">
          {t('error_fetching_data')}
        </Typography>
        <CommonButton variant="contained" onClick={refetchWithLoading} className="tw-ml-4">
          {t('retry')}
        </CommonButton>
      </Box>
    );
  }
  //! Render UI
  return (
    <Box className="tw-flex-grow tw-rounded-sm tw-bg-gray-50 tw-px-10">
      <Typography
          variant="h6"
          className="tw-pt-9 tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
        {t("booking")}
        </Typography>
      <Box className="tw-max-h-[500px] tw-overflow-y-auto">
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
                <Box
                  key={tour.id}
                  className="tw-flex tw-mb-2 tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-6 tw-border tw-border-gray-200"
                >
                  <Box className="tw-flex-grow">
                    <Box className="tw-mb-4 tw-flex tw-justify-between tw-items-center">
                      <Typography
                        variant="h6"
                        className="tw-font-bold tw-text-gray-700"
                      >
                        {t('order_id')} {tour.bookingCode}
                      </Typography>
                      <Typography
                        className={`tw-inline-block tw-py-1 tw-px-4 tw-rounded-full tw-text-xs tw-font-semibold ${statusColors[tour.status]}`}
                      >
                        {tour.status}
                      </Typography>
                    </Box>

                    <Box className="tw-flex tw-items-start tw-gap-4">
                      <CardMedia
                        className="tw-w-24 tw-h-24 tw-rounded-lg tw-border tw-border-gray-200"
                        image={`${apiUrls.IMG_URL}/${tour.Tour.TourImage?.at(0)?.image}`} />
                      <Box className="tw-flex-grow">
                        <Tooltip title={tour.Tour.name} placement="top">
                          <Typography
                            className="tw-font-semibold tw-text-lg tw-text-gray-800 tw-line-clamp-1 tw-break-words"
                            onClick={() => handleNavigateToDetail(tour.id)} // Chuyển hướng khi nhấp vào tên tour
                            >
                            {truncateText(tour.Tour.name, 70)}
                          </Typography>
                        </Tooltip>

                        <Box className="tw-flex tw-items-center tw-mt-2">
                          <CommonIcons.CalendarMonthOutlined className="tw-text-gray-500" />
                          <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                            {moment(tour.startDate).format('YYYY/MM/DD')} - {moment(tour.endDate).format('YYYY/MM/DD')}
                          </Typography>
                        </Box>

                        <Box className="tw-flex tw-items-center tw-mt-2">
                          {/* Location and City */}
                          <LocationOn className="tw-text-gray-500" />
                          <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                            {tour.Tour.City?.name}
                          </Typography>

                          {/* Separator */}
                          <Typography className="tw-mx-2 tw-text-sm tw-text-gray-500">|</Typography>

                          {/* People Count */}
                          <CommonIcons.PeopleOutlined className="tw-text-gray-500" />
                          <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                            {`${tour.numberOfAdults + tour.numberOfChildren} `}
                            {t(tour.numberOfAdults + tour.numberOfChildren > 1 ? "peoples" : "people")}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Payment and Cancellation Section */}
                      <Box className="tw-text-right">
                        <Box className="tw-flex tw-items-center tw-gap-2">
                          {/* Payment Details */}
                          <Typography className="tw-text-sm tw-font-semibold tw-text-gray-400 tw-border tw-border-gray-600 tw-bg-gray-200 tw-rounded-lg tw-py-1 tw-px-2">
                            {`${tour.numberOfAdults + tour.numberOfChildren} x `}
                            {tour.paymentMethod === PaymentMethod.VNPAY
                              ? `${(tour.Tour.price * VND).toLocaleString("vi-VN")} VND`
                              : `$ ${tour.Tour.price.toLocaleString()}`}
                          </Typography>

                          {/* Total Price */}
                          <Typography className="tw-text-lg tw-font-bold tw-text-gray-800">
                            {tour.paymentMethod === PaymentMethod.VNPAY ? "" : "$"} {tour.totalPrice.toLocaleString("vi-VN")}
                          </Typography>
                        </Box>

                        {/* Cancel Button */}
                        {!(tour.status === BookingStatus.CANCELLED || tour.status === BookingStatus.COMPLETED) && (
                          <>
                            {/* Nút hủy tour */}
                            {tour.status === BookingStatus.CONFIRMED && (
                              <CommonButton
                                variant="contained"
                                color="primary"
                                size="small"
                                className="tw-mt-8 tw-scroll-py-px tw-text-xs tw-rounded-ls tw-border-red-600 tw-text-red-700 tw-bg-red-100 hover:tw-bg-red-100 hover:tw-border-red-700"
                                onClick={() => handleCancelTour(tour.id)}
                              >
                                {t("cancelTour")}
                              </CommonButton>
                            )}

                            {/* Nút thanh toán tiền cho tour */}
                            {tour.status === BookingStatus.PENDING && (
                              <CommonButton
                                variant="contained"
                                color="primary"
                                size="small"
                                className="tw-mt-8 tw-scroll-py-px tw-text-xs tw-rounded-ls tw-border-green-600 tw-text-green-700 tw-bg-green-100 hover:tw-bg-green-100 hover:tw-border-green-700"
                                onClick={() => navigateToPaymentPage(tour.id)}
                              >
                                {t("pay_now")}
                              </CommonButton>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ListOrder;