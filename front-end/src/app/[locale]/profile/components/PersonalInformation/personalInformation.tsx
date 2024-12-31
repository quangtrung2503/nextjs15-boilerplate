import { CommonButton } from "@/components/common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { createSchemaPersonalInformation } from "../../schema";

import {
  Profile,
  UpdateProfile,
} from "@/services/modules/profile/interface/profile";
import { useEffect, useState } from "react";
import { CommonDatePicker } from "@/components/common/DatePicker";
import profileServices from "@/services/modules/profile/profile.services";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { useTranslations } from "next-intl";
import InputField from "@/components/customReactFormField/InputField";
import { twMerge } from "tailwind-merge";

interface IPersonalProfile {
  data?: Profile;
  avatar?: string;
  onSuccess: () => void;
}
interface FormData {
  name: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  email?: string;
}

const PersonalProfile: React.FC<IPersonalProfile> = (
  props: IPersonalProfile,
) => {
  const { data, avatar, onSuccess } = props;
  const { id, name, dateOfBirth, phone, address, email } = data ?? {};
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const schemaPersonalInformation = createSchemaPersonalInformation(t);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schemaPersonalInformation),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      email: "",
    },
  });

  useEffect(() => {
    reset({ name, dateOfBirth, phone, address, email });
  }, [data]);

  const onSubmitSetPersonalInformation: SubmitHandler<FormData> = async (
    formData,
  ) => {
    try {
      setLoading(true);
      if (id) {
        const dataUpdateUser: UpdateProfile = {
          id,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          name: formData.name,
          phone: formData.phone,
          avatar,
        };
        await profileServices.updatePersonalProfile(dataUpdateUser);
        onSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={"tw-flex-grow tw-rounded-sm"}>
      <Box className={"tw-mx-10 tw-mb-7"}>
        <Typography
          variant="h6"
          className="tw-pt-9 tw-pb-5 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
          {t("profile.personalInformation")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmitSetPersonalInformation)}>
          <Box className="tw-flex tw-flex-col tw-gap-[20px]">
            <RHFField
              name="name"
              control={control}
              className="tw-rounded-md tw-relative tw-bg-accent_gray_200 tw-text-sm tw-w-full tw-border-none"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t("profile.name")}
              type="text"
            />
            <RHFField
              name="dateOfBirth"
              control={control}
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={CommonDatePicker}
              label={t("profile.dateOfBirth")}
            />
            {/* <CommonDatePicker /> */}
            <RHFField
              name="phone"
              control={control}
              className="tw-rounded-md tw-relative tw-border-none tw-text-sm tw-w-full tw-bg-accent_gray_200"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t("profile.phone")}
              type="tel"
              regex={/^\d*$/}
            />

            <RHFField
              name="address"
              control={control}
              className="tw-rounded-md tw-relative tw-border-none tw-text-sm tw-w-full tw-bg-accent_gray_200"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t("profile.location")}
              type="text"
            />
            <RHFField
              name="email"
              control={control}
              className="tw-rounded-md tw-relative tw-border-none tw-text-sm tw-w-full tw-bg-accent_gray_200"
              sx={{
                "& fieldset": {
                  border: "none",
                },
              }}
              component={InputField}
              label={t("profile.email")}
              type="text"
            />
            <CommonButton
              className="tw-bg-acc_gray_800 tw-text-white tw-justify-center tw-w-5/12 tw-flex tw-bg-primary"
              type="submit"
              loading={loading}
            >
              {t("profile.save")}
            </CommonButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default PersonalProfile;
