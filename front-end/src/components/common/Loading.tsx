"use client";
import React from "react";
import { CircularProgress, CircularProgressProps } from "@mui/material";
import { twMerge } from "tailwind-merge";

const Loading: React.FC<CircularProgressProps> = (props) => {
  const { color = "primary", ...rest } = props;

  // Lớp CSS mặc định cho overlay
  const overlayClassName = twMerge(`
    tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full 
    tw-bg-[var(--background)] tw-flex tw-items-center tw-justify-center 
    tw-z-[9999]
  `);

  return (
    <div className={overlayClassName} >
      <CircularProgress {...rest} color={color}/>
    </div>
  );
};

export default Loading;
