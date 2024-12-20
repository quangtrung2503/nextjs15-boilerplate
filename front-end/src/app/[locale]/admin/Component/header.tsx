'use client'
import { CommonButton } from "@/components/common/Button";
import useToggleDialog from "@/hooks/useToggleDialog";
import { Box, Popover } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import React from "react";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import useAuth from "@/hooks/useAuth";
const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const {user} = useAuth();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Box className="tw-h-header_admin tw-w-content-admin tw-fixed tw-top-0 tw-right-0 tw-z-50 tw-flex tw-items-center tw-bg-white tw-shadow-sm">
      <Box className="tw-h-5 tw-flex tw-w-full tw-items-center tw-justify-between">
        <CommonStyles.Typography
          className="tw-text-primary tw-font-semibold"
          sx={{ fontWeight: 600 }}
          variant="h6"
        >
          Hello, Tour guide<span className="tw-ml-1">👋</span>
        </CommonStyles.Typography>
        <Box className="tw-mr-5 tw-flex tw-items-center">
          <CommonStyles.Box className="tw-mr-2 tw-border-secondary tw-bg-secondary_100 tw-flex tw-p-2 tw-rounded-xl tw-text-gray-700 hover:tw-opacity-50 tw-border-solid tw-border-[1px]">
            <CommonIcons.TranslateOutlined />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-mr-2 tw-bg-primary_100 tw-flex tw-p-2 tw-rounded-xl tw-text-gray-700 hover:tw-opacity-50 tw-border-solid tw-border-primary tw-border-[1px]">
            <CommonIcons.NotificationsOutlined />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-cursor-pointer tw-flex tw-items-center tw-p-2 tw-border-primary tw-bg-primary_100 tw-rounded-full" sx={{ border: 1 }} onClick={(e) => handleClick(e)}>
            <Avatar />
            <CommonIcons.SettingsOutlined className="tw-ml-2 tw-p-1 tw-text-primary" />
          </CommonStyles.Box>
          <Box>
            <Popover
              className="tw-mt-2 tw-mr-10"
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <CommonStyles.Box className="tw-px-5 tw-py-5 tw-text-xl">
                <CommonStyles.Box><CommonStyles.Typography type="size16Weight400">Hey👋 {user?.name}</CommonStyles.Typography></CommonStyles.Box>
                <CommonStyles.Box className="tw-bg-primary_100 tw-rounded-xl tw-my-1 tw-p-2 tw-border-primary tw-border-solid tw-border-[1px]">
                  <CommonStyles.Box className="tw-flex tw-justify-start tw-px-5 tw-py-2 tw-items-center tw-my-1 tw-pr-4 tw-cursor-pointer hover:tw-bg-primary tw-rounded-lg">
                    <CommonIcons.AccountCircleOutlined />
                    <CommonStyles.Typography type="size18Weight500" className="tw-pl-3">Profile</CommonStyles.Typography>
                  </CommonStyles.Box>
                  <CommonStyles.Box className="tw-flex tw-justify-start tw-px-5 tw-py-2 tw-items-center tw-cursor-pointer hover:tw-bg-primary tw-rounded-lg">
                    <CommonIcons.Settings />
                    <CommonStyles.Typography type="size18Weight500" className="tw-pl-3">Setting</CommonStyles.Typography>
                  </CommonStyles.Box>
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-flex tw-text-red-500 tw-px-5 tw-justify-start tw-py-2 tw-items-center tw-cursor-pointer hover:tw-bg-red-200 tw-rounded-lg">
                  <CommonIcons.Logout />
                  <CommonStyles.Typography type="size18Weight500" className="tw-pl-3">Logout</CommonStyles.Typography>
                </CommonStyles.Box>
              </CommonStyles.Box>
            </Popover>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
