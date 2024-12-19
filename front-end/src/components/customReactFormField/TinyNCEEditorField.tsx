import React, { useRef } from "react";
import { InputLabel, SxProps } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { FieldError } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";
import TinyMceCommon from "../common/TinyMCEEditor";

interface CustomInputProps {
  field: {
    value: string;
    onChange: (event: string) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  label?: string;
  sx?: SxProps;
  type?: string;
  classNameLabel?: string;
  className?: string;
  placeholder?: string;
  classNameContainer?: string;
  id: string; // Add `id` for TinyMCE editor
}

const TinyMCEEditorField: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  label,
  sx,
  type,
  className,
  placeholder,
  classNameLabel,
  classNameContainer,
  id
}) => {
  const ref = useRef();
  return (
    <CommonStyles.Box className={twMerge("tw-w-full", classNameContainer)}>
      {label && (
        <InputLabel className={twMerge(classNameLabel, "tw-text-xl tw-font-mulish tw-font-bold tw-text-accent_gray_800")} shrink>
          {label}
        </InputLabel>
      )}
      <TinyMceCommon ref={ref} fieldState={fieldState} field={field} id={id} />
      {fieldState.error && <span className="text-red-500">{fieldState.error.message}</span>}
    </CommonStyles.Box>
  );
};

export default TinyMCEEditorField;
