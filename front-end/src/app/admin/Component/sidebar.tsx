'use client'
import { default as CommonStyles } from "@/components/common";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import LineAxisOutlinedIcon from '@mui/icons-material/LineAxisOutlined';
import Link from "next/link";
import CommonIcons from "@/components/CommonIcons";
import { usePathname, useRouter } from "next/navigation";
const SideBar = () => {
  const sideBarRoutes = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LineAxisOutlinedIcon />,
    },
    {
      name: "City",
      path: "/admin/city",
      icon: <PlaceOutlinedIcon />,
    },
    {
      name: "Stories",
      path: "/stories",
      icon: <PostAddOutlinedIcon />,
    },
  ];
  const pathName = usePathname();
  return (
    <CommonStyles.Box className="tw-w-sidebar tw-min-h-screen tw-bg-white tw-fixed tw-left-0 tw-top-0 tw-bottom-0 tw-z-10 tw-font-serif tw-border-r tw-border-gray-200">
      {/* Header */}
      <CommonStyles.Box className="tw-pb-8 tw-flex tw-justify-center">
        <CommonStyles.Box className="tw-px-6 tw-h-header_admin tw-flex tw-items-center tw-font-bold tw-text-xl">
          <CommonIcons.Logo color="#7BBCB0" />
        </CommonStyles.Box>
      </CommonStyles.Box>

      {/* Sidebar Menu */}
      <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3">
        {sideBarRoutes.map((route, index) => {
          return (
            <Link href={route.path} key={index} className="tw-relative tw-px-6" style={{textDecoration: "none"}}>
              <CommonStyles.Box
                className={`tw-flex tw-items-center tw-text-lg tw-gap-x-4 tw-px-3 tw-py-3 tw-rounded-lg tw-font-medium 
                  ${pathName === route.path
                  ? 'tw-bg-primary tw-text-gray-50'
                  : 'tw-bg-transparent tw-text-gray-700 hover:tw-bg-gray-100 hover:tw-text-gray-900'
                  }`}
              >
                {route.icon}
                {route.name}
              </CommonStyles.Box>
            </Link>
          );
        })}
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default SideBar;
