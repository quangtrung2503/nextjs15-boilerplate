"use client";
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { SelectOption } from "@/interfaces/common";
import { twMerge } from "tailwind-merge";
import { FieldError } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";

interface SelectFieldProps {
  label?: string;
  sx?: SxProps;
  size?: "small" | "medium";
  options?: SelectOption[];
  placeholder?: string;
  classNameLabel?: string;
  classNameContainer?: string;
  className?: string;
  variant?: "outlined" | "filled" | "standard";
  required?: boolean;
  onChange?: (event: SelectChangeEvent) => void;
  field: {
    value: string | number | undefined;
    onChange: (event: SelectChangeEvent) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  sx,
  size = "medium",
  options = [],
  placeholder,
  classNameLabel,
  classNameContainer,
  className,
  variant = "outlined",
  required = false,
  onChange,
  field,
  fieldState,
}) => {
  return (
    <CommonStyles.Box className={twMerge("tw-w-full", classNameContainer)}>
      {label && (
        <InputLabel
          className={twMerge(
            required && "required",
            classNameLabel,
            "tw-text-xl tw-font-mulish tw-font-bold tw-text-accent_gray_800"
          )}
          shrink
        >
          {label}
        </InputLabel>
      )}
      <FormControl
        size={size}
        fullWidth
        error={!!fieldState?.error}
        sx={sx}
        variant={variant}
      >
        <Select
          {...field}
          value={field.value?.toString() || ""}
          onBlur={field.onBlur}
          displayEmpty
          onChange={onChange}
          MenuProps={{ disableScrollLock: true }}
          className={className}
        >
          {placeholder && (
            <MenuItem disabled value="">
              <CommonStyles.Typography className="tw-text-accent_gray_500">
                {placeholder}
              </CommonStyles.Typography>
            </MenuItem>
          )}
          {options.map((option, index) => (
            <MenuItem
              key={index}
              value={option.value}
              className={twMerge("tw-flex tw-items-center")}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {fieldState?.error?.message && (
          <FormHelperText>{fieldState.error.message}</FormHelperText>
        )}
      </FormControl>
    </CommonStyles.Box>
  );
};

export default SelectField;
