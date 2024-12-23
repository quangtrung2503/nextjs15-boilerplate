import DefaultLayout from "@/components/DefaultLayout";
import { Volkhov, Mulish } from "next/font/google";
import React from "react";

const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className={`${volkhov.className} ${mulish.className}`}>
      <DefaultLayout>
        <div>{children}</div>
      </DefaultLayout>
    </div>
  );
};

export default Layout;
