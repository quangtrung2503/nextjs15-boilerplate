import DefaulLayout from "@/components/DefaultLayout";
import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <DefaulLayout>
      <div>{children}</div>
    </DefaulLayout>
  );
};

export default Layout;
