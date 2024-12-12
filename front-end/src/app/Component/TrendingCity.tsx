import { FC } from "react";
import { default as CommonStyles } from "@/components/common";
import CommonTag, { CommonTagProps } from "./TagService";

export interface TrendingCityProps {
  trendingCity: {
    imageBanner?: string;
    image?: string;
    title: string;
    place: string;
    rate?: number;
    reviews: number;
    content: string;
  }
}

const TrendingCity: FC<TrendingCityProps> = (props: TrendingCityProps) => {
  const { imageBanner, place, title, rate, reviews, content } = props.trendingCity;
  return (
    <CommonStyles.Box
      sx={{
        backgroundImage: `url(${imageBanner})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="tw-w-full tw-h-[590px]">
    </CommonStyles.Box>
  );
};

export default TrendingCity;
