import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Badge from "@mui/material/Badge";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { Box } from "@mui/material";
import Divider from "@/components/common/Divider";
import moment from "moment";
import RHFField from "@/components/customReactFormField/ReactFormField";
import UploadField from "@/components/customReactFormField/UploadField";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { PUBLIC_URL } from "@/constants/apiUrls";
import { useTranslations } from 'next-intl';


interface ProfileUser {
  name?: string;
  location?: string | undefined;
  dateOfBirth?: string | "";
  avatar?: string;
  onAvatarChange?: (avatar: string) => void;
}

interface ProfileFormValues {
  avatar: string;
}

export default function ProfileCard(props: ProfileUser) {
  const t = useTranslations('profile')
  const { name, location, dateOfBirth, avatar, onAvatarChange } = props;
  const { control, setValue, watch } = useForm<ProfileFormValues>({
    defaultValues: { avatar: "" },
  });
  const avatarChange = watch("avatar");

  useEffect(() => {
    if (avatarChange) {
      onAvatarChange?.(avatarChange);
    }
  }, [avatarChange]);

  return (
    <Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid className={"tw-py-6 tw-px-0 tw-text-center"}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <RHFField
                className="tw-mb-3"
                name="avatar"
                control={control}
                setValue={setValue}
                component={UploadField}
                renderButton={
                  <ModeEditIcon className="tw-w-5 tw-h-5 tw-p-1 tw-border-4 tw-border-solid tw-border-white tw-rounded-full tw-text-white tw-bg-primary hover:tw-bg-teal-300 hover:tw-cursor-pointer" />
                }
              />
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src={
                avatarChange
                  ? `${PUBLIC_URL}/${avatarChange}`
                  : avatar
                    ? `${PUBLIC_URL}/${avatar}`
                    : ""
              }
            />
          </Badge>

          <Typography
            variant="h6"
            className="tw-font-bold tw-text-accent_gray_dark"
          >
            {name}
          </Typography>
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-x-2 tw-text-accent_gray_800">
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.RoomIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {location
                  ? (() => {
                      return location.split(",")[0].trim();
                    })()
                  : t("unknownAddress")}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Divider orientation="vertical" className="tw-h-4" />
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.CakeIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {dateOfBirth
                  ? moment(dateOfBirth).format("Do MMMM")
                  : t("unknownDate")}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem />
    </Box>
  );
}
