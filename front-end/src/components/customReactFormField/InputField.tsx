"use client";
import React, { Fragment, ReactNode } from "react";
import { InputLabel, InputProps, SxProps, TextField } from "@mui/material";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {default as CommonStyles} from "@/components/common";

interface CustomInputProps extends InputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldState: { error?: FieldError }; // Cập nhật kiểu ở đây
  label?: string;
  sx?: SxProps;
  type?: string;
  classNameLabel?: string;
  className?: string;
  placeholder?: string;
  rightIcon?: ReactNode;
  classNameContainer?: string;
}

const InputField: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  label,
  sx,
  type,
  className,
  placeholder,
  classNameLabel,
  classNameContainer,
  onChange
}) => {
  return (
    <CommonStyles.Box className={twMerge("tw-w-full",classNameContainer)}>
      {label && (
        <InputLabel className={twMerge(classNameLabel,'tw-text-xl tw-font-mulish tw-font-bold tw-text-accent_gray_800')} shrink>
          {label}
        </InputLabel>
      )}
      <TextField
      // label={label}
        type={type}
        {...field}
        className={className}
        placeholder={placeholder}
        variant="outlined"
        sx={sx}
        fullWidth
        error={!!fieldState.error}
        helperText={fieldState.error?.message || ""}
      />
    </CommonStyles.Box>
  );
};

export default InputField;
