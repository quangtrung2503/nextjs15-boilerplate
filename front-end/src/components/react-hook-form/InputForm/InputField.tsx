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
        const hasError = errors[name]?.message;

        const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
            if (/^\d*$/.test(value) && value.length <= 10) {
            onChange(event);
          }
        };

        return (
          <div className='mb-5'>
            {label && (
              <InputLabel className='font-mulish font-bold text-base text-[#1C2B38]' shrink>
                {label}
              </InputLabel>
            )}
            <TextField
              {...field}
              {...rest}
              className={twMerge(
                "pl-5 py-4 rounded-md relative bg-gray-100 border text-sm w-full",
                hasError ? 'border-[red]' : '',
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
              <p className='font-mulish text-sm text-red-600'>{errors[name]?.message as string}</p>
            )}
          </div>
        )
      }}
    />
  );
};

export default InputField;