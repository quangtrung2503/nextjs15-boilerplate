"use client";
import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  SxProps,
  Box,
  Chip,
} from "@mui/material";
import { SelectOption } from "@/interfaces/common";
import { twMerge } from "tailwind-merge";
import { FieldError } from "react-hook-form";
interface SelectFieldProps {
  label?: string;
  name?: string;
  sx?: SxProps;
  size?: "small" | "medium";
  value?: string | number | (string | number)[]; // Support single or multiple values
  options?: SelectOption[];
  classNameLabel?: string;
  error?: boolean;
  placeholder?: string;
  helperText?: string;
  classNameContainer?: string;
  className?: string;
  fullWidth?: boolean;
  defaultValue?: string | number | (string | number)[] | undefined;
  variant?: "outlined" | "filled" | "standard";
  onChange?: (event: SelectChangeEvent<string | string[]>) => void;
  field: {
    value: string | number | (string | number)[] | undefined;
    onChange: (event: SelectChangeEvent<string | string[]>) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  required?: boolean;
  multiple?: boolean; // Enable multiple selection
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
  multiple = false,
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    // Update field value for React Hook Form
    field.onChange(event);
    // Trigger custom onChange if provided
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <FormControl
      size={size}
      className={twMerge(classNameContainer)}
      fullWidth={fullWidth}
      variant={variant}
      error={error || !!fieldState.error}
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
        multiple={multiple}
        value={
          multiple
            ? Array.isArray(field.value)
              ? field.value.map((v) => String(v)) // Chuyển tất cả các giá trị thành string
              : []
            : String(field.value || "")
        }
        onChange={handleChange}
        onBlur={field.onBlur}
        sx={sx}
        name={name}
        MenuProps={{
          disableScrollLock: true,
        }}
      // renderValue={(selected) =>
      //   multiple && Array.isArray(selected) ? (
      //     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      //       {selected.map((value) => (
      //         <Chip key={value} label={options.find((opt) => opt.value === value)?.label || value} />
      //       ))}
      //     </Box>
      //   ) : (
      //     selected?.label
      //   )
      // }
      >
        {placeholder && !multiple && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} className={twMerge(className)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(helperText || fieldState.error?.message) && (
        <FormHelperText className="tw-text-red-500">
          {helperText || fieldState.error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};
export default SelectField;