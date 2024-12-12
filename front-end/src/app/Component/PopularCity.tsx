import { FC, ReactNode } from "react";
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
    <CommonStyles.Box className="tw-w-full">
      <CommonStyles.Box
        className="tw-w-full tw-h-[500px] tw-bg-cover tw-bg-center"
        sx={{
          backgroundImage: `url(${imageBanner})`,
        }}
      ></CommonStyles.Box>
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Box
          sx={{ boxShadow: "0px 4px 20px 0px #0000001F" }}
          className="-tw-translate-y-1/3 tw-w-[1110px] tw-h-[275px] tw-z-10 tw-bg-white tw-rounded-[3px] tw-flex tw-justify-between tw-items-center">
          <CommonStyles.Box className="tw-px-[50px] tw-flex tw-justify-between tw-items-center tw-w-full">
            <CommonStyles.Box className="tw-w-[464px] tw-h-[166px]">
              <CommonStyles.Typography sx={{ fontFamily: "-moz-initial", boxShadow: "0px 5px 13px 0px #FFFFFF66" }}
                className="tw-text-[#1C2B38]" type="size64Weight700">
                {name}
              </CommonStyles.Typography>
              <CommonStyles.Typography className="tw-text-[#778088]" sx={{ fontFamily: "inherit" }} type="size16Weight600">
                {title}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-flex-wrap tw-w-[430px]">
              {listService?.map((service, index) => {
                return (
                  <CommonTag title={service.title} key={index} color={service.color} icon={service.icon} />
                )
              })}
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default PopularCity;
