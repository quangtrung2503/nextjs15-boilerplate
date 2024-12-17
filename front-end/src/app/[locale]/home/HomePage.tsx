"use client";

import {
  alaska,
  banner,
  bannerTrendingCity,
  imagesTrendingCity,
} from "@/assets";
import { default as CommonStyles } from "@/components/common";
import { LocationOn, PlayArrow } from "@mui/icons-material";
import { CommonButton } from "@/components/common/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { CommonDatePicker } from "@/components/common/DatePicker";
import { Box, Container, Divider } from "@mui/material";
import PopularCity, { PopularCityProps } from "./components/PopularCity";
import TrendingCity from "./components/TrendingCity";
import CardGridItem from "@/components/Card/CardGirdItem";
import CardCarousel from "@/components/CardCarousel";
import IntroduceMobileApp from "./components/IntroduceMobileApp";
import Gallery from "./components/Gallery";
import LatestStories from "./components/LatestStories";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import Heading from "./components/Heading";

interface FormValues {
  location: string;
  guests: number | undefined;
  date: string | undefined;
}
const initValue = { location: "", guests: undefined, date: undefined };
const listCity = [
  "New York",
  "California",
  "Alaska",
  "Sidney",
  "Dubai",
  "London",
  "Tokyo",
  "Delhi",
];
const popularCity: PopularCityProps = {
  listService: [
    {
      title: "Public Transportations",
      icon: <CommonIcons.BusIcon />,
      color: "#D176E0",
    },
    {
      title: "Nature & Adventure",
      icon: <CommonIcons.TravelIcon />,
      color: "#7BBCB0",
    },
    {
      title: "Private Transportations",
      icon: <CommonIcons.TaxiIcon />,
      color: "#E4B613",
    },
    {
      title: "Business Tours",
      icon: <CommonIcons.WalletIcon />,
      color: "#FC3131",
    },
    {
      title: "Local Visit",
      icon: <CommonIcons.LocalIcon />,
      color: "#5C9BDE",
    },
  ],
  imageBanner: alaska.src,
  name: "Alaska",
  title:
    "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.0",
};

const trendingCity = {
  imageBanner: bannerTrendingCity.src,
  image: imagesTrendingCity.src,
  title: "Wilderlife of Alaska",
  place: "Alaska, USA",
  rate: 4.9,
  reviews: 300,
  content:
    "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
};
export default function HomePage() {
  const t = useTranslations("homePage");
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: initValue,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <CommonStyles.Box className="tw-min-w-full tw-flex tw-flex-col tw-gap-y-12 tw-mb-20">
      {/* I. Section Landing and Search form */}
      <CommonStyles.Box>
        {/* 1. Section Landing */}
        <CommonStyles.Box
          className="tw-h-[740px] tw-flex tw-items-center tw-justify-center tw-bg-cover tw-bg-center"
          sx={{
            backgroundImage: `url('${banner.src}')`,
          }}
        >
          <CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center tw-text-accent_gray_dark">
              <CommonStyles.Typography
                className="tw-text-center"
                type="size48Weight700"
              >
                {t("title")}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                className="tw-text-center tw-w-[569px] tw-mt-[22px] tw-leading-[25px]"
                type="size16Weight600"
              >
                {t("subtitleAboutTour")}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center tw-pt-[15px]">
                <CommonStyles.Box className="tw-flex tw-items-center tw-justify-center tw-relative tw-w-[100px] tw-h-[100px]">
                  <span className="tw-absolute tw-w-full tw-h-full tw-bg-gray-50 tw-rounded-full tw-opacity-30 tw-animate-ping"></span>
                  <span className="tw-absolute tw-w-[70%] tw-h-[70%] tw-bg-gray-100 tw-rounded-full tw-opacity-70 tw-animate-ping"></span>
                  <PlayArrow
                    fontSize="large"
                    className="tw-text-primary tw-bg-white tw-p-3 tw-rounded-full tw-size-7 tw-z-10"
                  />
                </CommonStyles.Box>
                <CommonStyles.Typography className="" type="size20Weight700">
                  {t("watchVideo")}
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        {/* 2.Search form */}
        <CommonStyles.Box className="tw-flex tw-justify-center -tw-mt-[45px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ boxShadow: "0px 10px 30px 0px #7BBCB080" }}
            className="tw-relative tw-flex tw-w-[1000px] tw-h-[90px] tw-bg-white tw-rounded-[10px]"
          >
            <CommonStyles.Box className="tw-p-[20px] tw-grid tw-grid-cols-9 tw-items-center tw-w-full">
              <CommonStyles.Box className="tw-flex tw-col-span-3">
                <LocationOn className="tw-text-primary" />
                <div className="tw-ml-[10px]">
                  <CommonStyles.Typography
                    type="size14Weight500"
                    className="tw-text-primary"
                  >
                    {t("locationLabel")}
                  </CommonStyles.Typography>
                  <RHFField
                    sx={{
                      fieldset: {
                        border: "none",
                      },
                      input: {
                        lineHeight: "25px",
                        fontSize: "14px",
                        padding: 0,
                      },
                    }}
                    name="location"
                    placeholder={t("locationPlaceholder")}
                    control={control}
                    component={InputField}
                  />
                </div>
              </CommonStyles.Box>
              <CommonStyles.Box className="tw-flex tw-col-span-2 before:tw-h-1">
                <Divider
                  orientation="vertical"
                  variant="middle"
                  className="tw-h-5 tw-items-center tw-mr-2"
                  flexItem
                />
                <PeopleOutlinedIcon className="tw-text-primary" />
                <div className="tw-ml-[10px]">
                  <CommonStyles.Typography
                    type="size14Weight500"
                    className="tw-text-primary"
                  >
                    {t("guestsLabel")}
                  </CommonStyles.Typography>
                  <RHFField
                    sx={{
                      fieldset: {
                        border: "none",
                      },
                      input: {
                        lineHeight: "25px",
                        fontSize: "14px",
                        padding: 0,
                      },
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          WebkitAppearance: "none",
                        },
                    }}
                    type="number"
                    name="guests"
                    placeholder={t("guestsPlaceholder")}
                    control={control}
                    component={InputField}
                  />
                </div>
              </CommonStyles.Box>
              <CommonStyles.Box className="tw-flex tw-col-span-2">
                <Divider
                  orientation="vertical"
                  variant="middle"
                  className="tw-h-5 tw-items-center tw-mr-2"
                  flexItem
                />
                <CalendarMonthOutlinedIcon className="tw-text-primary" />
                <div className="tw-ml-[10px]">
                  <CommonStyles.Typography
                    type="size14Weight500"
                    className="tw-text-primary"
                  >
                    {t("dateLabel")}
                  </CommonStyles.Typography>
                  <RHFField
                    sx={{
                      fieldset: {
                        border: "none",
                      },
                      input: {
                        fontSize: "14px",
                        padding: 0,
                      },
                    }}
                    isMobileDate
                    name="date"
                    control={control}
                    className="tw-bg-transparent tw-h"
                    placeholder={t("datePlaceholder")}
                    component={CommonDatePicker}
                  />
                </div>
              </CommonStyles.Box>
              <CommonStyles.Box className="tw-flex tw-justify-end tw-col-span-2">
                <CommonButton
                  label="Search"
                  className="outlined tw-w-[150px]"
                  type="submit"
                  variant="outlined"
                />
              </CommonStyles.Box>
            </CommonStyles.Box>
          </form>
        </CommonStyles.Box>
      </CommonStyles.Box>
      {/* II. Explore Popular Cities and Section Suggest Tour */}
      <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-10">
        {/* 1. Explore Popular Cities */}
        <Container>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center border">
            <CommonStyles.Typography
              type="size48Weight700"
              className="tw-text-accent_gray_dark"
            >
              {t("explorePopularCity")}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              className="tw-text-center tw-w-1/2 tw-mt-[22px] tw-leading-[25px] tw-text-accent_gray_500"
              type="size16Weight600"
            >
              {t("subheading")}
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </Container>
        {/* 2. Section Suggest Tour */}
        <Container className="tw-flex tw-w-full tw-justify-center tw-gap-3">
          {listCity.map((city, index) => {
            return (
              <CommonStyles.CommonButton
                variant="outlined"
                className={`tw-w-32 rounded ${city === "Alaska" && "active"}`}
                key={index}
              >
                <CommonStyles.Typography type="size14Weight700">
                  {city}
                </CommonStyles.Typography>
              </CommonStyles.CommonButton>
            );
          })}
        </Container>
        <CommonStyles.Box className="tw-flex tw-w-full tw-justify-center">
          <Container>
            <PopularCity
              imageBanner={popularCity.imageBanner}
              name={popularCity.name}
              title={popularCity.title}
              listService={popularCity.listService}
            />
          </Container>
        </CommonStyles.Box>
        <Container className="tw-grid tw-grid-cols-12 tw-gap-x-5">
          {Array(4)
            .fill(null)
            .map((item, index) => {
              return (
                <CommonStyles.Box key={index} className="tw-col-span-3">
                  <CardGridItem
                    src="https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg"
                    title="Alaska: Westminster to Greenwich River Thames"
                    duration={2}
                    transport="Transport Facility"
                    plan="Family Plan"
                    price={35}
                    feedback_quantity={500}
                  />
                </CommonStyles.Box>
              );
            })}
        </Container>
      </CommonStyles.Box>
      {/* III. Section Suggest Tour */}
      <CommonStyles.Box>
        <TrendingCity trendingCity={trendingCity} />
      </CommonStyles.Box>
      {/* IV. Featured Destinations */}
      <CommonStyles.Box>
        <CardCarousel
          title={
            <Heading
              title={t("featuredDestinationsHeading")}
              des={t("subFeaturedDestinationsHeading")}
            />
          }
        />
      </CommonStyles.Box>
      {/* V. Introduce Mobile App */}
      <CommonStyles.Box>
        <IntroduceMobileApp />
      </CommonStyles.Box>
      {/* VI. From The Gallery */}
      <CommonStyles.Box>
        <Gallery />
      </CommonStyles.Box>
      {/* VII. Latest Stories */}
      <CommonStyles.Box>
        <LatestStories />
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
}
