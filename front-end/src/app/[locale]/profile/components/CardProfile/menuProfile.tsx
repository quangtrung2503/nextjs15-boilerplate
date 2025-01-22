import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface menuProfile {
  label: string;
  value: number;
}

interface menuProfilesProps {
  menuProfiles: menuProfile[];
  activeMenuProfile: number;
  onMenuProfileChange: (menuProfileValue: number) => void;
}

const MenuProfile: React.FC<menuProfilesProps> = ({menuProfiles, activeMenuProfile, onMenuProfileChange}) => {
  const t = useTranslations();
  return (
    <Box className="tw-flex tw-flex-col">
      {menuProfiles.map((menu) => (
        <Button
          key={menu.value}
          onClick={() => onMenuProfileChange(menu.value)}
          className={twMerge(
            "tw-h-14 tw-border-none tw-py-0 tw-pl-8 tw-justify-start tw-text-left tw-font-medium tw-rounded-none tw-normal-case",
            menu.value === activeMenuProfile
              ? "tw-text-white tw-bg-primary hover:tw-bg-primary tw-cursor-pointer"
              : "tw-text-black tw-bg-white hover:tw-bg-white tw-cursor-pointer"
          )}
        >
          {t(menu.label as any)}

        </Button>
      ))}
    </Box>
  );
};

export default MenuProfile;