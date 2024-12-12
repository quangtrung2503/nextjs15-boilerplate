"use client";

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import InputField from '@/components/react-hook-form/InputForm/InputField';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';


type FormData = {
  name: string;
  phone: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const FormProfileWithCustomComponent: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
  };
  const phoneRegex =/^\d*$/;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="name"
          control={control}
          label="Name"
        />
        <InputField
          name="phone"
          control={control}
          label="Phone"
          type='tel'
          regex={phoneRegex}
        />
        <InputField
          name="location"
          control={control}
          label="Location"
        />
        <InputField
          name="email"
          control={control}
          label="Email Address"
        />
        <InputField
          name="password"
          type='password'
          control={control}
          label="Password"
        />
        <InputField
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          type="password"
        />
        <button type='submit'>Save</button>
      </form>
    </div>
  );
};

export default FormProfileWithCustomComponent;