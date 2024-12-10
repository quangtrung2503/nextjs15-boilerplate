import React from "react";
import Header from "./Header";
import Footer from "./Footer";
interface DefaultLayoutProps {
  children: React.ReactNode;
}
const DefaulLayout = (props: DefaultLayoutProps) => {
  const { children } = props;
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default DefaulLayout;
