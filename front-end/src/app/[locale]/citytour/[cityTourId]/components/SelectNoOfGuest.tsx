"use client";
import React, { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { FieldError } from "react-hook-form";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { twMerge } from "tailwind-merge";
import { NoOfGuest } from "../forms";
import { useTranslations } from "next-intl";

interface CustomInputProps {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  type?: string;
  className?: string;
  placeholder?: string;
  handelSetValue: (value: NoOfGuest) => void;
}
const SelectNoOfGuest: React.FC<CustomInputProps> = ({
  field,
  fieldState,
  className,
  handelSetValue,
}) => {
  const [open, setOpen] = useState(false);
  const [adultQuantity, setAdultQuantity] = useState(0);
  const [childQuantity, setChildQuantity] = useState(0);

  const t = useTranslations("cityTour.cityTourDetail");

  const handleToggleDropdown = () => setOpen((prev) => !prev);

  const onIncreaseAdult = () => {
    setAdultQuantity((prev) => prev + 1);
    handelSetValue({
      adultQuantity: adultQuantity + 1,
      childQuantity: childQuantity,
    });
  };
  const onDecreaseAdult = () => {
    setAdultQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    handelSetValue({
      adultQuantity: adultQuantity - 1,
      childQuantity: childQuantity,
    });
  };

  const onIncreaseChild = () => {
    setChildQuantity((prev) => prev + 1);
    handelSetValue({
      adultQuantity: adultQuantity,
      childQuantity: childQuantity + 1,
    });
  };
  const onDecreaseChild = () => {
    setChildQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    handelSetValue({
      adultQuantity: adultQuantity,
      childQuantity: childQuantity - 1,
    });
  };

  return (
    <div className="tw-flex tw-flex-col">
      <label
        className={
          "tw-text-[15px] tw-text-accent_gray_800 tw-h-[18px] tw-font-[700] tw-mb-[10px]"
        }
      >
        {t("noOfGuest")}
      </label>
      <div className="tw-w-full tw-relative tw-z-20">
        <TextField
          name="noOfGuest"
          onClick={handleToggleDropdown}
          className={twMerge("tw-w-full tw-bg-accent_gray_200", className)}
          {...field}
          placeholder="Select No. Of Guest"
          variant="outlined"
          value={
            adultQuantity || childQuantity
              ? `${adultQuantity ? `${adultQuantity} ${adultQuantity > 1 ? t("adults") : t("adult")}` : ""}${adultQuantity && childQuantity ? ", " : ""
              }${childQuantity ? `${childQuantity} ${childQuantity > 1 ? t("children") : t("child")}` : ""}`
              : ""
          }
          sx={{
            fieldSet: {
              cursor: "pointer",
              border: "none",
            },
          }}
          size="medium"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="start">
                <CommonIcons.ArrowDropDown />
              </InputAdornment>
            ),
          }}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ""}
        />
        {open && (
          <div className="tw-w-full tw-bg-white tw-rounded-md tw-absolute tw-p-3 tw-pt-6 tw-box-border tw-flex tw-flex-col tw-items-end tw-gap-y-5 tw-text-accent_gray_800 tw-shadow-dropdown">
            <CommonStyles.Box className="tw-flex tw-justify-between tw-w-full">
              <CommonStyles.Typography
                type="size14Weight700"
                className="tw-flex tw-items-center tw-gap-2"
              >
                <CommonIcons.PeopleOutlineOutlined />
                {t("adults")}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
                <CommonStyles.Box
                  onClick={onDecreaseAdult}
                  className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm"
                  sx={{ padding: 0 }}
                >
                  <CommonIcons.Remove />
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-px-4 tw-border-solid tw-h-full tw-border-[1px] tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-border-primary tw-box-border">
                  {adultQuantity}
                </CommonStyles.Box>
                <CommonStyles.Box
                  onClick={onIncreaseAdult}
                  className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm"
                  sx={{ padding: 0 }}
                >
                  <CommonIcons.Add />
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
            {/* Children Section */}
            <CommonStyles.Box className="tw-flex tw-justify-between tw-w-full">
              <CommonStyles.Typography
                type="size14Weight700"
                className="tw-flex tw-items-center tw-gap-2"
              >
                <CommonIcons.BoyOutlined />
                {t("children")}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
                <CommonStyles.Box
                  onClick={onDecreaseChild}
                  className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm"
                  sx={{ padding: 0 }}
                >
                  <CommonIcons.Remove />
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-px-4 tw-border-solid tw-h-full tw-border-[1px] tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-border-primary tw-box-border">
                  {childQuantity}
                </CommonStyles.Box>
                <CommonStyles.Box
                  onClick={onIncreaseChild}
                  className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm"
                  sx={{ padding: 0 }}
                >
                  <CommonIcons.Add />
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
            {/* Done Button */}
            <CommonStyles.Typography
              onClick={handleToggleDropdown}
              type="size14Weight600"
              className="tw-text-primary tw-cursor-pointer"
            >
              {t("doneBtn")}
            </CommonStyles.Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectNoOfGuest;
