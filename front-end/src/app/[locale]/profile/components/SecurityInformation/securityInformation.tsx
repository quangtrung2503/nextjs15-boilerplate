import { CommonButton } from "@/components/common/Button";
import InputField from "@/components/react-hook-form/InputForm/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { schemaSecurityInformation } from "../../schema";
import { useState } from "react";
import profileServices from "@/services/modules/profile/profile.services";
import { useNotifications } from "@/helpers/toast";

interface ISecurityProfile {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecurityInformation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();
  
  const initValue: ISecurityProfile = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSecurityInformation),
    defaultValues: initValue
  });

  const onSubmitFormSecurityInformation= async (dataPassword:ISecurityProfile) => {
    try {
      setLoading(true);
     const dataPasswordUser: ISecurityProfile = {
      currentPassword: dataPassword.currentPassword,
      newPassword: dataPassword.newPassword,
      confirmPassword: dataPassword.confirmPassword,
    }
      console.log("Data", dataPasswordUser);
       await profileServices.setPasswordUser(dataPassword);
     showSuccess("Set Password Success");
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      console.log(err);
      
     showError(err);
    } finally {
      setLoading(false);
    }
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
        <InputField
            name="currentPassword"
            type="password"
            control={control}
            label="Current Password"
          />
          <InputField
            name="newPassword"
            type="password"
            control={control}
            label="New Password"
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
