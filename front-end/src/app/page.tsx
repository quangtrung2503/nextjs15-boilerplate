'use client'

import { alaska, banner, bannerTrendingCity, imagesTrendingCity } from "@/assets"
import { default as CommonStyles } from "@/components/common"
import { LocationCity, LocationOn, PlayArrow, PlayCircle, PlayCircleFilledOutlined, PlayCircleFilledRounded, PlayCircleOutline } from "@mui/icons-material"
import { CommonButton } from "@/components/common/Button"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import RHFField from "@/components/customReactFormField/ReactFormField"
import InputField from "@/components/customReactFormField/InputField"
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { CommonDatePicker } from "@/components/common/DatePicker"
import { Divider } from "@mui/material"
import PopularCity, { PopularCityProps } from "./Component/PopularCity"
import { BusIcon, LocalIcon, TaxiIcon, TravelIcon, WalletIcon } from "@/components/CommonIcons/ServiceIcon"
import TrendingCity from "./Component/TrendingCity"

interface FormValues {
  location: string;
  guests: number | undefined;
  date: string | undefined;
}
const initValue = { location: "", guests: undefined, date: undefined }
const listCity = [
  "New York",
  "California",
  "Alaska",
  "Sidney",
  "Dubai",
  "London",
  "Tokyo",
  "Delhi",
]
const popularCity: PopularCityProps = {
  listService: [
    {
      title: "Public Transportations",
      icon: <BusIcon />,
      color: "#D176E0",
    },
    {
      title: "Nature & Adventure",
      icon: <TravelIcon />,
      color: "#7BBCB0"
    },
    {
      title: "Private Transportations",
      icon: <TaxiIcon />,
      color: "#E4B613"
    },
    {
      title: "Business Tours",
      icon: <WalletIcon />,
      color: "#FC3131"
    },
    {
      title: "Local Visit",
      icon: <LocalIcon />,
      color: "#5C9BDE"
    },
  ],
  imageBanner: alaska.src,
  name: "Alaska",
  title: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.0"
}

const trendingCity = {
  imageBanner: bannerTrendingCity.src,
  image: imagesTrendingCity.src,
  title: "Wilderlife of Alaska",
  place: "Alaska, USA",
  rate: 4.9,
  reviews: 300,
  content: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
}
export default function App() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: initValue,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <CommonStyles.Box className="tw-min-w-full">
      <CommonStyles.Box className="tw-h-[740px] tw-relative"
        sx={{
          backgroundImage: `url('${banner.src}')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <CommonStyles.Box
          className="tw-absolute"
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
            <CommonStyles.Typography type="size48Weight700" sx={{ fontFamily: "serif" }} className="" >We Find The Best Tours For You</CommonStyles.Typography>
            <CommonStyles.Typography
              className="tw-text-center tw-w-[569px] tw-mt-[22px] tw-leading-[25px]"
              type="size16Weight600"
              sx={{ fontFamily: "inherit" }}>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-flex tw-items-center tw-pt-[15px]">
              {/* <CommonStyles.Box className="tw-flex tw-items-center tw-justify-center tw-relative tw-w-[100px] tw-h-[100px]">
                <span className="tw-w-[100px] tw-border-2 tw-h-[100px] tw-border-red-500 tw-absolute tw-rounded-full"></span>
                <span className="tw-w-[72px] tw-border-2 tw-h-[72px] tw-border-red-500 tw-absolute tw-bg-[#FFFFFF4D] tw-rounded-full"></span>
                <PlayArrow
                  fontSize="large"
                  className="tw-absolute tw-text-[#7BBCB0] tw-bg-[#fff] tw-p-3 tw-rounded-full tw-size-7 tw-z-10"
                />
              </CommonStyles.Box> */}


              <CommonStyles.Box className="tw-flex tw-items-center tw-justify-center tw-relative tw-w-[100px] tw-h-[100px]">
                <span className="tw-absolute tw-w-full tw-h-full tw-bg-gray-50 tw-rounded-full tw-opacity-30 tw-animate-ping"></span>
                <span className="tw-absolute tw-w-[70%] tw-h-[70%] tw-bg-gray-100 tw-rounded-full tw-opacity-70 tw-animate-ping"></span>
                <PlayArrow
                  fontSize="large"
                  className="tw-text-[#7BBCB0] tw-bg-[#fff] tw-p-3 tw-rounded-full tw-size-7 tw-z-10"
                />
              </CommonStyles.Box>
              <CommonStyles.Typography className="" sx={{ fontFamily: "sans-serif" }} type="size20Weight600">Watch Video</CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
      {/* End banner */}

      <CommonStyles.Box className="tw-flex tw-justify-center">
        <form onSubmit={handleSubmit(onSubmit)}
          style={{ boxShadow: "0px 10px 30px 0px #7BBCB080" }}
          className="tw-relative -tw-translate-y-1/2 tw-flex tw-w-[1000px] tw-h-[90px] tw-bg-[#FFFFFF] tw-rounded-[10px]">
          <CommonStyles.Box className="tw-p-[20px] tw-grid tw-grid-cols-9 tw-items-center tw-w-full">
            <CommonStyles.Box className="tw-flex tw-col-span-3">
              <LocationOn className="tw-text-[#7BBCB0]" />
              <div className="tw-ml-[10px]">
                <CommonStyles.Typography type="size14Weight500" className="tw-text-[#7BBCB0]" >Location</CommonStyles.Typography>
                <RHFField
                  sx={{
                    fieldset: {
                      border: "none", // Loại bỏ viền
                    },
                    input: {
                      lineHeight: '25px',
                      fontSize: '14px',
                      padding: 0
                    }
                  }}
                  name="location"
                  placeholder="Search For A Destination"
                  control={control}
                  component={InputField}
                />
              </div>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-col-span-2 before:tw-h-1">
              <Divider orientation="vertical" variant="middle" className="tw-h-5 tw-items-center tw-mr-2" flexItem />
              <PeopleOutlinedIcon className="tw-text-[#7BBCB0]" />
              <div className="tw-ml-[10px]">
                <CommonStyles.Typography type="size14Weight500" className="tw-text-[#7BBCB0]">Guests</CommonStyles.Typography>
                <RHFField
                  sx={{
                    fieldset: {
                      border: "none", // Loại bỏ viền
                    },
                    input: {
                      lineHeight: '25px',
                      fontSize: '14px',
                      padding: 0
                    },
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                      WebkitAppearance: "none", // Loại bỏ spinner cho Chrome, Edge, Safari
                    },
                  }}
                  type="number"
                  name="guests"
                  placeholder="How many Guests?"
                  control={control}
                  component={InputField}
                />
              </div>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-col-span-2">
              <Divider orientation="vertical" variant="middle" className="tw-h-5 tw-items-center tw-mr-2" flexItem />
              <CalendarMonthOutlinedIcon className="tw-text-[#7BBCB0]" />
              <div className="tw-ml-[10px]">
                <CommonStyles.Typography type="size14Weight500" className="tw-text-[#7BBCB0]">Date</CommonStyles.Typography>
                <RHFField
                  sx={{
                    fieldset: {
                      border: "none",
                    },
                    input: {
                      fontSize: "14px",
                      padding: 0
                    }
                  }}
                  isMobileDate
                  name="date"
                  control={control}
                  className="tw-bg-transparent tw-h"
                  component={CommonDatePicker}
                />
              </div>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-justify-end tw-col-span-2">
              <CommonButton label="Search" className="outlined tw-w-[150px]" type="submit" variant="outlined" />
            </CommonStyles.Box>
          </CommonStyles.Box>
        </form>
      </CommonStyles.Box>


      {/* Start Explore city */}
      <CommonStyles.Box>
        <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center tw-mt-7">
          <CommonStyles.Typography type="size48Weight700" sx={{ fontFamily: "serif" }} className="" >Explore Popular Cities</CommonStyles.Typography>
          <CommonStyles.Typography
            className="tw-text-center tw-w-[569px] tw-mt-[22px] tw-leading-[25px]"
            type="size16Weight600"
            sx={{ fontFamily: "inherit" }}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit
          </CommonStyles.Typography>
        </CommonStyles.Box>
      </CommonStyles.Box>

      <CommonStyles.Box className="tw-flex tw-w-full tw-justify-center tw-gap-3">
        {listCity.map((city, index) => {
          return (
            <CommonStyles.CommonButton variant="outlined" className={`tw-w-32 rounded tw-mt-10 ${city === "Alaska" && "active"}`} label={city} key={index} />
          )
        })}
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-flex tw-w-full tw-justify-center">
        <CommonStyles.Box className="tw-w-[1170px] tw-mt-8">
          <PopularCity imageBanner={popularCity.imageBanner} name={popularCity.name} title={popularCity.title} listService={popularCity.listService} />
        </CommonStyles.Box>
      </CommonStyles.Box>


      {/* // Trending now */}
      <CommonStyles.Box>
        <TrendingCity
          trendingCity={trendingCity} />
      </CommonStyles.Box>
    </CommonStyles.Box>
  )
}