"use client";
import React from "react";
import { Container, Grid2 } from "@mui/material";
import { default as CommonStyles } from "../../common";
import SelectField from "@/components/customReactFormField/SelectField";
import { SelectOption } from "@/interfaces/common";
import { commonImg } from "@/assets";
import CommonIcons from "@/components/CommonIcons";
import Link from "@/components/common/Link";
import { useTranslations } from "next-intl";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { useForm } from "react-hook-form";
interface FooterOption {
  language: string;
  currency: string;
}
const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3 tw-text-[var(--accent-gray-light)]">
    <CommonStyles.Typography color="white" type="size15Weight600">
      {title}
    </CommonStyles.Typography>
    {children}
  </CommonStyles.Box>
);

const Footer = () => {
  const t = useTranslations("footer");
  const paymentMethod = [
    commonImg.UKFlag,
    commonImg.VNFlag,
  ];
  const { handleSubmit, control, getValues } = useForm<FooterOption>({
    defaultValues: {
      language: "en",
      currency: "USD",
    },
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });
  const va = getValues("currency");
  const languageOptions: SelectOption[] = [
    {
      value: "vi",
      label: (
        <div className="tw-h-full tw-flex tw-items-center tw-gap-2">
          <img src={commonImg.VNFlag.src} alt="" className="tw-w-[20px]" />{" "}
          <div>{t("languageOptions.vi")}</div>
        </div>
      ),
    },
    {
      value: "en",
      label: (
        <div className="tw-h-full tw-flex tw-items-center tw-gap-2">
          <img src={commonImg.UKFlag.src} alt="" className="tw-w-[20px]" />{" "}
          <div>{t("languageOptions.en")}</div>
        </div>
      ),
    },
  ];
  const currencyOptions: SelectOption[] = [
    {
      value: "USD",
      label: t("currencyOptions.USD"),
    },
    {
      value: "VND",
      label: t("currencyOptions.VND"),
    },
  ];
  return (
    <div className="tw-bg-[#13253F]">
      <Container maxWidth="lg" className="tw-py-20">
        <Grid2 container spacing={12}>
          <Grid2 size={3} className="tw-flex tw-flex-col tw-gap-y-5">
            {/* <FooterSection title="Language">
              <SelectField
              sx={{
                fieldSet: {
                  border: '1px solid var(--accent-gray-light)'
                }
              }}
                onChange={(e) => {}}
                defaultValue={"value2"}
                size="small"
            <FooterSection title="Language">
              <RHFField
                name="language"
                control={control}
                sx={{
                  fieldSet: {
                    border: "1px solid var(--accent-gray-light)",
                  },
                }}
                // defaultValue={"en"}
                options={languageOptions}
                className="tw-text-[#FFFFFF99]"
                classNameContainer="tw-bg-transparent"
                component={SelectField}
              />
            </FooterSection> */}
            {/* <FooterSection title="Currency">
              <SelectField
              sx={{
                fieldSet: {
                  border: '1px solid var(--accent-gray-light)'
                }
              }}
                onChange={(e) => {}}
                defaultValue={"USD"}
                size="small"
            </FooterSection>
            <FooterSection title="Currency">
              <RHFField
                name="currency"
                control={control}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
                sx={{
                  fieldSet: {
                    border: "1px solid var(--accent-gray-light)",
                  },
                }}
                // defaultValue={"USD"}
                options={currencyOptions}
                className="tw-text-[#FFFFFF99]"
                classNameContainer="tw-bg-transparent"
                component={SelectField}
              />
            </FooterSection> */}
          </Grid2>
          <Grid2 size={3}>
            <FooterSection title={t("companyMenu.title")}>
              <CommonStyles.Typography
                type="size15Weight300"
                className="tw-flex tw-flex-col tw-gap-y-3"
              >
                <CommonStyles.Link href={"/"}>
                  {t("companyMenu.menu.aboutUs")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("companyMenu.menu.blog")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("companyMenu.menu.pressRoom")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("companyMenu.menu.careers")}
                </CommonStyles.Link>
              </CommonStyles.Typography>
            </FooterSection>
          </Grid2>
          <Grid2 size={3}>
            <FooterSection title={t("helpMenu.title")}>
              <CommonStyles.Typography className="tw-flex tw-flex-col tw-gap-y-3">
                <CommonStyles.Link href={"/"}>
                  {t("helpMenu.menu.contactUs")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("helpMenu.menu.faq")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("helpMenu.menu.termsAndConditions")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("helpMenu.menu.privacyPolicy")}
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  {t("helpMenu.menu.siteMap")}
                </CommonStyles.Link>
              </CommonStyles.Typography>
            </FooterSection>
          </Grid2>
          <Grid2 size={3} className="tw-flex tw-flex-col tw-gap-y-5">
            <FooterSection title="Payment method possible">
              <CommonStyles.Box className="tw-grid tw-grid-cols-5 tw-size-fit tw-gap-2">
                {paymentMethod.map((item) => (
                  <img key={item.src} src={item.src} alt="" />
                ))}
              </CommonStyles.Box>
            </FooterSection>
            <FooterSection title={t("companyDesMenu.title")}>
              <CommonStyles.Typography>
                {t("companyDesMenu.menu.des")}
              </CommonStyles.Typography>
            </FooterSection>
          </Grid2>
        </Grid2>
      </Container>
      <CommonStyles.Box className="tw-bg-[#00000033]">
        <Container
          maxWidth="lg"
          className="tw-py-3 tw-flex tw-items-center tw-justify-between"
        >
          <CommonStyles.Typography color="var(--accent-gray-light)">
            {t("copyRight")}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
            {[
              { href: "", icon: <CommonIcons.Facebook1 /> },
              { href: "", icon: <CommonIcons.Twitter1 /> },
              { href: "", icon: <CommonIcons.Instagram1 /> },
              { href: "", icon: <CommonIcons.Pinterest1 /> },
            ].map((social, index) => (
              <Link key={index} href={social.href}>
                {social.icon}
              </Link>
            ))}
          </CommonStyles.Box>
        </Container>
      </CommonStyles.Box>
    </div>
  );
};

export default Footer;
