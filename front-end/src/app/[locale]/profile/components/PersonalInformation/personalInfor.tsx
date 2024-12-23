import { CommonButton } from "@/components/common/Button";
import InputField from "@/components/react-hook-form/InputForm/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { schemaPersonalInformation } from "../../schema";
import {
  Profile,
  UpdateProfile,
} from "@/services/modules/profile/interface/profile";
import { useEffect, useState } from "react";
import { CommonDatePicker } from "@/components/common/DatePicker";
import profileServices from "@/services/modules/profile/profile.services";
import RHFField from "@/components/customReactFormField/ReactFormField";

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
          className="tw-pt-9 tw-text-left tw-text-lg tw-font-semibold tw-text-accent_gray_dark"
        >
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit(onSubmitSetPersonalInformation)}>
          <InputField name="name" control={control} label="Name" />

          <RHFField
            name="dateOfBirth"
            control={control}
            border
            component={CommonDatePicker}
            label="Date Of Birth"
            className="twMerge('tw-rounded-md tw-relative tw-bg-none tw-border tw-text-sm tw-w-full tw-bg-[#F4F4F5]')"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "3px",
                backgroundColor: "#F4F4F5",
                fieldset: {
                  padding: 0,
                  border: errors["dateOfBirth"] ? "#ef4444 solid 1px" : "none",
                },
              },
            }}
          />
          {/* <CommonDatePicker /> */}
          <InputField
            name="phone"
            control={control}
            label="Phone"
            type="tel"
            regex={/^\d*$/}
          />
          <InputField name="address" control={control} label="Location" />
          <InputField
            name="email"
            control={control}
            label="Email Address"
            type="email"
            fullWidth
          />
          <CommonButton
            className={
              "tw-bg-acc_gray_800 tw-text-white tw-justify-center tw-w-5/12 tw-flex tw-bg-primary"
            }
            type="submit"
            loading={loading}
          >
            Save
          </CommonButton>
        </form>
      </Box>
    </Box>
  );
};

export default PersonalProfile;
