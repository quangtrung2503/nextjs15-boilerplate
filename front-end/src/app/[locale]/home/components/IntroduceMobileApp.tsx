import { FC } from "react";
import { default as CommonStyles } from "@/components/common";
import { Container } from "@mui/material";
import CommonIcons from "@/components/CommonIcons";
import { CommonButton } from "@/components/common/Button";
import { introduceApp, mobileApp1, mobileApp2 } from "@/assets";

export interface IntroduceMobileAppProps {
  introduceMobileApp: {
    imageBanner?: string;
    image?: string;
    title: string;
    place: string;
    rate?: number;
    reviews?: number;
    content?: string;
  };
}

const IntroduceMobileApp = () => {
  return (
    <CommonStyles.Box
      sx={{ backgroundImage: `url(${introduceApp.src})` }}
      className="tw-w-full tw-relative tw-z-50 tw-h-[720px] tw-bg-no-repeat tw-bg-center tw-bg-cover"
    >
      {/* Overlay */}
      <CommonStyles.Box className="tw-absolute tw-z-10 tw-size-full tw-backdrop-blur-sm tw-bg-gradient-to-r tw-from-[#48057D80] tw-to-[#2ADDE780]" />

      <Container className="tw-h-full tw-relative tw-grid tw-grid-cols-12 tw-items-center">
        <CommonStyles.Box className="tw-col-span-6 tw-flex tw-items-center">
          <CommonStyles.Box className="tw-absolute tw-z-40">
            <img
              src={mobileApp1.src}
              className="tw-absolute tw-z-30 -tw-translate-y-5"
              alt=""
            />
            <img
              src={mobileApp2.src}
              className="tw-translate-y-10 tw-translate-x-20"
              alt=""
            />
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-col-span-6 tw-relative tw-z-40 tw-p-10 tw-flex tw-flex-col tw-gap-y-5 tw-text-white">
          <CommonStyles.Box>
            <CommonStyles.Typography type="size36Weight700">
              Smart City Tour Mobile App
            </CommonStyles.Typography>
            <CommonStyles.Typography type="size16Weight600">
              Available on IOS & Android
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Typography>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-gap-5">
            <CommonButton
              className="tw-rounded-full tw-px-5 tw-shadow-sm tw-shadow-secondary"
              startIcon={<CommonIcons.Ios />}
            >
              Download For IOS
            </CommonButton>
            <CommonButton
              className="tw-rounded-full tw-px-5 tw-shadow-sm tw-shadow-secondary tw-font-mulish"
              startIcon={<CommonIcons.Android />}
            >
              Download For Android
            </CommonButton>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container>
    </CommonStyles.Box>
  );
};

export default IntroduceMobileApp;
