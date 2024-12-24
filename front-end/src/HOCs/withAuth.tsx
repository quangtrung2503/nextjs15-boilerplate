

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KEY_TOKEN } from "@/services/httpService";
import pageUrls from "@/constants/pageUrls";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const RequiresAuthentication: React.FC<P> = (props) => {
    const router = useRouter();
    const isLoggedIn =
      typeof window !== "undefined" && localStorage.getItem(KEY_TOKEN); // Kiểm tra token trong localStorage

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace(pageUrls.SignIn); // Chuyển hướng về trang login nếu chưa đăng nhập
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
      return null; // Hoặc hiển thị loader trong lúc chuyển hướng
    }

    return <WrappedComponent {...props} />;
  };

  return RequiresAuthentication;
};

export default withAuth;