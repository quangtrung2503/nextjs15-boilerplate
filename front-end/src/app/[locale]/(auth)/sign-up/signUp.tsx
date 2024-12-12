"use client";
import * as Yup from "yup";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import { default as CommonStyles } from "@/components/common";
import Link from "@/components/common/Link";
import { CommonButton } from "@/components/common/Button";
import CommonIcons from "@/components/CommonIcons";

import { bgLogin } from "@/assets";
import pageUrls from "@/constants/pageUrls";
import SignUpModel from "@/models/signup.model";
import useAuth from "@/hooks/useAuth";
import { useNotifications } from "@/helpers/toast";
import Loading from "@/components/common/Loading";

type FormValues = {
  name: string;
  phone?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ISignUpProps = {
  path: string;
};

const SignUp = (props: ISignUpProps) => {
  const t = useTranslations("SignUp");
  const router = useRouter();
  const auth = useAuth();
  const isLogged = auth?.isLogged;
  const { showSuccess, showError, showInfo } = useNotifications();

  useEffect(() => {
    if (isLogged) {
      router.push(pageUrls.Homepage);
    }
  }, [isLogged]);
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(t("Validations.nameRequire")),
        phone: Yup.string().matches(
          /^[0-9]{10}$/,
          t("Validations.phoneFormat")
        ),
        email: Yup.string()
          .email(t("Validations.emailFormat"))
          .required(t("Validations.emailRequire")),
        password: Yup.string().required(t("Validations.passwordRequire")),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], t("Validations.passwordNotMatch"))
          .required(t("Validations.passwordRequire")),
      })
    ),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const body = {
      email: values?.email,
      password: values?.password,
      confirmPassword: values?.confirmPassword,
      name: values?.name,
      phone: values?.phone,
    };
    try {
      const requestPayload = SignUpModel.parseBodyToRequest(body);
      await auth?.signUp(requestPayload);
      router.push(pageUrls.SignIn);
      showSuccess(t("Sign up success"));
    } catch (error: any) {
      const err: any = error?.response.data.messages[0];
      showError(err);
    }
  };
  if (isLogged) {
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
        className="tw-min-w-[800px] tw-h-fit tw-drop-shadow-lg tw-bg-white tw-py-10 tw-rounded-xl tw-relative tw-z-50  tw-mb-10 tw-mt-10 "
      >
        <CommonStyles.Box className="tw-max-w-[500px] tw-flex tw-flex-col tw-items-center tw-gap-5 tw-mx-auto">
          <CommonStyles.Box>
            <CommonIcons.Logo color="var(--accent-gray-dark)" />
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-3 tw-items-center">
            <CommonStyles.Typography
              type="size25Weight600"
              color="var(--accent-gray-dark)"
            >
              {t("meta_title")}
            </CommonStyles.Typography>
            <CommonStyles.Typography color="var(--accent-gray-800)">
              {t("Already have an account")}?{" "}
              <Link className="!tw-underline" href={pageUrls.SignIn}>
                {t("Sign In")}
              </Link>
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-w-full tw-flex-col tw-gap-3">
            <CommonButton
              onClick={() => {
                showInfo(t("Function is under development"));
              }}
              startIcon={<CommonIcons.FacebookLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("Sign up with Facebook")}
            </CommonButton>
            <CommonButton
              onClick={() => {
                showInfo(t("Function is under development"));
              }}
              startIcon={<CommonIcons.GoogleLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("Sign up with Google")}
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
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-5 tw-w-full">
            <RHFField
              name="name"
              className="tw-col-span-6"
              control={control}
              sx={{
                fieldset: {
                  borderRadius: "20px",
                  width: "100%",
                  padding: 0,
                },
              }}
              component={InputField}
              label={t("Name label")}
            />
            <RHFField
              name="phone"
              className="tw-col-span-6"
              control={control}
              sx={{
                fieldset: {
                  borderRadius: "20px",
                  width: "100%",
                  padding: 0,
                },
              }}
              component={InputField}
              label={t("Phone label")}
            />
            <RHFField
              name="email"
              className="tw-col-span-12"
              control={control}
              sx={{
                fieldset: {
                  borderRadius: "20px",
                  width: "100%",
                  padding: 0,
                },
              }}
              component={InputField}
              label={t("Email label")}
            />
            <RHFField
              name="password"
              className="tw-col-span-12"
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
              label={t("Password label")}
            />
            <RHFField
              name="confirmPassword"
              className="tw-col-span-12"
              control={control}
              type="password"
              sx={{
                fieldset: {
                  borderRadius: "20px",
                  width: "100%",
                  padding: 0,
                },
              }}
              component={InputField}
              label={t("Confirm password label")}
            />
          </CommonStyles.Box>
          <CommonButton
            className="tw-w-full tw-rounded-full tw-text-accent_gray_800"
            type="submit"
          >
            {t("Sign up button")}
          </CommonButton>
        </CommonStyles.Box>
      </form>
    </CommonStyles.Box>
  );
};

export default SignUp;
