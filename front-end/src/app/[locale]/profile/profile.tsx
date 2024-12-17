"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Link, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProfileCard from "@/app/[locale]/profile/components/CardProfile/cardProfile";
import Typography from "@mui/material/Typography";
import PersonalProfile from "./components/PersonalInformation/personalInfor";
import SecurityInformation from "./components/SecurityInformation/securityInformation";
import Tabs from "./components/Tabs/tabs";
import Divider from "@/components/common/Divider";
import { tabs } from "./components/Tabs/tabsData";

type FormData = {
  name: string;
  phone: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const FormProfileWithCustomComponent: React.FC = () => {  

  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);

  const handleTabChange = (tabValue: number) => {
    setActiveTab(tabValue);
  }

  return (
    <Box className="FormProfileWithCustomComponent">
      <Box>
        <Typography variant="h2">My Profile</Typography>
        <Link>Home/My Profile</Link>
      </Box>

      <Box
        sx={{margin: "60px 185px"}}
        className={"tw-h-full tw-flex-grow tw-shadow-2xl tw-rounded"}
      >
        <Grid container alignItems="stretch">
          <Grid size={3} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{borderRightStyle: 'solid'}}
              className={"tw-flex-grow tw-border-r tw-border-gray-300"}
            >
              <ProfileCard name="Masum Rana" sub="Gothenburb" />
              <Tabs 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </Box>
          </Grid>
          <Grid size={9} className={"tw-flex tw-flex-col"}>
            {activeTab === 1 ? (
              <Box>
                <PersonalProfile />
                <Divider />
                <SecurityInformation />
              </Box>
            ) : (
              <React.Fragment />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FormProfileWithCustomComponent;
