import React from "react";
import CommonStyle from "@/components/common";
interface Props {
  title: string;
  content: string;
}
const DescriptionCityTour: React.FC<Props> = ({ title, content }) => {
  return (
    <CommonStyle.Box>
      <CommonStyle.Box className="tw-flex tw-flex-col tw-gap-y-3 tw-py-5">
        <CommonStyle.Typography type="size23Weight600">
          {title}
        </CommonStyle.Typography>
        <CommonStyle.Box>
          <CommonStyle.HtmlContent htmlString={content} />
        </CommonStyle.Box>
      </CommonStyle.Box>
      <CommonStyle.Divider />
    </CommonStyle.Box>
  );
};

export default DescriptionCityTour;
