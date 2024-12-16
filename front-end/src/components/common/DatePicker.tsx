import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SxProps } from "@mui/material";

interface IDatePickerProps {
  label?: string;
  name: string;
  className?: string;
  onChange?: (value: Dayjs) => void;
  required?: boolean;
  classNameLabel?: string;
  sx?: SxProps;
  isMobileDate?: boolean;
  placeholder?: string;
}

type CommonDatePickerProps = IDatePickerProps;
export const CommonDatePicker = ({
  required,
  classNameLabel,
  label,
  className,
  name,
  onChange,
  placeholder = "Pick a date",
  onBlur,
  sx,
  isMobileDate,
  ...rest
}: CommonDatePickerProps & { onChange?: (date: Dayjs | null) => void; onBlur?: () => void }) => {

  const PickerComponent = isMobileDate ? MobileDatePicker : DatePicker;

  return (
    <div className="flex flex-col">
      {label &&
        <label className={twMerge(required && "required", classNameLabel, "text-[15px] h-[18px] font-[700] mb-[10px]")}>{label}</label>}
      <PickerComponent
        slots={{ openPickerIcon: CalendarMonthIcon }}
        slotProps={{
          textField: {
            hiddenLabel: true,
            inputProps: {
              placeholder
            },
            sx: {
              input: {
                padding: 0,
                fontSize: "14px",
                color: '#495560',
                height: '54px',
                paddingLeft: '20px',
              },
              div: {
                button: {
                  padding: '6px',
                  marginRight: 0,
                }
              },
              fieldset: {
                padding: 0,
                border: "none",
              },
              borderRadius: '3px',
              backgroundColor: '#F4F4F5',
              ...sx
            },
          },
        }}
        name={name}
        className={twMerge("tw-rounded-none", className)}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};
