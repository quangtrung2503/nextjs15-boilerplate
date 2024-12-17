"use client";
import React from "react";
import { Checkbox, FormControlLabel, SxProps } from "@mui/material";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { default as CommonStyles } from "@/components/common";

interface CheckboxFieldProps {
  field: {
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  label?: string;
  sx?: SxProps;
  classNameLabel?: string;
  classNameContainer?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  fieldState,
  label,
  sx,
  classNameLabel,
  classNameContainer,
}) => {
  return (
    <CommonStyles.Box className={twMerge("tw-w-full", classNameContainer)}>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            checked={field.value || false} // Ensure boolean value
            sx={sx}
          />
        }
        label={label}
        className={twMerge(classNameLabel, "tw-text-accent_gray_800")}
      />
      {fieldState.error && (
        <CommonStyles.Typography
          type="size12Weight400"
          className="tw-text-red-500"
        >
          {fieldState.error.message}
        </CommonStyles.Typography>
      )}
    </CommonStyles.Box>
  );
};

export default CheckboxField;
