import React from "react";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { twMerge } from "tailwind-merge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { SxProps } from "@mui/material";
import { FieldError } from "react-hook-form";
import moment, { Moment } from "moment";

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
    value: Moment | null;
    onChange: (date: Moment | null) => void;
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
    <div className="tw-flex tw-flex-col">
      {label && (
        <label
          className={twMerge(
            required && "required",
            classNameLabel,
            "tw-font-mulish tw-text-[15px] tw-mb-2 tw-font-bold tw-text-accent_gray_800"
          )}
        >
          {label}
        </label>
      )}
      <PickerComponent
      format="DD/MM/YYYY"
        value={field.value ? moment(field.value) : null} // Đảm bảo giá trị không undefined
        onChange={(newValue) => {
          field.onChange(newValue); // Cập nhật giá trị
        }}
        slots={{ openPickerIcon: CalendarMonthIcon }}
        slotProps={{
          textField: {
            hiddenLabel: true,
            inputProps: {
              placeholder,
            },
            sx: {
              fieldset: {
                padding: 0,
                border: fieldState.error
                  ? "#d32f2f solid 1px"
                  : border
                  ? "#cfcfcf solid 1px"
                  : "none",
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
