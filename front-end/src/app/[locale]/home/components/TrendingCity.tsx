import { FC } from "react";
import { default as CommonStyles } from "@/components/common";
import { Container } from "@mui/material";
import CommonIcons from "@/components/CommonIcons";
import { CommonButton } from "@/components/common/Button";
import { commonImg } from "@/assets";
import { useTranslations } from "next-intl";

export interface TrendingCityProps {
  imageBanner?: string;
  image?: string;
  title?: string;
  place?: string;
  rate?: number;
  reviews?: number;
  content?: string;
}

const TrendingCity: FC<TrendingCityProps> = (props) => {
  // props
  const {
    imageBanner,
    image,
    place,
    title,
    rate = 0,
    reviews,
    content,
  } = props;
  const t = useTranslations("homePage");
  // Render
  return (
    <CommonStyles.Box
      sx={{ backgroundImage: `url(${imageBanner})` }}
      className="tw-w-full tw-relative tw-z-20 tw-h-[590px] tw-bg-no-repeat tw-bg-center tw-bg-cover"
    >
      {/* Overlay */}
      <CommonStyles.Box className="tw-absolute tw-z-10 tw-size-full tw-backdrop-blur-sm tw-bg-gradient-to-r tw-from-[#48057D80] tw-to-[#2ADDE780]" />

      <Container className="tw-h-full tw-relative tw-z-30 tw-grid tw-grid-cols-12 tw-items-center">
        <CommonStyles.Box className="tw-col-span-6">
          <CommonStyles.Box className="tw-relative">
            <CommonStyles.Box
              className="tw-absolute -tw-rotate-[21.42deg]"
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: "#FFF1B5",
                maskImage: `url(${commonImg.mask.src})`,
                WebkitMaskImage: `url(${commonImg.mask.src})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
            <CommonStyles.Box
              className="tw-absolute tw-rotate-[20deg]"
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: "#D0FFF6",
                maskImage: `url(${commonImg.mask.src})`,
                WebkitMaskImage: `url(${commonImg.mask.src})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
            <CommonStyles.Box
              style={{
                width: "300px",
                height: "300px",
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                maskImage: `url(${commonImg.mask.src})`,
                WebkitMaskImage: `url(${commonImg.mask.src})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
                maskRepeat: "no-repeat",
                maskPosition: "right",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          </CommonStyles.Box>
        </CommonStyles.Box>

        {/* Right content */}
        <CommonStyles.Box className="tw-col-span-6 tw-flex tw-flex-col tw-gap-y-10">
          {/* Heading Section */}
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-4">
            <CommonStyles.Typography type="size12Weight800" className="tw-bg-primary_light tw-py-1 tw-px-5 tw-rounded-full tw-size-fit">
              {t("trendingNow")}
            </CommonStyles.Typography>

            <CommonStyles.Box>
              <CommonStyles.Typography
                className="tw-text-white tw-line-clamp-3 tw-overflow-hidden tw-whitespace-normal tw-text-ellipsis"
                type="size36Weight700"
              >
                {title}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3 tw-text-white">
                <CommonStyles.Typography type="size14Weight600" className="tw-flex tw-items-center">
                  <CommonIcons.LocationOn className="tw-w-4" />
                  {place}
                </CommonStyles.Typography>
                <CommonStyles.Divider
                  orientation="vertical"
                  flexItem
                  variant="middle"
                  className="tw-bg-white tw-h-[14px] "
                />
                <CommonStyles.Box className="tw-flex tw-items-center">
                  <CommonStyles.RatingView
                    readOnly
                    value={rate}
                  />
                  <CommonStyles.Typography
                    className="tw-ml-[2px]"
                  // color="white"
                  >
                    {rate} ({reviews} {t("reviews")})
                  </CommonStyles.Typography>
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>

            <CommonStyles.Typography type="size14Weight600" className="tw-text-white tw-line-clamp-3 tw-overflow-hidden tw-whitespace-normal tw-text-ellipsis tw-w-[505px]">
              {content}
            </CommonStyles.Typography>
          </CommonStyles.Box>

          {/* Action Buttons */}
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
            <CommonButton className="tw-rounded-full tw-px-10">
              <CommonStyles.Typography type="size16Weight800">
                {t("bookNowBtn")}
              </CommonStyles.Typography>
            </CommonButton>
            <CommonStyles.Divider
              orientation="vertical"
              flexItem
              variant="middle"
              className="tw-bg-white tw-h-4 tw-mt-4"
            />

            {/* Social Actions */}
            <CommonStyles.Box className="tw-flex tw-gap-2">
              {[
                { icon: <CommonIcons.Favorite />, transform: "" },
                {
                  icon: <CommonIcons.Reply />,
                  transform: "tw-transform tw-scale-x-[-1]",
                },
              ].map((action, index) => (
                <CommonStyles.Box
                  key={index}
                  className={`tw-cursor-pointer tw-rounded-full tw-w-[50px] tw-bg-[#ffffff2c] tw-text-white tw-aspect-square tw-flex tw-items-center tw-justify-center ${action.transform}`}
                  sx={{ border: "1px solid #fff" }}
                >
                  {action.icon}
                </CommonStyles.Box>
              ))}
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </Container >
    </CommonStyles.Box >
  );
};

export default TrendingCity;
