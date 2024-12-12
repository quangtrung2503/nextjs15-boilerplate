import { FC, ReactNode } from "react";
import { default as CommonStyles } from "@/components/common";

export interface CommonTagProps {
  title: string;
  icon?: string | ReactNode;
  color?: string;
}

const CommonTag: FC<CommonTagProps> = (props) => {
  const { title, icon, color } = props;
  return (
    <CommonStyles.Box boxShadow="0px 4px 10px 0px #00000014" sx={{color: `${color}`}} className={`tw-px-[32px] tw-py-[5px]`}>
      <CommonStyles.Box className="tw-flex tw-items-center">
        {icon}
        <CommonStyles.Typography type="size14Weight700" className={`tw-ml-2 tw-text-[${color}]`}>{title}</CommonStyles.Typography>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default CommonTag;
