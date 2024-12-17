"use client"
import { FC, ReactNode } from "react";
import SideBar from "./Component/sidebar";
import Header from "./Component/header";
import { Box } from "@mui/material";

interface Props {
  children: ReactNode;
}

const AdminLayout: FC<Props> = (props) => {
  return (
    <div className="tw-relative tw-flex tw-bg-gray-100 tw-min-h-screen">
      <SideBar />
      <div className="tw-ml-content-admin tw-w-full">
        <Header />
        <div className="tw-mt-header-admin tw-rounded-t-md">
          <Box className="tw-py-5">{props.children}</Box>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
