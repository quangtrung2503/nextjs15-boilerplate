import { LocationOn } from "@mui/icons-material";
import CommonIcons from "@/components/CommonIcons";
import { Box, Breadcrumbs, CardMedia, Typography, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { CommonButton } from "@/components/common/Button";
import { HistoryBookingTour } from "@/services/modules/tour/interfaces/tour";
import { statusColors } from "@/utils/utils";

const tours: HistoryBookingTour[] = [
  {
    id: 1,
    orderId: "55244324",
    bookingDate: "02/01/2025",
    status: "PENDING",
    name: " Khám phá di sản văn hóa thế giới Vịnh Hạ Lon Khám phá di sản văn hóa thế giới Vịnh Hạ Long Khám phá di sản văn hóa thế giới Vịnh Hạ Long Khám phá di sản văn hóa thế giới Vịnh Hạ Longg",
    startDate: "03/01/25",
    endDate: "05/01/25",
    location: "Vịnh Hạ Long",
    people: 2,
    pricePerTour: 5000.0,
    totalPrice: 1000.0,
    image: "https://danangopentour.vn/uploads/09-2019/tour-tham-quan-thu-do-ha-noi-chua-mot-cot-m-(1).jpg",
  },
  {
    id: 2,
    orderId: "55244325",
    bookingDate: "02/01/2025",
    status: "CONFIRMED",
    name: "Trải nghiệm thiên nhiên và văn hóa Tây Bắc dài ngày",
    startDate: "04/01/25",
    endDate: "06/01/25",
    location: "Tây Bắc",
    people: 4,
    pricePerTour: 700.0,
    totalPrice: 2800.0,
    image: "https://danangopentour.vn/uploads/09-2019/tour-tham-quan-thu-do-ha-noi-chua-mot-cot-m-(1).jpg",
  },
  {
    id: 3,
    orderId: "55244326",
    bookingDate: "03/01/2025",
    status: "COMPLETED",
    name: "Tour khám phá đảo Phú Quốc và những điều thú vị",
    startDate: "05/01/25",
    endDate: "07/01/25",
    location: "Phú Quốc",
    people: 3,
    pricePerTour: 600.0,
    totalPrice: 1800.0,
    image: "https://danangopentour.vn/uploads/09-2019/tour-tham-quan-thu-do-ha-noi-chua-mot-cot-m-(1).jpg",
  },
  {
    id: 4,
    orderId: "55244327",
    bookingDate: "04/01/2025",
    status: "CANCELLED",
    name: "Khám phá nét đẹp văn hóa miền Trung Việt Nam",
    startDate: "06/01/25",
    endDate: "08/01/25",
    location: "Miền Trung",
    people: 5,
    pricePerTour: 400.0,
    totalPrice: 2000.0,
    image: "https://danangopentour.vn/uploads/09-2019/tour-tham-quan-thu-do-ha-noi-chua-mot-cot-m-(1).jpg",
  },
  {
    id: 5,
    orderId: "55244328",
    bookingDate: "03/01/2025",
    status: "REFUNDED",
    name: "Trải nghiệm văn hóa và ẩm thực Hà Nội với nhiều món ăn độc đáo",
    startDate: "07/01/25",
    endDate: "09/01/25",
    location: "Hà Nội",
    people: 3,
    pricePerTour: 800.0,
    totalPrice: 2400.0,
    image: "https://danangopentour.vn/uploads/09-2019/tour-tham-quan-thu-do-ha-noi-chua-mot-cot-m-(1).jpg",
  },
];

const groupToursByDate = (tours: HistoryBookingTour[]) => {
  return tours.reduce((groups: Record<string, HistoryBookingTour[]>, tour) => {
    const date = tour.bookingDate;
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
  console.log(`Hủy tour với ID: ${tourId}`);
  // Gửi request đến backend hoặc cập nhật trạng thái tour tại đây
};

const BookingHistory = () => {
  //!Hook + const
  const t = useTranslations('profile.bookingHistory');
  
  //!Call function
  const groupedTours = groupToursByDate(tours);

  return (
    <Box className="tw-flex-grow tw-rounded-sm tw-bg-gray-50 tw-p-10">
      <Typography
        variant="h6"
        className="tw-mb-6 tw-text-left tw-text-xl tw-font-bold tw-text-gray-800"
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

            {tours.map((tour) => (
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
                      Order item: {tour.orderId}
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
                      image={tour.image}
                    />
                    <Box className="tw-flex-grow">
                      <Tooltip title={tour.name} placement="top">
                        <Typography
                          className="tw-font-semibold tw-text-lg tw-text-gray-800 tw-line-clamp-1 tw-break-words"
                        >
                          {truncateText(tour.name, 70)}
                        </Typography>
                      </Tooltip>

                      <Box className="tw-flex tw-items-center tw-mt-2">
                        <CommonIcons.CalendarMonthOutlined className="tw-text-gray-500" />
                        <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                          {tour.startDate} - {tour.endDate}
                        </Typography>
                      </Box>

                      <Box className="tw-flex tw-items-center tw-mt-2">
                        <LocationOn className="tw-text-gray-500" />
                        <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                          {tour.location}
                        </Typography>
                        <Typography className="tw-mx-2 tw-text-sm tw-text-gray-500">|</Typography>
                        <CommonIcons.PeopleOutlined className="tw-text-gray-500" />
                        <Typography className="tw-ml-2 tw-text-sm tw-text-gray-600">
                          {tour.people} {tour.people > 1 ? t('peoples') : t('people')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="tw-text-right">
                      <Box className="tw-flex tw-items-center tw-gap-2">
                        <Typography className="tw-text-sm tw-font-semibold tw-text-gray-400 tw-border tw-border-gray-600 tw-bg-gray-200 tw-rounded-lg tw-py-1 tw-px-2">
                          {tour.people} x ${tour.pricePerTour.toLocaleString('vi-VN')}
                        </Typography>
                        <Typography className="tw-text-lg tw-font-bold tw-text-gray-800">
                          ${tour.totalPrice.toLocaleString('vi-VN')}
                        </Typography>
                      </Box>
                      {!(tour.status === "CANCELLED" || tour.status === "REFUNDED") && (
                         <CommonButton
                         variant="outlined"
                         color="error"
                         className="tw-mt-8 tw-scroll-py-px tw-text-xs tw-rounded-lg"
                         onClick={() => handleCancelTour(tour.id)}
                       >
                         {t('cancellation')}
                       </CommonButton>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BookingHistory;