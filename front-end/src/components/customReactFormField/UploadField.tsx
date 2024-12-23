import React, { Fragment, useRef } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { Button, InputLabel, SxProps } from "@mui/material";
import { default as CommonStyles } from "@/components/common"
import apiUrls from "@/constants/apiUrls";

interface UploadFieldProps {
  field: {
    name: string;
    value: string | string[];
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  label: string;
  multiple?: boolean;
  sx?: SxProps;
  type?: string;
  className?: string;
  placeholder?: string;
  onChange?: (e: any) => Promise<void>;
}

const UploadField = (props: UploadFieldProps) => {
  const { label, field, fieldState, className, multiple } = props;
  const uploadRef = useRef<HTMLInputElement>(null);

  //! State
  const { setValue } = useFormContext();

  //! Function to handle file change
  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     const uploadedResponse = await uploadImage(file); // Gọi API upload file
  //     const uploadedUrl = uploadedResponse.data.data.uri; // Giả sử API trả về URL của file

  //     // Set giá trị URL đã tải lên vào React Hook Form
  //     field.onChange(uploadedUrl); // Đặt giá trị file URL vào trường form
  //   } catch (error) {
  //     console.error("Upload failed", error);
  //   }
  // };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (multiple) {
        // Explicitly cast the FileList to an array of File objects
        const fileArray = Array.from(files as FileList).map((file: File) => file.name);
        setValue(field?.name || "", fileArray);
      } else {
        // If single file, store the file name or URL
        setValue(field?.name || "", files[0]?.name);
      }
    }
    //   // setValue(field?.name || "",event.target.files?.[0]);
  };

  // const handleChange = (event: any) => {
  //   const files = event.target.files;
  //   if (files) {
  //     if (multiple) {
  //       // If multiple files, store them as an array of file names or URLs
  //       const fileArray = Array.from(files).map((file: File) => file.name);
  //       setValue(field?.name || "", fileArray);
  //     } else {
  //       // If single file, store the file name or URL
  //       setValue(field?.name || "", files[0]?.name);
  //     }
  //   }
  // };
  return (
    <CommonStyles.Box className={className}>
      <label className="tw-font-mulish tw-text-[15px] tw-font-bold tw-text-accent_gray_800">{label}</label>
      <input
        multiple={multiple}
        type="file"
        ref={uploadRef}
        name={`${props.field.name}-upload-input`}
        style={{ display: "none" }}
        onChange={props.onChange ? props.onChange : handleChange}
      />
      <CommonStyles.CommonButton
        className="tw-w-full tw-mt-2 tw-bg-gray-300"
        onClick={() => {
          uploadRef && uploadRef?.current?.click();
        }}
      >
        Upload
      </CommonStyles.CommonButton>
      <CommonStyles.Typography className="tw-mt-2">
        {Array.isArray(field.value) ? field.value.join("\n") : field.value ? <img src={`${apiUrls.IMG_URL}/${field.value}`} alt={`${field.name}-images`} className="tw-w-[100px] tw-h-auto"/>:""}
      </CommonStyles.Typography>
      {/* <CommonStyles.Typography>{uploadRef.current?.value || field.value}</CommonStyles.Typography> */}
    </CommonStyles.Box>
  );
};

export default React.memo(UploadField);
