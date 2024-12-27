import React, { useRef, useState } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import {  SxProps } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import Box from "../common/Box";
import useImageUploader from "@/hooks/useUpload";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";

interface UploadFieldProps {
  field: {
    name: string;
    value: string | string[];
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  label?: string;
  multiple?: boolean;
  sx?: SxProps;
  type?: string;
  className?: string;
  placeholder?: string;
  onChange?: (e: any) => Promise<void>;
  renderButton?: React.ReactNode;
  setValue: UseFormSetValue<any>;
}
const UploadField = (props: UploadFieldProps) => {
  const {
    label,
    field,
    fieldState,
    className,
    multiple,
    renderButton,
    setValue,
  } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const { uploadImage,uploadImages } = useImageUploader();
  const { showError } = useNotifications();
  //! State
  const [loading,setLoading] = useState(false);
  
  const t = useTranslations('uploadField');
  //! State

  // const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       try {
  //         const res = await uploadImage(file);;
  //         methods.setValue("image", res.data.data.uri);
  //       } catch (error) {
  //         showError(error);
  //       }
  //     } else {
  //     showError("No file selected");
  //     }
  //   }
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (multiple) {
        try{
          setLoading(true);
          const res = await uploadImages(files);
          setValue(field?.name || "",res.data.data.data.map((file)=>file.uri).concat(field.value))
        }
        catch(error){
          showError(error)
        }
        finally{
          setLoading(false);
          if(uploadRef && uploadRef.current) {
            uploadRef.current.value = ''
          }
        }
        // setValue(field?.name || "", fileArray);
      } else {
        // If single file, store the file name or URL
        try {
          setLoading(true);
          const res = await uploadImage(files[0]);
          setValue(field?.name || "", res.data.data.uri);
        } catch (error) {
          showError(error);
        }
        finally{
          setLoading(false);
          if(uploadRef && uploadRef.current) {
            uploadRef.current.value = ''
          }
        }
      }
    }
    //   // setValue(field?.name || "",event.target.files?.[0]);
  };

  return (
    <CommonStyles.Box className={className}>
      <label className="tw-font-mulish tw-text-[15px] tw-font-bold tw-text-accent_gray_800">
        {label}
      </label>
      <input
        multiple={multiple}
        type="file"
        ref={uploadRef}
        name={`${props.field.name}-upload-input`}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <Box
        onClick={() => {
          uploadRef && uploadRef?.current?.click();
        }}
      >
        {renderButton ? (
          renderButton
        ) : (
          <CommonStyles.CommonButton loading={loading} className={`tw-w-full tw-mt-2 tw-bg-gray-300 ${fieldState.error && "tw-border-solid tw-border-[1px] tw-border-[#d32f2f]"}`}>
            {t("upload")}
          </CommonStyles.CommonButton>
        )}
      </Box>
      {fieldState.error && (
        <span className="tw-text-[#d32f2f] tw-text-xs tw-ml-3">
          {fieldState.error.message}
        </span>
      )}
    </CommonStyles.Box>
  );
};
export default React.memo(UploadField);