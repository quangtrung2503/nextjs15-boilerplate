import DefaulLayout from "@/components/DefaultLayout";
import React from "react";
import { Roboto, Volkhov, Mulish } from '@next/font/google';

// Khai báo font
const volkhov = Volkhov({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700'],
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    // Sử dụng className của font vào container
    <div className={`${volkhov.className} ${mulish.className}`}>
      <DefaulLayout>
        <div>{children}</div>
      </DefaulLayout>
    </div>
  );
};

export default Layout;
