import React from "react";
import CommonStyle from "@/components/common";

interface Props {
  title: string;
  content: string;
  items?: string[];
}

const DescriptionCityTour: React.FC<Props> = ({
  title,
  content,
  items = [],
}) => {
  const columnCount = items.length;

  return (
    <CommonStyle.Box>
      <CommonStyle.Box className="tw-flex tw-flex-col tw-gap-y-3 tw-py-5">
        <CommonStyle.Typography type="size23Weight600">
          {title}
        </CommonStyle.Typography>
        <CommonStyle.Box>
          {items.length > 0 && (
            <CommonStyle.Box
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                gap: "16px",
              }}
            >
              {items.map((item, index) => (
                <CommonStyle.HtmlContent key={index} htmlString={item} />
              ))}
            </CommonStyle.Box>
          )}

          {content && content !== "" && (
            <CommonStyle.HtmlContent htmlString={content} />
          )}
        </CommonStyle.Box>
      </CommonStyle.Box>
      <CommonStyle.Divider />
    </CommonStyle.Box>
  );
};

export default DescriptionCityTour;
