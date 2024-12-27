import { FC } from "react";
import { default as CommonStyles } from "@/components/common";
import { Container } from "@mui/material";
import CommonIcons from "@/components/CommonIcons";
import { CommonButton } from "@/components/common/Button";
import { commonImg } from "@/assets";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("homePage.introduceMobileApp")
  return (
    <CommonStyles.Box
      sx={{ backgroundImage: `url(${commonImg.introduceApp.src})` }}
      className="tw-w-full tw-relative tw-z-50 tw-h-[720px] tw-bg-no-repeat tw-bg-center tw-bg-cover"
    >
      {/* Overlay */}
      <CommonStyles.Box className="tw-absolute tw-z-10 tw-size-full tw-backdrop-blur-sm tw-bg-gradient-to-r tw-from-[#48057D80] tw-to-[#2ADDE780]" />

      <Container className="tw-h-full tw-relative tw-grid tw-grid-cols-12 tw-items-center">
        <CommonStyles.Box className="tw-col-span-6 tw-flex tw-items-center">
          <CommonStyles.Box className="tw-absolute tw-z-40">
            <img
              src={commonImg.mobileApp1.src}
              className="tw-absolute tw-z-30 -tw-translate-y-5"
              alt=""
            />
            <img
              src={commonImg.mobileApp2.src}
              className="tw-translate-y-10 tw-translate-x-20"
              alt=""
            />
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-col-span-6 tw-w-[530px] tw-relative tw-z-40  tw-flex tw-flex-col tw-gap-y-5 tw-text-white">
          <CommonStyles.Box>
            <CommonStyles.Typography type="size36Weight800">
              {t("title")}
            </CommonStyles.Typography>
            <CommonStyles.Typography type="size16Weight800">
              {t("available")}
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Typography type="size16Weight500">
            {t("content")}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-justify-between">
            <CommonButton
              className="tw-rounded-full tw-px-8 tw-py-8 tw-shadow-sm tw-shadow-secondary"
              startIcon={<CommonIcons.Ios />}
            >
              <CommonStyles.Typography type="size16Weight800">
                {t("iosBtn")}
              </CommonStyles.Typography>
            </CommonButton>
            <CommonButton
              className="tw-rounded-full tw-px-8 tw-py-8 tw-shadow-sm tw-shadow-secondary"
              startIcon={<CommonIcons.Android />}
            >
              <CommonStyles.Typography type="size16Weight800">
                {t("androidBtn")}
              </CommonStyles.Typography>
            </CommonButton>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container>
    </CommonStyles.Box>
  );
};

export default IntroduceMobileApp;
