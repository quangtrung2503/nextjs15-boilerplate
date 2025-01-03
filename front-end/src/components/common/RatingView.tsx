"use client"
import React, { memo } from "react";
import Rating from "@mui/material/Rating";
import { default as CommonStyles } from ".";
import { SxProps } from "@mui/material";
import CommonIcons from "../CommonIcons";
import { twMerge } from "tailwind-merge";

interface Props {
  value?: number;
  readOnly?: boolean;
  disabled?: boolean;
  haveFeedback?: boolean;
  sxRating?: SxProps;
  classNameIcon?: string;
}

const RatingView = (props: Props) => {
  //! State
  const {
    value = 0,
    readOnly = true,
    disabled = true,
    haveFeedback = false,
    sxRating,
    classNameIcon,
  } = props;

  //! Function
  const getLabelText = (value: number) => {
    return `${value} Star${value !== 1 ? "s" : ""}, ${value}`;
  };

  //! Render
  return (
    <CommonStyles.Box sx={{ display: "flex" }}>
      <Rating
        value={value}
        size="small"
        icon={
          <CommonIcons.Star
            fontSize="inherit"
            className={twMerge(classNameIcon, "tw-text-[#FFA432]")}
          />
        }

        readOnly={readOnly}
        disabled={disabled}
        getLabelText={getLabelText}
        precision={0.1}
        sx={{ ...sxRating }}
      />

      {haveFeedback && (
        <CommonStyles.Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
          {value?.toFixed(1)}
        </CommonStyles.Box>
      )}
    </CommonStyles.Box>
  );
};

export default memo(RatingView);
