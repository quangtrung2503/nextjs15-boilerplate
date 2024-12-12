"use client";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import { default as CommonStyles } from "@/components/common";
import { bgLogin } from "@/assets";
import CommonIcons from "@/components/CommonIcons";
import Link from "@/components/common/Link";
import { CommonButton } from "@/components/common/Button";
import pageUrls from "@/constants/pageUrls";

type FormValues = {
  email: string;
  password: string;
};

type ISignInProps = {
  path: string;
};

const SignIn = (props: ISignInProps) => {
  const t = useTranslations("SignIn");
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string().required("Password is required"),
      })
    ),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Data:", data);
  };

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
              {t("meta_title")}
            </CommonStyles.Typography>
            <CommonStyles.Typography color="var(--accent-gray-800)">
              {t("Don't have an account")}?{" "}
              <Link className="!tw-underline" href={pageUrls.SignUp}>
                {t("Sign Up")}
              </Link>
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-w-full tw-flex-col tw-gap-3">
            <CommonButton
              startIcon={<CommonIcons.FacebookLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("Login with Facebook")}
            </CommonButton>
            <CommonButton
              startIcon={<CommonIcons.GoogleLogin />}
              variant="outlined"
              className="tw-rounded-full tw-border-accent_gray_500 tw-bg-white"
            >
              {t("Login with Google")}
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
              label={t("Email label")}
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
                component={InputField}
                label={t("Password label")}
              />
              <CommonStyles.Link
                className="!tw-underline !tw-text-accent_gray_800 tw-mt-1"
                href={""}
              >
                Forgot password
              </CommonStyles.Link>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonButton
            className="tw-w-full tw-rounded-full tw-text-accent_gray_800"
            type="submit"
          >
            {t("Sign in button")}
          </CommonButton>
        </CommonStyles.Box>
      </form>
    </CommonStyles.Box>
  );
};

export default SignIn;
