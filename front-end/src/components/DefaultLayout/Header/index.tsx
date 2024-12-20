"use client";
import Link from "next/link";
import { MenuItem, MenuList } from "@mui/material";
import React, { useState, useEffect, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import pageUrls from "@/constants/pageUrls";
import useAuth from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import MenuAcount from "./components/MenuAcount";
export interface AccountMenu {
  name: string | undefined;
  email: string | undefined;
  avatarUrl: string | undefined;
}
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { isLogged, user } = auth;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menu = [
    { name: t("navbar.home"), path: pageUrls.Homepage },
    { name: t("navbar.aboutUs"), path: pageUrls.Homepage },
    { name: t("navbar.popularDestinations"), path: pageUrls.Homepage },
    { name: t("navbar.ourPackages"), path: pageUrls.Homepage },
    { name: t("navbar.ourPackages"), path: pageUrls.Homepage },
  ];
  const accountMenu: AccountMenu = {
    name: user?.name,
    email: user?.email,
    avatarUrl: user?.avatar,
  };
  return (
    <CommonStyles.Box
      className={`tw-px-10 tw-flex tw-justify-between tw-transition-all tw-duration-500 tw-items-center tw-h-header tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-[1000] transition-all ${
        isScrolled || !(pathname === `${pageUrls.Homepage}en`)
          ? "tw-bg-white tw-shadow-lg"
          : "tw-bg-transparent"
      }`}
    >
      <CommonStyles.Link href={pageUrls.Homepage}>
        <CommonIcons.Logo
          color={
            isScrolled || !(pathname === `${pageUrls.Homepage}en`)
              ? "var(--accent-gray-dark)"
              : "white"
          }
        />
      </CommonStyles.Link>
      <CommonStyles.Box className="tw-flex tw-items-center tw-gap-8">
        {menu.map((item, index) => {
          return (
            <CommonStyles.Typography key={index} type="size15Weight600">
              <Link
                className={`tw-no-underline ${
                  isScrolled || !(pathname === `${pageUrls.Homepage}en`)
                    ? "tw-text-black"
                    : "tw-text-white"
                }`}
                href={item.path}
              >
                {item.name}
              </Link>
            </CommonStyles.Typography>
          );
        })}
        {!isLogged ? (
          <CommonStyles.CommonButton
            onClick={() => {
              router.push(pageUrls.SignIn);
            }}
            className="tw-px-10 tw-font-semibold"
          >
            {t("signInButton")}
          </CommonStyles.CommonButton>
        ) : (
          <CommonStyles.Box>
            <CommonStyles.PopoverMui
              body={<MenuAcount account={accountMenu} />}
              zIndex={1300}
              onClick={() => console.log("Popover clicked!")}
            >
              <CommonStyles.Avatar src={user?.avatar? user?.avatar : undefined} className="tw-cursor-pointer" />
            </CommonStyles.PopoverMui>
          </CommonStyles.Box>
        )}
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Header;
