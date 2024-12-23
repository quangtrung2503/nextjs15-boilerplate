import React, { useState } from "react";
import { default as CommonStyles } from "@/components/common";

interface SliderProps {
  imgs: { src: string }[];
}
const Slider: React.FC<SliderProps> = ({ imgs }) => {
  const [indexActive, setIndexActive] = useState(0);
  const renderImage = () => {
    return imgs.map((item, index) => (
      <CommonStyles.Box
        key={index}
        onClick={() => setIndexActive(index)}
        className={`tw-w-[120px] tw-cursor-pointer tw-h-[100px] tw-box-border tw-select-none ${
          indexActive === index
            ? "tw-border-[4px] tw-border-solid tw-border-primary"
            : ""
        }`}
      >
        <img
          src={item.src}
          alt={`Thumbnail ${index + 1}`}
          className="tw-size-full"
        />
      </CommonStyles.Box>
    ));
  };
  return (
    <CommonStyles.Box className="tw-w-full">
      <img
        src={imgs[indexActive].src}
        alt={`Image ${indexActive + 1}`}
        className="tw-w-full tw-max-h-[460px]"
      />
      <CommonStyles.Box className="tw-overflow-x-auto tw-overflow-y-hidden scrollbar-hide tw-h-fit tw-mt-2">
        <CommonStyles.Box className="tw-flex tw-gap-3 tw-w-fit tw-h-fit">
          {renderImage()}
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Slider;
