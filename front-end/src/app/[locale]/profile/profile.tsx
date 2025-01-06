"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProfileCard from "@/app/[locale]/profile/components/CardProfile/cardProfile";
import PersonalProfile from "./components/PersonalInformation/personalInformation";
import SecurityInformation from "./components/SecurityInformation/securityInformation";
import MenuProfile from "./components/MenuProfile/menuProfile";
import Divider from "@/components/common/Divider";
import { menuProfile } from "./components/MenuProfile/menuProfileData";
import useAuth from "@/hooks/useAuth";
import { default as CommonStyles } from "@/components/common";
import Loading from "@/components/common/Loading";
import withAuth from "@/HOCs/withAuth";
import useGetProfile from "@/services/modules/profile/hook/useGetProfile";
import CardBreadcrumbs from "./components/BreadCrump/breadcrumb";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import BookingHistory from "./components/BookingHistory/bookingHistory";

const FormProfileWithCustomComponent: React.FC = () => {
  const t = useTranslations("profile");
  const auth = useAuth();
  const user = auth.user;
  const [avatar, setAvatar] = useState<string | undefined>();
  const [activeMenuProfile, setActiveMenuProfile] = useState<number>(
    menuProfile[0].value,
  );
  const { showSuccess } = useNotifications();

  const handleMenuProfileChange = (menuProfileValue: number) => {
    setActiveMenuProfile(menuProfileValue);
  };
  //Process data in from Personal Information and Security
  const { data, loading, refetch } = useGetProfile(Number(user?.id));
  const onSuccessApp = async () => {
    await refetch();
    showSuccess(t("updateDataSuccess"));
  };

  useEffect(() => {
    if (data?.avatar) {
      setAvatar(data.avatar);
    }
  }, [data]);

  return (
    <Box className="FormProfileWithCustomComponent">
      {loading ? (
        <CommonStyles.Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: 10,
          }}
        >
          <Loading />
        </CommonStyles.Box>
      ) : (
        <></>
      )}
      <CardBreadcrumbs />
      <Box
        sx={{ margin: "60px 185px" }}
        className={"tw-h-full tw-flex-grow tw-shadow-2xl tw-rounded"}
      >
        <Grid container alignItems="stretch">
          <Grid size={3} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{ borderRightStyle: "solid" }}
              className={"tw-flex-grow tw-border-r tw-border-gray-300"}
            >
              <ProfileCard
                name={data?.name}
                location={data?.address}
                dateOfBirth={data?.dateOfBirth}
                avatar={data?.avatar}
                onAvatarChange={(newAvatar: string) => setAvatar(newAvatar)}
              />
              <MenuProfile
                menuProfiles={menuProfile}
                activeMenuProfile={activeMenuProfile}
                onMenuProfileChange={handleMenuProfileChange}
              />
            </Box>
          </Grid>
          <Grid size={9} className={"tw-flex tw-flex-col"}>
            {activeMenuProfile === 1 ? (
              <Box>
                <PersonalProfile
                  data={data}
                  avatar={avatar}
                  onSuccess={onSuccessApp}
                />
                <Divider />
                <SecurityInformation />
              </Box>
            ) : (
              <BookingHistory />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withAuth(FormProfileWithCustomComponent);
