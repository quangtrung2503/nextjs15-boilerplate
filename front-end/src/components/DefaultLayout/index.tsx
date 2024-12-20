"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import pageUrls from "@/constants/pageUrls";
interface DefaultLayoutProps {
  children: React.ReactNode;
}
const DefaulLayout = (props: DefaultLayoutProps) => {
  const pathname = usePathname()
  const hideHeaderFooter = pathname.includes("sign") || pathname.includes("admin");
  
  const { children } = props;
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className={pathname === `${pageUrls.Homepage}en` ? "" : "tw-mt-header"}>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default DefaulLayout;
