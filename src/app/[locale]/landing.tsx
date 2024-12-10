"use client"
import { useThemeContext } from "@/themes/ThemeProvider";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { default as CommonStyles } from "../../components/common";
import CardGridItem from "@/components/Card/CardGirdItem";
import AccordionMUI from "@/components/common/Accordion";
import CommonIcons from "@/components/CommonIcons";
import { SelectOption } from "@/interfaces/common";
import Loading from "@/components/common/Loading";
import SelectField from "@/components/customReactFormField/SelectField";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormikValues } from "formik";
import InputField from "@/components/customReactFormField/InputField";
type FormValues = {
    username: string;
    email: string;
  };
const Landing = () => {
    const options: SelectOption[] = [
        {
          value: "value1",
          label: "label1",
        },
        {
          value: "value2",
          label: "label2",
        },
        {
          value: "value3",
          label: "label3",
        },
        {
          value: "value4",
          label: "label4",
        },
        {
          value: "value5",
          label: "label5",
        },
        {
          value: "value6",
          label: "label6",
        },
        {
          value: "value7",
          label: "label7",
        },
        {
          value: "value8",
          label: "label8",
        },
      ];
    const t = useTranslations('LandingPage');
    const { theme, setTheme } = useThemeContext();
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { username: "", email: "" },
      });
    
      const onSubmit: SubmitHandler<FormikValues> = (data) => {
        console.log("Form Data:", data);
      };
    return (
        <div className="flex flex-col gap-10 m-10">
      {/* <CommonIcons.AbcTwoTone/> */}
      <CommonStyles.Box className="w-[270px] p-5">
        <CardGridItem
          src="https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg"
          title="Alaska: Westminster to Greenwich River Thames"
          duration="Duration 2 hours"
          transport="Transport Facility"
          plan="Family Plan"
          price={35}
        />
      </CommonStyles.Box>
      <CommonStyles.Box className="w-[270px] p-5">
        <AccordionMUI title="Theme" options={options} />
        <Loading />
      </CommonStyles.Box>
      <SelectField
        options={options}
        onChange={(e) => {
          console.log(e.target.value);
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <RHFField
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          component={InputField}
          label="Username"
        />
        <RHFField
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/, message: "Invalid email address" },
          }}
          component={InputField}
          label="Email"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
    )
}

export default Landing