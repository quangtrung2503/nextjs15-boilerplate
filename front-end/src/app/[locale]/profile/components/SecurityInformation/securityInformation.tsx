import { CommonButton } from "@/components/common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { createSchemaSecurityInformation } from "../../schema";
import { useState } from "react";
import profileServices from "@/services/modules/profile/profile.services";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";

interface ISecurityProfile {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityInformationFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecurityInformation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();
  const t = useTranslations();
  const schemaSecurityInformation = createSchemaSecurityInformation(t);

  const initValue: SecurityInformationFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SecurityInformationFormValues>({
    resolver: yupResolver(schemaSecurityInformation),
    defaultValues: initValue,
  });

  const onSubmitFormSecurityInformation = async (
    dataPassword: ISecurityProfile,
  ) => {
    try {
      setLoading(true);
      await profileServices.setPasswordUser(dataPassword);
      showSuccess(t("profile.setPassSuccess"));
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
          className="tw-pt-9 tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
          {t("profile.security")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmitFormSecurityInformation)}>
          <Box className="tw-flex tw-flex-col tw-gap-[20px]">
            <RHFField
              name="currentPassword"
              control={control}
              className="tw-rounded-md tw-relative tw-bg-accent_gray_200 tw-text-sm tw-w-full tw-border-none"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t('profile.currentPassword')}
              type="password"
            />
            <RHFField
              name="newPassword"
              control={control}
              className="tw-rounded-md tw-relative tw-bg-accent_gray_200 tw-text-sm tw-w-full tw-border-none"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t('profile.newPassword')}
              type="password"
            />
            <RHFField
              name="confirmPassword"
              control={control}
              className="tw-rounded-md tw-relative tw-bg-accent_gray_200 tw-text-sm tw-w-full tw-border-none"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t('profile.confirmPassword')}
              type="password"
            />
            <CommonButton
              className={
                "tw-bg-acc_gray_800 tw-text-white tw-justify-center tw-w-5/12 tw-flex tw-bg-primary tw-mb-10"
              }
              type="submit"
            >
              {t("profile.save")}
            </CommonButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SecurityInformation;
