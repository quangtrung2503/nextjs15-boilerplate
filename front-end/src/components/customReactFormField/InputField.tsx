"use client";
import React from "react";
import { InputProps, SxProps, TextField } from "@mui/material";
import { FieldError } from "react-hook-form";

interface CustomInputProps extends InputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError }; // Cập nhật kiểu ở đây
  label: string;
  sx?: SxProps;
  type?: string;
  className?: string;
  placeholder?: string;
}

const InputField: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  label,
  sx,
  type,
  className,
  placeholder,
}) => {
  return (
    <TextField
      {...field}
      label={label}
      type={type}
      className={className}
      placeholder={placeholder}
      variant="outlined"
      sx={sx}
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message || ""}
    />
  );
};

export default InputField;
