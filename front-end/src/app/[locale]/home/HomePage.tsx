"use client";

import { commonImg } from "@/assets";
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
import Link from "@/components/common/Link";
import pageUrls from "@/constants/pageUrls";
import useGetCityCustomer from "@/services/modules/city/hook/useGetCityCustomer";
import useGetDetailCityCustomer from "@/services/modules/city/hook/useGetDetailCityCustomer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiUrls from "@/constants/apiUrls";
import { CityDetail } from "@/services/modules/city/interfaces/city";
import City from "../admin/city/city";

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
  imageBanner: commonImg.alaska.src,
  name: "Alaska",
  title:
    "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
};

const trendingCity = {
  imageBanner: commonImg.bannerTrendingCity.src,
  image: commonImg.imagesTrendingCity.src,
  title: "Wilderlife of Alaska",
  place: "Alaska, USA",
  rate: 4.9,
  reviews: 300,
  content:
    "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
};
export const mocDataCard = [
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
  {
    link: "/citytour/1",
    src: "https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg",
    title: "Alaska: Westminster to Greenwich River Thames",
    duration: 2,
    transport: "Transport Facility",
    plan: "Family Plan",
    price: 35,
    feedback_quantity: 500,
    feedback_average: 4.5,
  },
];
export default function HomePage() {
  const t = useTranslations("homePage");
  const { data: dataCity, refetch: refetchCity } = useGetCityCustomer();
  const [slug, setSlug] = useState<string | null>(null);
  console.log({ sss: !!slug })
  const { data: CityDetail, refetch } = useGetDetailCityCustomer(String(slug), { isTrigger: !!slug });

  useEffect(() => {
    if (dataCity?.items && dataCity?.items?.length > 0 && !slug) {
      const initialCity = dataCity?.items[0];
      if (initialCity?.slug) {
        setSlug(initialCity.slug);
      }
    }
  }, [dataCity, slug]);

  const handleChangeSlug = async (slug: string) => {
    setSlug(slug);
    await refetch();
  }

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
            backgroundImage: `url('${commonImg.banner.src}')`,
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
                    type="size15Weight800"
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
                <CommonIcons.PeopleOutlined className="tw-text-primary" />
                <div className="tw-ml-[10px]">
                  <CommonStyles.Typography
                    type="size15Weight800"
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
                <CommonIcons.CalendarMonthOutlined className="tw-text-primary" />
                <div className="tw-ml-[10px]">
                  <CommonStyles.Typography
                    type="size15Weight800"
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
                  className="outlined tw-w-[150px]"
                  type="submit"
                  variant="outlined"
                >
                  <CommonStyles.Typography type='size16Weight800' className=''>{"Search"}</CommonStyles.Typography>
                </CommonButton>
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
          {dataCity?.items.map((city, index) => {
            return (
              <CommonStyles.CommonButton
                variant="outlined"
                className={`tw-w-32 rounded ${slug === city?.slug ? "active" : ""} `}
                key={index}
                onClick={() => handleChangeSlug(city.slug ?? "")}
              >
                <CommonStyles.Typography type="size14Weight700">
                  {city?.name}
                </CommonStyles.Typography>
              </CommonStyles.CommonButton>
            );
          })}
        </Container>
        <CommonStyles.Box className="tw-flex tw-w-full tw-justify-center">
          <Container>
            <PopularCity
              imageBanner={`${apiUrls.IMG_URL}/${CityDetail?.data?.image}`}
              name={CityDetail?.data?.name || ""}
              title={CityDetail?.data?.description || ""}
              listService={CityDetail?.data?.Tag.map((tag) => ({
                name: tag?.name,
                icon: tag?.icon,
                color: tag?.color,
              })) || []}
            />
          </Container>
        </CommonStyles.Box>
        <Container>
          <CommonStyles.Typography
            type="size18Weight700"
            className="tw-cursor-pointer tw-text-right tw-mr-6"
            color="#7BBCB0">
            <Link href={pageUrls.CityTour}>
              {t("seeMore")}
            </Link>
          </CommonStyles.Typography>
          <Container className="tw-grid tw-grid-cols-12 tw-gap-x-5">
            {CityDetail?.data?.Tour.map((item, index) => {
              return (
                <CommonStyles.Box key={index} className="tw-col-span-3">
                  <CardGridItem
                    link=""
                    src={`${apiUrls.IMG_URL}/${item?.TourImage?.[0]?.image}`}
                    title={item?.name}
                    duration={item?.numberOfHours}
                    transport={item?.transport}
                    plan={item?.package}
                    price={item?.price}
                    feedback_quantity={item?.totalReviews}
                    feedback_average={item?.averageRating}
                  />
                </CommonStyles.Box>
              );
            })}
          </Container>
        </Container>
      </CommonStyles.Box>
      {/* III. Section Suggest Tour */}
      <CommonStyles.Box>
        <TrendingCity trendingCity={trendingCity} />
      </CommonStyles.Box>
      {/* IV. Featured Destinations */}
      <CommonStyles.Box className="tw-flex tw-flex-col tw-w-full tw-justify-between tw-items-center">
        <CardCarousel
          data={mocDataCard}
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
      <Container className="tw-flex tw-flex-col tw-gap-12">
        <CommonStyles.Box>
          <Gallery />
        </CommonStyles.Box>
        {/* VII. Latest Stories */}
        <CommonStyles.Box>
          <LatestStories />
        </CommonStyles.Box>
      </Container>
    </CommonStyles.Box >
  );
}
