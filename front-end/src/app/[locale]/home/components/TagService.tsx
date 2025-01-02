import { FC, ReactNode } from "react";
import { default as CommonStyles } from "@/components/common";
import apiUrls from "@/constants/apiUrls";

export interface CommonTagProps {
  name?: string;
  icon?: string;
  color?: string;
}

const CommonTag: FC<CommonTagProps> = (props) => {
  const { name, icon, color } = props;
  return (
    <CommonStyles.Box boxShadow="0px 4px 10px 0px #00000014" sx={{ color: `${color}` }} className="tw-px-6 tw-py-3 tw-size-fit tw-rounded-[3px]">
      <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3">
        <img src={`${apiUrls.IMG_URL}/${icon}`} className="tw-max-w-[40px] tw-rounded-full" />
        <CommonStyles.Typography type="size14Weight700" className={`tw-text-[${color}]`}>{name}</CommonStyles.Typography>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default CommonTag;
