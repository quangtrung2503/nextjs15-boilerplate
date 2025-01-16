"use client";

import { Box, Typography, CardMedia, Button } from "@mui/material";
import moment from "moment";
import { BookingStatus, DateTimeFormat, PaymentMethod } from "@/helpers/common";
import CommonIcons from "@/components/CommonIcons";
import useGetBookingDetail from "@/services/modules/tour/hooks/useGetBookingDetail";
import apiUrls from "@/constants/apiUrls";
import { statusColors } from "@/utils/utils";
import { useTranslations } from "next-intl";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import { useNotifications } from "@/helpers/toast";
import Loading from "@/components/common/Loading";
import StatusActionButtons from "@/components/ActionButton/actionButton";

interface DetailOrderProps {
  id: number;
  onGoBack: () => void;
}

const DetailOrder = ({ id, onGoBack }: DetailOrderProps) => {
  //!Const,data,hook
  const t = useTranslations("profile.bookingHistory");
  const { data: bookingDetail, loading, error } = useGetBookingDetail(Number(id));
  const { showError } = useNotifications();

  //Function
  const handleCancelTour = (tourId: number) => {
    // console.log(`Hủy tour với ID: ${tourId}`);
  };
  const navigateToPaymentPage = async (tourId: number) => {
    try {
      const res = await tourCustomerServices.pendingBookingService(tourId);
      window.location.href = res.data.data.paymentUrl;
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  }
  
  const {
    bookingCode,
    status,
    Tour,
    startDate,
    endDate,
    numberOfAdults,
    numberOfChildren,
    totalPrice,
    paymentMethod,
  } = bookingDetail || {};

  const tourImage = Tour?.TourImage?.[0]?.image;
  const peoples = (numberOfAdults || 0) + (numberOfChildren || 0);
  const destinations = Tour?.TourDestination;

  return (
    <Box className="tw-flex-grow tw-rounded-sm tw-bg-gray-50 tw-px-10">
      {loading ?? <Loading />}
      <Typography
        onClick={onGoBack}
        className="tw-flex tw-items-center tw-pt-9 tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
      >
        <CommonIcons.ArrowBack className="tw-mr-2" /> {t("booking")}
      </Typography>
      <Typography
        variant="h6"
        className="tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
      >
        {t("booking_detail")}
      </Typography>
      <Box className="tw-flex tw-gap-6 tw-items-start">
        {/* Tour Image */}
        {tourImage && (
          <CardMedia
            component="img"
            className="tw-w-1/3 tw-h-64 tw-object-cover tw-rounded-md"
            image={`${apiUrls.IMG_URL}/${tourImage}`}
            alt="Tour Image"
          />
        )}
        {/* Booking Info */}
        <Box className="tw-flex-grow">
          <Box className="tw-flex tw-justify-between tw-items-center tw-mb-2">
            <Typography
              variant="h6"
              className="tw-font-bold tw-text-gray-800"
            >
              {Tour?.name || t("tour_name_unavailable")}
            </Typography>
            <Typography
              className={`tw-inline-block tw-py-1 tw-px-4 tw-rounded-full tw-text-xs tw-font-semibold ${statusColors[status || "PENDING"]}`}
            >
              {status || t("status_unknown")}
            </Typography>
          </Box>
          <Box className="tw-flex tw-flex-wrap">
            <Box className="tw-flex-1 tw-mb-2">
              <Box className="tw-flex tw-items-center tw-mb-2">
                <CommonIcons.Grid3x3 className="tw-text-gray-500" />
                <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                  {t("order_id")}: {bookingCode || t("unknown")}
                </Typography>
              </Box>
              <Box className="tw-flex tw-items-center tw-mb-2">
                <CommonIcons.CalendarMonthOutlined className="tw-text-gray-500" />
                <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                  {moment(startDate).format(DateTimeFormat.FullYearFormatDash)} - {" "}
                  {moment(endDate).format(DateTimeFormat.FullYearFormatDash)}
                </Typography>
              </Box>
              <Box className="tw-flex tw-items-center tw-mb-2">
                <CommonIcons.PeopleOutlined className="tw-text-gray-500" />
                <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                  {t("people")}: {peoples || t("unknown")}
                </Typography>
              </Box>
              <Box className="tw-flex tw-items-center tw-mb-2">
                <CommonIcons.Payments className="tw-text-gray-500" />
                <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                  {t("price")}:{" "}
                  {paymentMethod === PaymentMethod.VNPAY
                    ? `${(totalPrice || 0).toLocaleString("vi-VN")} VND`
                    : `$${(totalPrice || 0).toLocaleString()}`}
                </Typography>
              </Box>
            </Box>
            {/* Destinations */}
            <Box className="tw-flex-1 tw-border tw-border-indigo-300 tw-rounded-md tw-p-4 tw-bg-white tw-shadow-sm">
              <Typography
                variant="subtitle1"
                className="tw-font-bold tw-text-gray-700 tw-mb-2"
              >
                {t("destinations")}:
              </Typography>
              <ul className="tw-list-disc tw-list-inside tw-text-sm tw-text-gray-600">
                {destinations?.map((dest, index) => (
                  <li key={index} className="tw-flex tw-items-center">
                    <CommonIcons.LocationOn className="tw-text-gray-500 tw-mr-2" />
                    {dest.Destination.name}
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
          {/* Action Buttons */}
          {!(status === BookingStatus.CANCELLED || status === BookingStatus.COMPLETED) && (
            <StatusActionButtons
              status={status}
              id={id}
              onCancel={handleCancelTour}
              onNavigate={navigateToPaymentPage}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetailOrder;