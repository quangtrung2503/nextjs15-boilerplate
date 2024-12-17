import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Badge from "@mui/material/Badge";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { Box } from "@mui/material";
import Divider from "@/components/common/Divider";

export default function ProfileCard(props: any) {
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
              <ModeEditIcon
                className={
                  "tw-w-5 tw-h-5 tw-p-1 tw-border-4 tw-border-solid tw-border-white tw-rounded-full tw-text-white tw-bg-primary"
                }
               />
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src={props.avatar_profile}
            />
          </Badge>

          <Typography
            variant="h6"
            className="tw-font-bold tw-text-accent_gray_dark"
          >
            {props.name}
          </Typography>
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-x-2 tw-text-accent_gray_800">
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.RoomIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {props.location}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Divider orientation="vertical" className="tw-h-4" />
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.CakeIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {props.dateOfBirth}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem />
    </Box>
  );
}
