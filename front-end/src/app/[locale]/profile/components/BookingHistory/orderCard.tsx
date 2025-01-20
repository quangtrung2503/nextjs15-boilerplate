import { LocationOn } from "@mui/icons-material";
import CommonIcons from "@/components/CommonIcons";
import { Box, CardMedia, Typography, Tooltip } from "@mui/material";
import { BookingStatus, DateTimeFormat, PaymentMethod } from "@/helpers/common";
import moment from "moment";
import { HistoryBookingTour } from "@/services/modules/tour/interfaces/tour";
import { statusColors } from "@/utils/utils";
import apiUrls from "@/constants/apiUrls";
import StatusActionButtons from "@/components/ActionButton/actionButton";
import { VND } from "@/constants/env";

interface TourCardProps {
  tour: HistoryBookingTour; // Replace `any` with the actual type for tour
  onNavigateToDetail: (id: number) => void;
  onCancelTour: (tourId: number) => void;
  onNavigateToPaymentPage: (tourId: number) => void;
  t: (key: any) => any; // Translation function
}

const TourCard = ({
  tour,
  onNavigateToDetail,
  onCancelTour,
  onNavigateToPaymentPage,
  t
}: TourCardProps) => {
  return (
    <Box className="tw-flex tw-mb-2 tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-6 tw-border tw-border-gray-200"
      onClick={() => onNavigateToDetail(tour.id)}
    >
      <Box className="tw-flex-grow">
        <Box className="tw-mb-4 tw-flex tw-justify-between tw-items-center">
          <Typography variant="h6" className="tw-font-bold tw-text-gray-700">
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
            image={`${apiUrls.IMG_URL}/${tour.Tour.TourImage?.at(0)?.image}`}
          />
          <Box className="tw-flex-grow">
            <Tooltip title={tour.Tour.name} placement="top">
              <Typography
                className="tw-font-semibold tw-text-lg tw-text-gray-800 tw-line-clamp-1 tw-text-ellipsis"
              >
                {tour.Tour.name}
              </Typography>
            </Tooltip>

            <Box className="tw-flex tw-items-center tw-mt-2">
              <CommonIcons.CalendarMonthOutlined className="tw-text-gray-500" />
              <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                {moment(tour.startDate).format(DateTimeFormat.FullYearFormatDash)} - {moment(tour.endDate).format(DateTimeFormat.FullYearFormatDash)}
              </Typography>
            </Box>

            <Box className="tw-flex tw-items-center tw-mt-2">
              <LocationOn className="tw-text-gray-500" />
              <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                {tour.Tour.City?.name}
              </Typography>
              <Typography className="tw-mx-2 tw-text-sm tw-text-gray-500">|</Typography>
              <CommonIcons.PeopleOutlined className="tw-text-gray-500" />
              <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                {`${tour.numberOfAdults + tour.numberOfChildren} `}
                {t(tour.numberOfAdults + tour.numberOfChildren > 1 ? "peoples" : "people")}
              </Typography>
            </Box>
          </Box>

          <Box className="tw-text-right">
            <Box className="tw-flex tw-items-center tw-gap-2">
              <Typography className="tw-text-sm tw-font-semibold tw-border tw-border-gray-600 tw-bg-gray-200 tw-rounded-lg tw-py-1 tw-px-2">
                {`${tour.numberOfAdults + tour.numberOfChildren} x `}
                {tour.paymentMethod === PaymentMethod.VNPAY
                  ? `${(tour.Tour.price * Number(VND)).toLocaleString("vi-VN")} VND`
                  : `$ ${tour.Tour.price.toLocaleString()}`}
              </Typography>

              <Typography className="tw-text-lg tw-font-bold tw-text-gray-800">
                {tour.paymentMethod === PaymentMethod.VNPAY ? "" : "$"} {tour.totalPrice.toLocaleString("vi-VN")}
              </Typography>
            </Box>

            {!(tour.status === BookingStatus.CANCELLED || tour.status === BookingStatus.COMPLETED) && (
              <StatusActionButtons
                status={tour.status}
                id={tour.id}
                onCancel={onCancelTour}
                onNavigate={onNavigateToPaymentPage}
                extraClassName="tw-custom-class" // Add css if need
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TourCard;