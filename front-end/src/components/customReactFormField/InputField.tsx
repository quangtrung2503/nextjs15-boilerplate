"use client";
import React from "react";
import { TextField } from "@mui/material";
import { FieldError } from "react-hook-form";

interface CustomInputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError }; // Cập nhật kiểu ở đây
  label: string;
  placeholder?: string;
}

const InputField: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  label,
  placeholder,
}) => {
  return (
    <TextField
      {...field}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message || ""}
    />
  );
};

export default InputField;
