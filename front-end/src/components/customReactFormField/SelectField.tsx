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
  onChange?: (
    event: SelectChangeEvent<string | number>,
    child: ReactNode
  ) => void;
  error?: boolean;
  placeholder?:string;
  helperText?: string;
  classNameContainer?: string;
  className?: string;
  fullWidth?: boolean;
  defaultValue?: string | number | undefined;
  variant?: "outlined" | "filled" | "standard";
  field: {
      value: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur: () => void;
    };
    fieldState: { error?: FieldError }; // Cập nhật kiểu ở đâ
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  defaultValue,
  size,
  value,
  options = [],
  classNameLabel,
  onChange,
  className,
  sx,
  error = false,
  helperText = "",
  classNameContainer = "",
  fullWidth = true,
  variant,
  field,
  placeholder,
  fieldState,
  ...props
}) => {
  return (
    <FormControl
      size={size}
      className={classNameContainer}
      fullWidth={fullWidth}
      variant={variant}
      error={error}
    >
      {label && <InputLabel className={classNameLabel}>{label}</InputLabel>}
      <Select
        defaultValue={defaultValue}
        sx={sx}
        MenuProps={{
          disableScrollLock: true, // Prevent scroll locking when menu is open
        }}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        className="tw-text-[#ffffff86]"
        {...props}
      >
        {placeholder && <MenuItem disabled value="">
            <em>Placeholder</em>
          </MenuItem>}
        {options.map((option, index) => (
          <MenuItem
            className={twMerge("rounded tw-flex tw-items-center", className)}
            key={index}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
