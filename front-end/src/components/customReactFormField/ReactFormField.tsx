"use client";
import React from "react";
import { Controller, UseControllerProps, FieldValues, FieldError, useController } from "react-hook-form";

type RHFFieldProps<T extends FieldValues, C> = UseControllerProps<T> & {
  component: React.ComponentType<
    C & { field: any; fieldState: { error?: FieldError } }
  >;
} & Omit<C, "field" | "fieldState">;

function RHFField<T extends FieldValues, C>({
  name,
  control,
  rules,
  defaultValue,
  component: Component,
  ...props
}: RHFFieldProps<T, C>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Component {...(props as C)} field={field} fieldState={fieldState} />
      )}
    />
  );
}

export default RHFField;
