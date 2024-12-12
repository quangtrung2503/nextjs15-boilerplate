import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Control, Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import InputAdornment from '@mui/material/InputAdornment';

type InputFieldProps = {
  name: string;
  control: Control<any>;
  regex?: RegExp;
  icon?: React.ReactNode; // Change to ReactNode for flexibility
};

const InputField: React.FC<InputFieldProps & TextFieldProps> = ({
  name,
  control,
  placeholder,
  label,
  type,
  className,
  regex,
  icon,
  ...rest
}) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const { onChange, value } = field;
        const { errors } = formState;
        const hasError = !!errors[name]?.message; // Kiểm tra có lỗi

        const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          if (regex && !regex.test(value)) {
            return;
          }
          onChange(event);
        };

        return (
          <div className='tw-mb-5'>
            {label && (
              <InputLabel className='tw-font-mulish tw-font-bold tw-text-base tw-text-[#1C2B38]' shrink>
                {label}
              </InputLabel>
            )}
            <TextField
              {...field}
              {...rest}
              className={twMerge(
                "tw-rounded-md tw-relative tw-bg-gray-200 tw-border tw-text-sm tw-w-full",
                hasError ? 'tw-border-red-500' : 'tw-border-gray-300', // Đặt viền màu đỏ nếu có lỗi
                className
              )}
              type={type}
              value={value || ''}
              onChange={onChangeHandler}
              slotProps={{
                input: {
                  endAdornment: icon ? (
                    <InputAdornment position="end">
                      {icon}
                    </InputAdornment>
                  ) : null,
                }
              }}
            />
            {hasError && (
              <p className='tw-font-mulish tw-text-sm tw-text-red-600'>{errors[name]?.message as string}</p>
            )}
          </div>
        )
      }}
    />
  );
};

export default InputField;