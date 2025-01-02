"use client";
import React, { Fragment, ReactNode } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  InputProps,
  SxProps,
  TextField,
} from "@mui/material";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { default as CommonStyles } from "@/components/common";
import { Visibility, VisibilityOff } from "@mui/icons-material";
interface CustomInputProps extends InputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  multiline?: boolean;
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
  regex,
  icon,
  startIcon,
  multiline
}) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    if (!regex || regex.test(inputValue)) {
      field.onChange?.(event);
    }
  };

  return (
    <CommonStyles.Box className={twMerge("tw-w-full", classNameContainer)}>
      {/* <FormControl> */}

      {label && (
        <InputLabel
          className={twMerge(
            classNameLabel,
            "tw-text-xl tw-font-mulish tw-font-bold tw-text-accent_gray_800",
          )}
          shrink
        >
          {label}
        </InputLabel>
      )}
      <TextField
        multiline={multiline}
        // label={label}
        type={showPassword ? "text" : type}
        {...field}
        className={className}
        onChange={onChangeHandler}
        placeholder={placeholder}
        variant="outlined"
        sx={{
          ...sx,
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px white inset",  
            WebkitTextFillColor: "#000", 
            transition: "background-color 5000s ease-in-out 0s",
          },
          "& input": {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px white inset",
              WebkitTextFillColor: "#000",
              borderRadius: "4px",
            },
          },
        }}
        fullWidth
        disabled={type === "email"}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
            endAdornment:
              type === "password" ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  {icon}
                </InputAdornment>
              ) : icon ? (
                <InputAdornment position="end">{icon}</InputAdornment>
              ) : null,
          },
        }}
        error={!!fieldState.error}
        helperText={fieldState.error?.message || ""}
      />
       {/* {fieldState.error && (
        <span className="tw-text-[#D32F2F] tw-font-mulish tw-text-sm">
          {fieldState.error.message}
        </span>
      )} */}
      {/* </FormControl> */}
    </CommonStyles.Box>
  );
};
export default InputField;