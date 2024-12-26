"use client";
import { CommonButton } from "@/components/common/Button";
import useToggleDialog from "@/hooks/useToggleDialog";
import { Box, MenuItem, menuItemClasses, MenuList, Popover } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import useAuth from "@/hooks/useAuth";
import pageUrls from "@/constants/pageUrls";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { user,signOut } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box className="tw-h-header_admin tw-w-content-admin tw-fixed tw-top-0 tw-right-0 tw-z-50 tw-flex tw-items-center tw-bg-white tw-shadow-sm">
      <Box className="tw-h-5 tw-flex tw-w-full tw-items-center tw-justify-between">
        <CommonStyles.Typography
          className="tw-text-primary tw-font-semibold"
          sx={{ fontWeight: 600 }}
          variant="h6"
        >
          Hello, {user?.name}<span className="tw-ml-1">👋</span>
        </CommonStyles.Typography>
        <Box className="tw-mr-5 tw-flex tw-items-center">
          <CommonStyles.Box className="tw-mr-2 tw-border-secondary tw-bg-secondary_100 tw-flex tw-p-2 tw-rounded-xl tw-text-gray-700 hover:tw-opacity-50 tw-border-solid tw-border-[1px]">
            <CommonIcons.TranslateOutlined />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-mr-2 tw-bg-primary_100 tw-flex tw-p-2 tw-rounded-xl tw-text-gray-700 hover:tw-opacity-50 tw-border-solid tw-border-primary tw-border-[1px]">
            <CommonIcons.NotificationsOutlined />
          </CommonStyles.Box>
          <CommonStyles.Box
            className="tw-cursor-pointer tw-flex tw-items-center tw-p-2 tw-border-primary tw-bg-primary_100 tw-rounded-full"
            sx={{ border: 1 }}
            onClick={(e) => handleClick(e)}
          >
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
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <CommonStyles.Box className="tw-p-4 tw-flex tw-flex-col tw-gap-4">
                <CommonStyles.Box className="tw-flex tw-gap-4">
                  <CommonStyles.Avatar src={user?.avatar ? user.avatar : ""} />
                  <CommonStyles.Box className="tw-flex tw-flex-col">
                    <CommonStyles.Typography className="tw-text-primary tw-font-semibold">
                      {user?.name}
                    </CommonStyles.Typography>
                    <CommonStyles.Typography className="tw-text-gray-500 tw-text-sm">
                      {user?.email}
                    </CommonStyles.Typography>
                  </CommonStyles.Box>
                </CommonStyles.Box>
                <CommonStyles.Divider />
                <MenuList
                  sx={{
                    p: 0,
                    gap: 1,
                    display: "flex",
                    flexDirection: "column",
                    [`& .${menuItemClasses.root}`]: {
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 0.75,
                      bgcolor: "#54555513",
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "100%",
                      paddingY: "20px",
                      "&:hover": { color: "var(--primary)" },
                      [`&.${menuItemClasses.selected}`]: {
                        color: "var(--primary)",
                        bgcolor: "action.selected",
                        fontWeight: "fontWeightSemiBold",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      router.push(pageUrls.Profile);
                    }}
                    className="tw-py-3"
                  >
                    {t("menuAdmin.profile")}
                  </MenuItem>
                  <MenuItem
                    className="tw-py-3"
                  >
                    {t("menuAdmin.setting")}
                  </MenuItem>
                  <MenuItem onClick={signOut} className="tw-py-3 tw-text-red-500 hover:tw-bg-red-50">
                    {t("menuAdmin.logout")}
                  </MenuItem>
                </MenuList>
              </CommonStyles.Box>
            </Popover>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
