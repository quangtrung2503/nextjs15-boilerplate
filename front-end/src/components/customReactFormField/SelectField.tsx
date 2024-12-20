"use client";

import React, { ReactNode } from "react";
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

interface SelectFieldProps {
  label?: string;
  name?: string;
  sx?: SxProps;
  size?: "small" | "medium";
  value?: string | number;
  options?: SelectOption[];
  classNameLabel?: string;
  error?: boolean;
  placeholder?: string;
  helperText?: string;
  classNameContainer?: string;
  className?: string;
  fullWidth?: boolean;
  defaultValue?: string | number | undefined;
  variant?: "outlined" | "filled" | "standard";
  onChange?: (event: SelectChangeEvent, child: ReactNode) => void;
  field?: {
    value: string | number | undefined; // Allow undefined to match React's controlled component requirements
    onChange: (event: SelectChangeEvent) => void; // Match MUI's expected event type
    onBlur: () => void;
  };
  fieldState?: { error?: FieldError };
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  defaultValue,
  size = "medium",
  options = [],
  classNameLabel,
  onChange,
  className,
  sx,
  required,
  error = false,
  helperText = "",
  classNameContainer = "",
  fullWidth = true,
  variant = "outlined",
  field,
  placeholder,
  fieldState,
  ...props
}) => {
  return (
    <FormControl
      size={size}
      className={twMerge(classNameContainer)}
      fullWidth={fullWidth}
      variant={variant}
      // error={error || !!fieldState.error}
    >
      {label && (
        <label
          className={twMerge(
            required && "required",
            classNameLabel,
            "tw-font-mulish tw-text-[15px] tw-mb-2 tw-font-bold tw-text-accent_gray_800",
          )}
        >
          {label}
        </label>
      )}
      <Select
        {...field}
        defaultValue={defaultValue}
        // value={value ? String(value) : String(field?.value || "")} // Ensure string type
        value={value}
        onChange={(event, child) => {
          // const newValue = event.target.value; // This will always be a string

          // Call React Hook Form's onChange handler with the string value
          field?.onChange(event as SelectChangeEvent<string>);

          // Call custom onChange handler if provided
          if (onChange) {
            onChange(event as SelectChangeEvent<string>, child);
          }
        }}
        onBlur={field?.onBlur}
        sx={sx}
        name={name}
        MenuProps={{
          disableScrollLock: true,
        }}
        className={className}
        // {...props}
      >
        {placeholder && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
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
      {(helperText || fieldState?.error?.message) && (
        <FormHelperText>
          {helperText || fieldState?.error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
