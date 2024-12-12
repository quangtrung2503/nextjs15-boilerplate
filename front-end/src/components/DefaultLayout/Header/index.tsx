"use client";
import React, { useState, useEffect } from "react";
import { default as CommonStyles } from "../../common";
import Link from "next/link";
import CommonIcons from "@/components/CommonIcons";
import pageUrls from "@/constants/pageUrls";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

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
    { name: "Home", path: "/" },
    { name: "About Us", path: "/" },
    { name: "Popular Destinations", path: "/" },
    { name: "Our Packages", path: "/" },
    { name: "Help", path: "/" },
  ];

  return (
    <CommonStyles.Box
      className={`tw-px-10 tw-flex tw-justify-between tw-transition-all tw-duration-500 tw-items-center tw-h-header tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-50 transition-all ${
        isScrolled ? "tw-bg-white" : "tw-bg-transparent"
      }`}
    >
      <CommonIcons.Logo color={isScrolled ? "#333" : "white"} />
      <CommonStyles.Box className="tw-flex tw-items-center tw-gap-8">
        {menu.map((item, index) => {
          return (
            <CommonStyles.Typography key={index} type="size14Weight500">
              <Link
                className={`tw-no-underline ${
                  isScrolled ? "tw-text-black" : "tw-text-white"
                }`}
                href={item.path}
              >
                {item.name}
              </Link>
            </CommonStyles.Typography>
          );
        })}
        <CommonStyles.CommonButton onClick={()=>{router.push(pageUrls.SignIn)}} className="tw-px-10 tw-font-semibold">
          Sign In
        </CommonStyles.CommonButton>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Header;
