"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProfileCard from "@/app/[locale]/profile/components/CardProfile/cardProfile";
import MenuProfile from "./components/CardProfile/menuProfile";
import { menuProfile } from "./components/CardProfile/menuProfileData";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";
import withAuth from "@/HOCs/withAuth";
import useGetProfile from "@/services/modules/profile/hook/useGetProfile";
import CardBreadcrumbs from "../../../components/BreadCrump/breadcrumb";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import ProfileContent from "./components/CardProfile/profileContent";

const ProfileWithCustomComponent: React.FC = () => {
  //!Const + Hook
  const t = useTranslations("profile");
  const auth = useAuth();
  const user = auth.user;
  const [avatar, setAvatar] = useState<string | undefined>();
  const [activeMenuProfile, setActiveMenuProfile] = useState<number>(
    menuProfile[0].value,
  );
  const { showSuccess, showError } = useNotifications();
  const handleMenuProfileChange = (menuProfileValue: number) => {
    setActiveMenuProfile(menuProfileValue);
  };
  const { data, loading, refetch } = useGetProfile(Number(user?.id));
  const onSuccessNotify = async () => {
    await refetch();
    showSuccess(t("updateDataSuccess"));
  };
  useEffect(() => {
    const searchParams = window.location.search;
  
    if (data?.avatar) {
      setAvatar(data.avatar);
    }
  
    if (searchParams) {
      const reloadPaymentData = async () => {
        try {
          const response = await tourCustomerServices.reloadPayByVnpay(searchParams);
          const statusCode = response.data.statusCode;
  
          if (statusCode === 200) {
            showSuccess(t('paySuccess'));
          } else {
            showError(t('payError'));
          }
        } catch (error) {
          console.error("Error reloading payment data:", error);
        }
      };
  
      reloadPaymentData();
  
      // Clean up the URL by removing query parameters
      const baseUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, baseUrl);
    }
  }, [data]);
  

  return (
    <Box className="FormProfileWithCustomComponent">
      {loading ? (
        <Loading />
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
            <ProfileContent
              activeMenuProfile={activeMenuProfile}
              data={data}
              avatar={avatar}
              onSuccess={onSuccessNotify}
              setAvatar={(newAvatar) => setAvatar(newAvatar)}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withAuth(ProfileWithCustomComponent);
