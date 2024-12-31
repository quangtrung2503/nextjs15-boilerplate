import React, { ReactNode, useRef } from "react";
import { SxProps, InputLabel, TextField } from "@mui/material";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "../CommonIcons";

interface CustomInputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  label?: string;
  sx?: SxProps;
  type?: string;
  classNameLabel?: string;
  className?: string;
  placeholder?: string;
  rightIcon?: ReactNode;
  classNameContainer?: string;
  icon?: any;
  startIcon?: any;
  regex?: RegExp;
}

const InputFieldColor: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  label,
  classNameLabel,
  classNameContainer,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CommonStyles.Box className={classNameContainer}>
      {/* Label */}
      {label && (
        <InputLabel
          className={twMerge(
            classNameLabel,
            "tw-text-xl tw-font-mulish tw-font-bold tw-text-accent_gray_800"
          )}
          shrink
        >
          {label}
        </InputLabel>
      )}

      {/* Hidden Color Picker */}
      <input
        type="color"
        {...field}
        ref={inputRef}
        className="tw-absolute tw-opacity-0 tw-pointer-events-none tw-mt-4"
      />

      {/* Custom Box for Display */}
      <CommonStyles.Box
        onClick={() => inputRef.current?.click()}
        className="tw-bg-gray-100 tw-cursor-pointer tw-w-16 tw-flex tw-justify-center tw-items-center tw-h-10 tw-relative tw-rounded-md"
      >
        {/* Color Preview */}
        <CommonStyles.Box
          style={{ backgroundColor: field.value || "#ffffff" }}
          className="tw-size-6 tw-ml-2 tw-rounded-full"
        />

        {/* Optional Icon */}
        <CommonIcons.ArrowDropUp className="tw-text-gray-400" />
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default InputFieldColor;
