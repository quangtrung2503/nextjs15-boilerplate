import React from "react";
import { default as CommonStyles } from "@/components/common";
type Props = {
  title: string;
  des: string;
};
const Heading = (props: Props) => {
  const { title, des } = props;
  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3">
      <CommonStyles.Typography
        className="tw-text-accent_gray_dark"
        type="size36Weight700"
      >
        {title}
      </CommonStyles.Typography>
      <CommonStyles.Typography
        className="tw-text-accent_gray_800 tw-w-3/5"
        type="size16Weight400"
      >
        {des}
      </CommonStyles.Typography>
    </CommonStyles.Box>
  );
};

export default Heading;
