"use client";
import * as Yup from "yup";
import CommonStyles from "@/components/common";
import { Container } from "@mui/material";
import {commonImg } from "@/assets";
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
import ServiceItem from "./components/ServiceItem";
import Slider from "./components/Slider";
import Feedback from "./components/Feedback";
import { useParams } from "next/navigation";
import useGetTourCustomer from "@/services/modules/tour/hooks/useGetTourCustomer";
import { defaultValue, InfoBooking, NoOfGuest } from "./forms";
import { mocDataCard } from "../../home/HomePage";

const CityTourDetail = () => {
  const params = useParams();
  const { cityTourId } = params;
  const { showError } = useNotifications();
  const t = useTranslations("cityTourDetail");

  const { data, loading } = useGetTourCustomer(Number(cityTourId));

  const imgs = [commonImg.detail1, commonImg.detail2, commonImg.detail3, commonImg.detail4, commonImg.detail5, commonImg.detail6];
  const services = [
    {
      title: "Free cancellation",
      description: "Cancel up to 24 hours in advance to receive a full refund",
      icon: <CommonIcons.Cancelation color="var(--primary)" />,
    },
    {
      title: "Health precautions",
      description: "Special health and safety measures apply. Learn more",
      icon: <CommonIcons.Health color="var(--primary)" />,
    },
    {
      title: "Mobile ticketing",
      description: "Use your phone or print your voucher",
      icon: <CommonIcons.CacbonMobile color="var(--primary)" />,
    },
    {
      title: "Duration 3.5 hours",
      description: "Check availability to see starting times.",
      icon: <CommonIcons.Duration color="var(--primary)" />,
    },
    {
      title: "Instant confirmation",
      description: "Don’t wait for the confirmation!",
      icon: <CommonIcons.FluenFlash color="var(--primary)" />,
    },
    {
      title: "Live tour guide in English",
      description: "English",
      icon: <CommonIcons.LiveTour color="var(--primary)" />,
    },
  ];
  const validateSchema = Yup.object().shape({
    startDate: Yup.date()
      .required(t("validations.startDateRequire"))
      .typeError(t("validations.startDateInvalid"))
      .min(new Date(), t("validations.startDateMin")),
    endDate: Yup.date()
      .required(t("validations.endDateRequire"))
      .typeError(t("validations.endDateInvalid"))
      .min(Yup.ref("startDate"), t("validations.endDateAfterStartDate")),
    noOfGuest: Yup.object().shape({
      adultQuantity: Yup.number(),
      childQuantity: Yup.number(),
    }),
  });

  const { handleSubmit, control, setValue } = useForm<InfoBooking>({
    defaultValues: defaultValue,
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(validateSchema),
  });

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
  const handleRenderServiceItem = () => {
    return services.map((item) => {
      return (
        <ServiceItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      );
    });
  };
  const handleSetValue = (value: NoOfGuest) => {
    setValue("noOfGuest", value);
  };
  return (
    <div className="tw-py-12">
      <Container className="tw-flex tw-flex-col tw-gap-y-8">
        <CommonStyles.Box className="tw-grid tw-grid-cols-12">
          <CommonStyles.Box className="tw-col-span-8 tw-flex tw-flex-col tw-gap-4">
            <CommonStyles.Typography
              type="size36Weight700"
              className="tw-text-accent_gray_dark tw-leading-tight"
            >
              {data?.tour.name}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3 tw-text-accent_gray_800">
              <CommonStyles.Typography className="tw-flex tw-items-center ">
                <CommonIcons.LocationOn className="tw-w-4" />
                {data?.tour.City.name}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center">
                <CommonStyles.Rating
                  haveFeedback={false}
                  readOnly
                  valueTable={data?.tour.averageRating}
                />
                <CommonStyles.Typography className="tw-ml-[2px]">
                  ({data?.tour.totalReviews} {t("reviews")})
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-10">
          <CommonStyles.Box className="tw-col-span-8 tw-flex tw-flex-col tw-gap-y-5">
            {/* Slide city tour */}
            <Slider imgs={imgs} />
            {/* Services */}
            <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-10 tw-bg-[#16527D14] tw-p-5 tw-rounded-sm">
              {handleRenderServiceItem()}
            </CommonStyles.Box>
            {/* Description */}
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Description"
                content="See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus."
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Activity"
                content="See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus."
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="What is included / not  included"
                content="See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus."
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Safety"
                content="See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus."
              />
            </CommonStyles.Box>
            <CommonStyles.Box>
              <DescriptionCityTour
                title="Details"
                content="See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus."
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-col-span-4 tw-h-fit">
            <form
              onSubmit={handleSubmit(onSubmit)}
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
                    {data?.tour.price}
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
              classNameContainerHeading="tw-px-0"
              data={mocDataCard}
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
              data={mocDataCard}
              title={
                <CommonStyles.Typography type="size22Weight700">
                  {t("relatedToursIn")} {data?.tour.City.name}
                </CommonStyles.Typography>
              }
            />
            <CommonStyles.Divider />
          </CommonStyles.Box>
          {/* Feedback */}
          <Feedback />
        </CommonStyles.Box>
      </Container>
    </div>
  );
};

export default CityTourDetail;
