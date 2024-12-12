"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
interface DefaultLayoutProps {
  children: React.ReactNode;
}
const DefaulLayout = (props: DefaultLayoutProps) => {
  const currentLocation = window.location;
  const hideHeaderFooter = currentLocation.pathname.includes("auth");

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
