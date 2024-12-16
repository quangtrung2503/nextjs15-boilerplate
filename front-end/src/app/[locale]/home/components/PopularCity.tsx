import { FC } from "react";
import { default as CommonStyles } from "@/components/common";
import CommonTag, { CommonTagProps } from "./TagService";

export interface PopularCityProps {
  imageBanner: string;
  name: string;
  title: string;
  listService?: CommonTagProps[];
}

const PopularCity: FC<PopularCityProps> = (props) => {
  const { imageBanner, name, title, listService } = props;
  return (
    <CommonStyles.Box className="tw-w-full tw-h-fit">
      {/* Banner */}
      <CommonStyles.Box
        className="tw-w-full tw-h-[500px] tw-bg-cover tw-bg-center"
        sx={{
          backgroundImage: `url(${imageBanner})`,
        }}
      />
      {/* Main Content */}
      <CommonStyles.Box className="tw-relative tw-flex tw-justify-center tw-h-fit -tw-mt-24">
        <CommonStyles.Box
          sx={{ boxShadow: "0px 4px 20px 0px #0000001F" }}
          className="tw-w-[95%] tw-py-10 tw-z-10 tw-bg-[#F9FDFF] tw-rounded-[3px] tw-flex tw-justify-between tw-items-center"
        >
          <CommonStyles.Box className="tw-px-[50px] tw-grid tw-grid-cols-12 tw-gap-x-20 tw-w-full">
            {/* City Name and Title */}
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography
                className="tw-text-accent_gray_dark"
                type="size64Weight700"
              >
                {name}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                className="tw-text-accent_gray_500"
                type="size16Weight500"
              >
                {title}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            {/* Services */}
            <CommonStyles.Box className="tw-flex tw-flex-wrap tw-gap-3 tw-col-span-6">
              {listService?.map((service, index) => (
                <CommonTag
                  title={service.title}
                  key={index}
                  color={service.color}
                  icon={service.icon}
                />
              ))}
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default PopularCity;
