"use client";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { bgLogin } from "@/assets";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import Link from "@/components/common/Link";
import { CommonButton } from "@/components/common/Button";

import pageUrls from "@/constants/pageUrls";
import useAuth from "@/hooks/useAuth";
import LoginModel from "@/models/login.model";
import { useNotifications } from "@/helpers/toast";
import Loading from "@/components/common/Loading";
import { Role } from "@/helpers/common";

type FormValues = {
  email: string;
  password: string;
};

type ISignInProps = {
  path: string;
};

const SignIn = (props: ISignInProps) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const { showSuccess, showError, showInfo } = useNotifications();
  const auth = useAuth();
  const router = useRouter();
  const isLogged = auth?.isLogged;
  const isLogining = auth?.isLogining;
  const t = useTranslations("signIn");

  const handleForgot = () => {
    setIsLogin(false);
  };
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string()
          .email(t("validations.emailFormat"))
          .required(t("validations.emailRequire")),
        password: Yup.string().required(t("validations.passwordRequire")),
      })
    ),
  });
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const body = {
      email: values?.email,
      password: values?.password,
    };
    try {
      const requestPayload = LoginModel.parseBodyToRequest(body);
      const res = await auth?.signIn(requestPayload);
      showSuccess(t("loginSuccess"));
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  };
  console.log(auth);
  useEffect(() => {
    if (isLogged) {
      router.push(pageUrls.Homepage);
    }
  }, [isLogged]);
  if (!isLogining && isLogged) {
    return (
      <CommonStyles.Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <Loading />
      </CommonStyles.Box>
    );
  }
  return (
    <CommonStyles.Box className="tw-flex tw-items-center tw-justify-center">
      <img
        src={bgLogin.src}
        className="tw-fixed tw-inset-0 tw-w-full tw-min-h-screen tw-blur-sm"
        alt=""
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="tw-min-w-[800px] tw-bg-white tw-py-10 tw-rounded-xl tw-relative tw-z-50 tw-mt-10 "
      >
        <CommonStyles.Box className="tw-max-w-[400px] tw-flex tw-flex-col tw-items-center tw-gap-5 tw-mx-auto">
          <CommonStyles.Box>
            <CommonIcons.Logo color="var(--accent-gray-dark)" />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
            <CommonStyles.Typography
              type="size25Weight600"
              color="var(--accent-gray-dark)"
            >
              {t("metaTitle")}
            </CommonStyles.Typography>
            <CommonStyles.Typography color="var(--accent-gray-800)">
              {t("dontHaveAnAccount")}?{" "}
              <Link className="!tw-underline" href={pageUrls.SignUp}>
                {t("signUp")}
              </Link>
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-w-full tw-flex-col tw-gap-3">
            <CommonButton
              onClick={() => {
                showInfo(t("functionIsUnderDevelopment"));
              }}
              startIcon={<CommonIcons.FacebookLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("loginWithFacebook")}
            </CommonButton>
            <CommonButton
              onClick={() => {
                showInfo(t("functionIsUnderDevelopment"));
              }}
              startIcon={<CommonIcons.GoogleLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("loginWithGoogle")}
            </CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center tw-w-full tw-gap-3">
            <CommonStyles.Divider className="tw-flex-grow" />
            <CommonStyles.Typography
              textTransform={"uppercase"}
              color="var(--accent-gray-500)"
            >
              {t("or")}
            </CommonStyles.Typography>
            <CommonStyles.Divider className="tw-flex-grow tw-rounded-full" />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-w-full tw-flex tw-flex-col tw-gap-5">
            <RHFField
              name="email"
              control={control}
              sx={{
                fieldset: {
                  borderRadius: "20px",
                  width: "100%",
                  padding: 0,
                },
              }}
              component={InputField}
              label={t("emailLabel")}
            />
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-end tw-w-full">
              <RHFField
                name="password"
                control={control}
                sx={{
                  fieldset: {
                    borderRadius: "20px",
                    width: "100%",
                    padding: 0,
                  },
                }}
                type="password"
                component={InputField}
                label={t("passwordLabel")}
              />
              <CommonStyles.Link
                className="!tw-underline !tw-text-accent_gray_800 tw-mt-1"
                href={""}
              >
                {t("forgotPassword")}
              </CommonStyles.Link>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonButton
            loading={isLogining}
            className="tw-w-full tw-rounded-full tw-text-accent_gray_800"
            type="submit"
          >
            {t("signInButton")}
          </CommonButton>
        </CommonStyles.Box>
      </form>
    </CommonStyles.Box>
  );
};

export default SignIn;
