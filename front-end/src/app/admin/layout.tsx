import React, { FC, ReactNode } from "react";
import { Container } from "@mui/material";
import SideBar from "./Component/sidebar";
import Header from "./Component/header";
import {default as CommonStyles} from "@/components/common"
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
          <CommonStyles.Box className="tw-py-5">{props.children}</CommonStyles.Box>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
