import { CommonButton } from "@/components/common/Button";
import InputField from "@/components/react-hook-form/InputForm/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Divider, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { schemaPersonalInformation } from "../../schema";

interface IPersonalProfile {
  name: string;
  dateOfBirth: string;
  phone: string;
  location: string;
}

const PersonalProfile: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schemaPersonalInformation),
  });

  const onSubmitFormPersonalInformation: SubmitHandler<IPersonalProfile> = (
    data,
  ) => {
    console.log("Data", data);
  };

  return (
    <Box className={"tw-flex-grow tw-rounded-sm"}>
      <Box className={"tw-mx-10 tw-mb-7"}>
        <Typography
          variant="h6"
          className="tw-pt-9 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit(onSubmitFormPersonalInformation)}>
          <InputField name="name" control={control} label="Name" />
          <InputField
            name="dateOfBirth"
            control={control}
            label="Date Of Birth"
            type="date"
          />
          <InputField
            name="phone"
            control={control}
            label="Phone"
            type="tel"
            regex={/^\d*$/}
          />
          <InputField name="location" control={control} label="Location" />
          <CommonButton
            className={
              "tw-bg-acc_gray_800 tw-text-white tw-justify-center tw-w-5/12 tw-flex tw-bg-primary"
            }
            type="submit"
          >
            Save
          </CommonButton>
        </form>
      </Box>
    </Box>
  );
};

export default PersonalProfile;
