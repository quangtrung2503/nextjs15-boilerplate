"use client"
import { FC, ReactNode, useEffect } from "react";
import SideBar from "./Component/sidebar";
import Header from "./Component/header";
import { Box } from "@mui/material";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import pageUrls from "@/constants/pageUrls";
import { Role } from "@/helpers/common";

interface Props {
  children: ReactNode;
}

const AdminLayout: FC<Props> = (props) => {
  const {user,isLogged} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLogged) {
      router.push(pageUrls.SignIn);
      return;
    }

    if (user?.role !== Role.ADMIN) {
      router.push(pageUrls.Homepage);
    }
  }, [isLogged, user, router]);

  if (!isLogged || user?.role !== Role.ADMIN) {
    return null;
  }
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
