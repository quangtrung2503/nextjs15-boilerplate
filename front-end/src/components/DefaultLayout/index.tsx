"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import useAuth from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
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
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default DefaulLayout;
