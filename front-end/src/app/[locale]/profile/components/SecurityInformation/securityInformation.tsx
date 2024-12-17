import { CommonButton } from "@/components/common/Button";
import InputField from "@/components/react-hook-form/InputForm/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { schemaSecurityInformation } from "../../schema";

interface ISecurityProfile {
  email: string;
  password: string;
  confirmPassword: string;
}

const SecurityInformation: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSecurityInformation),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  console.log({ errors });

  const onSubmitFormSecurityInformation: SubmitHandler<ISecurityProfile> = (
    data,
  ) => {
    console.log("Security data", data);
  };

  return (
    <Box className={"tw-flex-grow tw-rounded-sm"}>
      <Box className={"tw-mx-10"}>
        <Typography
          variant="h6"
          className="tw-pt-9 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
          Security
        </Typography>
        <form onSubmit={handleSubmit(onSubmitFormSecurityInformation)}>
          <InputField name="email" control={control} label="Email Address" />
          <InputField
            name="password"
            type="password"
            control={control}
            label="Password"
          />
          <InputField
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />
          <CommonButton
            className={
              "tw-bg-acc_gray_800 tw-text-white tw-justify-center tw-w-5/12 tw-flex tw-bg-primary tw-mb-10"
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

export default SecurityInformation;
