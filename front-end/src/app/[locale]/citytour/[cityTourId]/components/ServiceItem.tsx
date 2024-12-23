import React from "react";
import { default as CommonStyles } from "@/components/common";

export interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <CommonStyles.Box className="tw-flex tw-items-start tw-gap-2 tw-col-span-6">
      <CommonStyles.Box className="tw-text-primary tw-mt-[2px]">
        {icon}
      </CommonStyles.Box>
      <CommonStyles.Box>
        <CommonStyles.Typography
          type="size15Weight600"
          className="tw-text-accent_gray_dark"
        >
          {title}
        </CommonStyles.Typography>
        <CommonStyles.Typography
          type="size14Weight400"
          className="tw-text-accent_gray_800"
        >
          {description}
        </CommonStyles.Typography>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default ServiceItem;
