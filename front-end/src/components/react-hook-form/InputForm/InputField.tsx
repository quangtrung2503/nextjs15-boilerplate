import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Control, Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type InputFieldProps = {
  name: string;
  control: Control<any>;
  regex?: RegExp;
  icon?: React.ReactNode;
  defaultValue?: string;
};

const InputField: React.FC<InputFieldProps & TextFieldProps> = ({
  name,
  control,
  placeholder,
  label,
  type = 'text', // Mặc định là 'text'
  defaultValue,
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
        const hasError = !!errors[name]?.message;

        const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = event.target.value;
          if (!regex || regex.test(inputValue)) {
            onChange(event);
          }
        };

        const [showPassword, setShowPassword] = React.useState<boolean>(false);

        const handleToggleShowPassword = () => {
          setShowPassword(prev => !prev);
        };

        return (
          <Box className="tw-mt-2.5 tw-mb-5">
            {label && (
              <InputLabel 
                className="tw-font-mulish tw-text-left tw-font-bold tw-text-lg tw-text-[#1C2B38]" 
                shrink
              >
                {label}
              </InputLabel>
            )}
            <TextField
              {...field}
              {...rest}
              className={twMerge(
                "tw-rounded-md tw-relative tw-bg- tw-border tw-text-sm tw-w-full tw-bg-[#F4F4F5]",
                hasError ? 'tw-border-red-500' : 'tw-bg-[#F4F4F5]',
                className
              )}
              type={type === 'password' && showPassword ? 'text' : type}
              value={value || ''}
              onChange={onChangeHandler}
              slotProps={{
                input: {
                  endAdornment: type === 'password' ? (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      {icon}
                    </InputAdornment>
                  ) : (
                    icon ? (
                      <InputAdornment position="end">
                        {icon}
                      </InputAdornment>
                    ) : null
                  ),
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: hasError ? '#ef4444' : 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: hasError ? '#ef4444' : 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: hasError ? '#ef4444' : 'white',
                  }
                }
              }}
            />
            {hasError && (
              <label className="tw-flex tw-font-mulish tw-text-sm tw-text-red-600">
                {errors[name]?.message as string}
              </label>
            )}
          </Box>
        );
      }}
    />
  );
};

export default InputField;