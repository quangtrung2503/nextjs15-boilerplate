import React from "react";
import CommonStyles from "@/components/common";
import { MenuItem, menuItemClasses, MenuList } from "@mui/material";
import { useRouter } from "next/navigation";
import pageUrls from "@/constants/pageUrls";
import { useTranslations } from "next-intl";
import { AccountMenu } from "..";
import useAuth from "@/hooks/useAuth";
type Props = {
  account: AccountMenu;
};
const MenuAccount = (props: Props) => {
  const { account } = props;
  const { avatarUrl, name, email } = account;
  const router = useRouter();
  const t = useTranslations("header");
  const auth = useAuth();
  return (
    <CommonStyles.Box className="tw-p-4 tw-flex tw-flex-col tw-gap-4">
      <CommonStyles.Box className="tw-flex tw-gap-4">
        <CommonStyles.Avatar src={avatarUrl ? avatarUrl : ""} />
        <CommonStyles.Box className="tw-flex tw-flex-col">
          <CommonStyles.Typography className="tw-text-primary tw-font-semibold">
            {name}
          </CommonStyles.Typography>
          <CommonStyles.Typography className="tw-text-gray-500 tw-text-sm">
            {email}
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
          {t("profileMenu.accountProfile")}
        </MenuItem>
        <MenuItem onClick={auth.signOut} className="tw-py-3">
          {t("profileMenu.logOut")}
        </MenuItem>
      </MenuList>
    </CommonStyles.Box>
  );
};

export default MenuAccount;
