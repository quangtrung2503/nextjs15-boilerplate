import React, { useRef, useState } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";
import { SxProps } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import useImageUploader from "@/hooks/useUpload";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import { CommonButtonAdmin } from "./commonButton";
import Box from "@/components/common/Box";

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
  showDelete?: boolean;
  accept?: string;
  isVideo?: boolean;
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
    accept,
    isVideo,
  } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadImages } = useImageUploader();
  const { showError } = useNotifications();
  //! State
  const [loading, setLoading] = useState(false);

  const t = useTranslations("uploadField");
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
  const fileAcceptType = isVideo
    ? ".mp4, .mov, .avi, .mkv"
    : ".jpg, .jpeg, .png"; // You can add other image/video formats here.

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const allowedExtensions = isVideo
        ? [".mp4", ".mov", ".avi", ".mkv"] // Các định dạng video hợp lệ
        : [".jpg", ".jpeg", ".png"]; // Các định dạng hình ảnh hợp lệ

      let invalidFile = false;
      const invalidFiles: File[] = [];

      // Kiểm tra xem tệp nào không phù hợp với các định dạng cho phép
      Array.from(files).forEach((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (
          !fileExtension ||
          !allowedExtensions.includes(`.${fileExtension}`)
        ) {
          invalidFile = true;
          invalidFiles.push(file);
        }
      });

      // Nếu có tệp không hợp lệ, đặt lỗi và dừng quá trình tải lên
      if (invalidFile) {
        showError(`${t("inValidFile")}: ${invalidFiles.map((f) => f.name).join(", ")}`,);
        // Đặt lỗi cho trường
        setValue(field?.name || "", field.value); // Đặt lại giá trị trường
        return; // Thoát khỏi hàm để ngừng tải lên tệp không hợp lệ
      }
      if (multiple) {
        try {
          setLoading(true);
          const res = await uploadImages(files);
          setValue(
            field?.name || "",
            res.data.data.data.map((file) => file.uri).concat(field.value),
          );
        } catch (error) {
          showError(error);
        } finally {
          setLoading(false);
          if (uploadRef && uploadRef.current) {
            uploadRef.current.value = "";
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
        } finally {
          setLoading(false);
          if (uploadRef && uploadRef.current) {
            uploadRef.current.value = "";
          }
        }
      }
    }
    //   // setValue(field?.name || "",event.target.files?.[0]);
  };

  return (
    <CommonStyles.Box className={`tw-relative ${className}`}>
      <label className="tw-font-mulish tw-text-[15px] tw-font-bold tw-text-accent_gray_800">
        {label}
      </label>
      <input
        multiple={multiple}
        type="file"
        accept={fileAcceptType}
        ref={uploadRef}
        name={`${props.field.name}-upload-input`}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <Box
        onClick={() => {
          (uploadRef && !loading) && uploadRef?.current?.click();
        }}
      >
        {renderButton ? (
          renderButton
        ) : field.value != "" ? (
          <></>
        ) : (
          <CommonButtonAdmin
            loading={loading}
            className={`tw-w-full tw-mt-2 tw-bg-gray-100 ${fieldState.error && "tw-border-solid tw-border-[1px] tw-border-[#d32f2f]"}`}
          >
            {t("upload")}
          </CommonButtonAdmin>
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
