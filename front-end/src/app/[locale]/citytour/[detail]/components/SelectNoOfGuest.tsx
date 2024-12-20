"use client";
import React, { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { FieldError } from "react-hook-form";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { twMerge } from "tailwind-merge";
import { NoOfGuest } from "../page";

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

    const toggleDropdown = () => setOpen((prev) => !prev);

    const increaseAdult = () => {
        setAdultQuantity((prev) => prev + 1)
        handelSetValue({ adultQuantity: adultQuantity + 1, childQuantity: childQuantity })
    };
    const decreaseAdult = () => {
        setAdultQuantity((prev) => (prev > 0 ? prev - 1 : 0))
        handelSetValue({ adultQuantity: adultQuantity - 1, childQuantity: childQuantity })
    };

    const increaseChild = () => {
        setChildQuantity((prev) => prev + 1)
        handelSetValue({ adultQuantity: adultQuantity, childQuantity: childQuantity +1 })
    };
    const decreaseChild = () => {
        setChildQuantity((prev) => (prev > 0 ? prev - 1 : 0))
        handelSetValue({ adultQuantity: adultQuantity, childQuantity: childQuantity -1 })
    };

    return (
        <div className="tw-flex tw-flex-col">
            <label className={"tw-text-[15px] tw-h-[18px] tw-font-[700] tw-mb-[10px]"}>No. Of Guest</label>
            <div className="tw-w-full tw-relative tw-z-20">
                <TextField
                    name="noOfGuest"
                    onClick={toggleDropdown}
                    className={twMerge("tw-w-full tw-bg-[#F4F4F5]", className)}
                    {...field}
                    onChange={(e) => {
                        console.log(e.target.value);
                    }}
                    placeholder={"Select No. Of Guest"}
                    variant="outlined"
                    value={`${adultQuantity ? `${adultQuantity} adults` : ""} ${childQuantity ? `, ${childQuantity} children` : ""}`}
                    sx={{
                        fieldSet: {
                            cursor: "pointer",
                            border: "none",
                            fontSize: "10px",
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
                        {/* Adults Section */}
                        <CommonStyles.Box className="tw-flex tw-justify-between tw-w-full">
                            <CommonStyles.Typography
                                type="size14Weight700"
                                className="tw-flex tw-items-center tw-gap-2"
                            >
                                <CommonIcons.PeopleOutlineOutlined />
                                Adults
                            </CommonStyles.Typography>
                            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
                                <CommonStyles.Box onClick={decreaseAdult} className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm" sx={{ padding: 0 }}>
                                    <CommonIcons.Remove />
                                </CommonStyles.Box>
                                <CommonStyles.Box className="tw-px-4 tw-border-solid tw-h-full tw-border-[1px] tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-border-primary">
                                    {adultQuantity}
                                </CommonStyles.Box>
                                <CommonStyles.Box onClick={increaseAdult} className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm" sx={{ padding: 0 }}>
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
                                Children
                            </CommonStyles.Typography>
                            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
                                <CommonStyles.Box onClick={decreaseChild} className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm" sx={{ padding: 0 }}>
                                    <CommonIcons.Remove />
                                </CommonStyles.Box>
                                <CommonStyles.Box className="tw-px-4 tw-border-solid tw-h-full tw-border-[1px] tw-rounded-sm tw-flex tw-items-center tw-justify-center tw-border-primary tw-box-border">
                                    {childQuantity}
                                </CommonStyles.Box>
                                <CommonStyles.Box onClick={increaseChild} className="tw-border-solid tw-border-[1px] tw-border-primary tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-sm" sx={{ padding: 0 }}>
                                    <CommonIcons.Add />
                                </CommonStyles.Box>
                            </CommonStyles.Box>
                        </CommonStyles.Box>
                        {/* Done Button */}
                        <CommonStyles.Typography
                            onClick={toggleDropdown}
                            type="size14Weight600"
                            className="tw-text-primary tw-cursor-pointer"
                        >
                            Done
                        </CommonStyles.Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectNoOfGuest;
