import React from "react";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SxProps } from "@mui/material";
import { FieldError } from "react-hook-form";

interface IDatePickerProps {
  label?: string;
  name: string;
  className?: string;
  required?: boolean;
  classNameLabel?: string;
  sx?: SxProps;
  isMobileDate?: boolean;
  placeholder?: string;
  border?: boolean;
  field: {
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
    onBlur: () => void;
    name: string;
  };
  fieldState: { error?: FieldError };
}

export const CommonDatePicker: React.FC<IDatePickerProps> = ({
  required,
  classNameLabel,
  label,
  className,
  sx,
  isMobileDate,
  placeholder = "Pick a date",
  field,
  fieldState,
  border
}) => {
  const PickerComponent = isMobileDate ? MobileDatePicker : DatePicker;

  return (
    <div className="flex flex-col">
      {label && (
        <label
          className={twMerge(
            required && "required",
            classNameLabel,
            "tw-font-mulish tw-font-bold tw-text-accent_gray_800"
          )}
        >
          {label}
        </label>
      )}
      <PickerComponent
        {...field}
        value={field.value || null} // Ensure value is never undefined
        slots={{ openPickerIcon: CalendarMonthIcon }}
        slotProps={{
          textField: {
            hiddenLabel: true,
            inputProps: {
              placeholder,
            },
            sx: {
              input: {
                padding: 0,
                fontSize: "14px",
                color: "#495560",
                height: "54px",
                paddingLeft: "20px",
                
              },
              div: {
                button: {
                  padding: "6px",
                  marginRight: 0,
                },
                ":hover":{
                  ".css-u6ogs3-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":{
                    border: fieldState.error ? "#d32f2f solid 1px": "none",
                  }
                }
              },
              fieldset: {
                padding: 0,
                border: fieldState.error ? "#d32f2f solid 1px": border ? "#cfcfcf solid 1px":"none",
              },
              borderRadius: "3px",
              backgroundColor: "#F4F4F5",
              ...sx,
            },
          },
        }}
        className={twMerge("tw-rounded-none", className)}
      />
      {fieldState.error && (
        <span className="tw-text-[#d32f2f] tw-text-xs tw-ml-3">
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
};
