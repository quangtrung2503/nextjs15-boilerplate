"use client";

import React, { ReactNode } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { SelectOption } from "@/interfaces/common";

interface SelectFieldProps {
  label?: string;
  name?: string;
  value?: string | number;
  options?: SelectOption[];
  onChange?: (event: SelectChangeEvent<string | number>, child: ReactNode) => void;
  error?: boolean;
  helperText?: string;
  classNameContainer?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options = [],
  onChange,
  error = false,
  helperText = "",
  classNameContainer="",
  fullWidth = true,
  variant,
  ...props
}) => {
  return (
    <FormControl
      className={ classNameContainer}
      fullWidth={fullWidth}
      variant={variant}
      sx={{
        borderWidth: '1px !important',
        borderRadius: "0.25rem"
      }}
      error={error}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        // MenuProps={{
        //   disableScrollLock: true, // Prevent scroll locking when menu is open
        // }}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((option, index) => (
          <MenuItem className="rounded" key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
