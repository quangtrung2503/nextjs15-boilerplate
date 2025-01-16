"use client";

import React from "react";
import { Box } from "@mui/material";
import Divider from "@/components/common/Divider";
import PersonalProfile from "./PersonalInformation/personalInformation";
import SecurityInformation from "./SecurityInformation/securityInformation";
import BookingHistory from "./BookingHistory";
import { Profile } from "@/services/modules/profile/interface/profile";

interface ProfileContentProps {
  activeMenuProfile: number;
  data: Profile | undefined;
  avatar?: string;
  onSuccess: () => void;
  setAvatar: (avatar: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeMenuProfile,
  data,
  avatar,
  onSuccess,
}) => {
  switch (activeMenuProfile) {
    case 1:
      return (
        <Box>
          <PersonalProfile
            data={data}
            avatar={avatar}
            onSuccess={onSuccess}
          />
          <Divider />
          <SecurityInformation />
        </Box>
      );
    case 2:
      return <BookingHistory />;
    default:
      return null;
  }
};

export default ProfileContent;
