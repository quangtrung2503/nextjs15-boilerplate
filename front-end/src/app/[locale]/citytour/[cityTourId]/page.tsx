"use client";
import * as Yup from "yup";
import CommonStyles from "@/components/common";
import { Container } from "@mui/material";
import CommonIcons from "@/components/CommonIcons";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { CommonButton } from "@/components/common/Button";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotifications } from "@/helpers/toast";
import { CommonDatePicker } from "@/components/common/DatePicker";
import SelectNoOfGuest from "./components/SelectNoOfGuest";
import DescriptionCityTour from "./components/DescriptionCityTour";
import CardCarousel from "@/components/CardCarousel";
import Slider from "./components/Slider";
import Feedback from "./components/Feedback";
import useGetTourCustomer from "@/services/modules/tour/hooks/useGetTourCustomer";
import { defaultValue, InfoBooking, NoOfGuest } from "./forms";
import useGetTourCustomerReview from "@/services/modules/tour/hooks/useGetTourReviewCustomer";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import { generateHtmlContent, mapTours } from "./functions";

const CityTourDetail = () => {
  //! Hook
  const t = useTranslations("cityTourDetail");
  const { showError } = useNotifications();
  const { filters, handleChangePage } = useFiltersHandler({ page: 1, perPage: 1 });
  //! prop + state + const

  //! Fetch Data
  const api ="vintage-double-decker-bus-tour-&-thames-river-cruise-i.3"
  const { data } = useGetTourCustomer(api);
  const { dataCustomerReview, stats, hasMore } = useGetTourCustomerReview(filters, api);

  //! Define
  const { tour, listTourInToday, listTourSameCity } = data ?? {};
  const tourInDays = mapTours(listTourInToday);
  const tourSameCity = mapTours(listTourSameCity);

  //! Extract tour details
  const {
    TourImage = [],
    included = "",
    notIncluded = "",
    language = "",
    numberOfHours,
    numberOfPeople,
    guideMeetingAddress,
  } = tour ?? {};

  const includes = [included, notIncluded];
  const details = [
    language,
    generateHtmlContent('Duration', `${numberOfHours} hours`),
    generateHtmlContent('Number Of People', `${numberOfPeople} People`),
  ];

  const meetingAddress = generateHtmlContent('Meeting Point Address', `${guideMeetingAddress}`)

  const validateSchema: Yup.ObjectSchema<InfoBooking>  = Yup.object().shape({
    rating: Yup.number().defined(),
    startDate: Yup.string().defined()
      .required(t("validations.startDateRequire"))
      
      .typeError(t("validations.startDateInvalid")),
      // .min(new Date(), t("validations.startDateMin")),
    endDate: Yup.string()
      .required(t("validations.endDateRequire"))
      .typeError(t("validations.endDateInvalid")),
      // .min(Yup.ref("startDate"), t("validations.endDateAfterStartDate")),
    noOfGuest: Yup.object().shape({
      adultQuantity: Yup.string().nullable().defined(),
      childQuantity: Yup.string().nullable().defined(),
    }),
  });

  const { handleSubmit, control, setValue } = useForm<InfoBooking>({
    defaultValues: defaultValue,
    criteriaMode: "all",
    resolver: yupResolver(validateSchema),
  });

  // Function
  const onSubmit: SubmitHandler<InfoBooking> = async (values: InfoBooking) => {
    const body = {
      startDate: values?.startDate,
      endDate: values?.endDate,
      noOfGuest: values?.noOfGuest,
    };
    try {
      // const res = await auth?.signIn(requestPayload);
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  };
  const handleSetValue = (value: NoOfGuest) => {
    // setValue("noOfGuest", value);
  };
  const handleLoadMoreReview = () => {
    const _event: any = "";
    handleChangePage(_event, filters.page + 1);
  };

  //! Function render

  //! Render
  return (
    <div className="tw-py-12">
      <Container className="tw-flex tw-flex-col tw-gap-y-8">
        <CommonStyles.Box className="tw-grid tw-grid-cols-12">
          <CommonStyles.Box className="tw-col-span-8 tw-flex tw-flex-col tw-gap-4">
            <CommonStyles.Typography
              type="size36Weight700"
              className="tw-text-accent_gray_dark tw-leading-tight"
            >
              {tour?.name}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3 tw-text-accent_gray_800">
              <CommonStyles.Typography className="tw-flex tw-items-center ">
                <CommonIcons.LocationOn className="tw-w-4" />
                {tour?.City?.name}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center">
                <RHFField
                  name="rating"
                  control={control}
                  component={CommonStyles.Rating}
                  valueTable={tour?.averageRating}
                />
                <CommonStyles.Typography className="tw-ml-[2px]">
                  ({tour?.totalReviews} {t("reviews")})
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-10">
          <CommonStyles.Box className="tw-col-span-8 tw-flex tw-flex-col tw-gap-y-5">
            {/* Slide city tour */}
            <Slider imgs={TourImage.map((item) => item.image)} />
            {/* Description */}
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Description"
                content={tour?.description || ""}
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Activity"
                content={tour?.activity || ""}
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="What is included / not  included"
                content={""}
                items={includes}
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Safety"
                content={tour?.safety || ""}
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Details"
                content={meetingAddress}
                items={details}
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-col-span-4 tw-h-fit">
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className=" tw-bg-white tw-rounded-md tw-shadow-select tw-w-full"
            >
              <CommonStyles.Box className="tw-w-full">
                <CommonStyles.Typography
                  type="size18Weight700"
                  className="tw-px-8 tw-py-4"
                >
                  {t("booking")}
                </CommonStyles.Typography>
                <CommonStyles.Divider />
              </CommonStyles.Box>
              <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center tw-gap-5 tw-mx-auto tw-p-8">
                <CommonStyles.Box className="tw-w-full tw-flex tw-flex-col tw-gap-5">
                  <RHFField
                    name="startDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"From"}
                  />
                  <RHFField
                    name="endDate"
                    control={control}
                    component={CommonDatePicker}
                    label={"To"}
                  />
                  <RHFField
                    name="noOfGuest"
                    control={control}
                    handelSetValue={handleSetValue}
                    component={SelectNoOfGuest}
                  />
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
                  <CommonStyles.Typography
                    type="size14Weight600"
                    className="tw-text-accent_gray_500"
                  >
                    {t("subtotal")}
                  </CommonStyles.Typography>
                  <CommonStyles.Typography
                    className="tw-text-primary"
                    type="size36Weight900"
                  >
                    {t("currency")}
                    {tour?.price}
                  </CommonStyles.Typography>
                </CommonStyles.Box>
                <CommonButton
                  className="tw-w-full tw-bg-primary tw-text-accent_gray_800"
                  type="submit"
                >
                  <CommonStyles.Typography
                    type="size15Weight600"
                    className="tw-text-white"
                  >
                    {t("formBooking.confirmBooking")}
                  </CommonStyles.Typography>
                </CommonButton>
                <CommonButton
                  variant="outlined"
                  startIcon={<CommonIcons.FavoriteBorderOutlined />}
                  className="tw-w-full tw-text-accent_gray_500 tw-border-accent_gray_500"
                  type="button"
                >
                  {t("formBooking.saveToWishlist")}
                </CommonButton>
                <CommonButton
                  variant="outlined"
                  startIcon={<CommonIcons.Share />}
                  className="tw-w-full tw-text-accent_gray_500 tw-border-accent_gray_500"
                  type="button"
                >
                  {t("formBooking.shareTheActivity")}
                </CommonButton>
              </CommonStyles.Box>
            </form>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-5">
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading="tw-px-0 tw-font-volkhov"
              data={tourInDays}
              title={
                <CommonStyles.Typography type="size22Weight700">
                  {t("relatedToursInToday")}
                </CommonStyles.Typography>
              }
            />
            <CommonStyles.Divider />
          </CommonStyles.Box>
          <CommonStyles.Box>
            <CardCarousel
              classNameContainerHeading="tw-px-0"
              data={tourSameCity}
              title={
                <CommonStyles.Typography type="size22Weight700">
                  {t("relatedToursIn")} {tour?.name}
                </CommonStyles.Typography>
              }
            />
            <CommonStyles.Divider />
          </CommonStyles.Box>
          {/* Feedback */}
          <Feedback
            feedbacks={dataCustomerReview}
            stats={stats}
            onLoadMore={handleLoadMoreReview}
            hasMore={hasMore}
          />
        </CommonStyles.Box>
      </Container>
    </div>
  );
};

export default CityTourDetail;
