"use client";
import React from "react";
import { Container, Grid2 } from "@mui/material";
import { default as CommonStyles } from "../../common";
import SelectField from "@/components/customReactFormField/SelectField";
import { SelectOption } from "@/interfaces/common";
import {
  american_express,
  UKFlag,
  VNFlag,
  apple_pay,
  bit_pay,
  discover,
  gg_pay,
  maestro,
  mater_card,
  paypal,
  sofort,
  visa,
} from "@/assets";
import CommonIcons from "@/components/CommonIcons";
import Link from "@/components/common/Link";

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
  const paymentMethod = [
    american_express,
    apple_pay,
    bit_pay,
    discover,
    gg_pay,
    mater_card,
    paypal,
    sofort,
    visa,
    maestro,
  ];

  const languageOptions: SelectOption[] = [
    {
      value: "value1",
      label: (
        <div className="tw-h-full tw-flex tw-items-center tw-gap-2">
          <img src={VNFlag.src} alt="" className="tw-w-[20px]" />{" "}
          <div>Vietnamese (VN)</div>
        </div>
      ),
    },
    {
      value: "value2",
      label: (
        <div className="tw-h-full tw-flex tw-items-center tw-gap-2">
          <img src={UKFlag.src} alt="" className="tw-w-[20px]" />{" "}
          <div>English (UK)</div>
        </div>
      ),
    },
  ];
const currencyOptions: SelectOption[] = [
  {
    value: 'USD',
    label: "U.S. Dollar ($)"
  },
  {
    value: 'VND',
    label: "V.N. Dong (VND)"
  },
]
  return (
    <div className="tw-bg-[#13253F]">
      <Container maxWidth="lg" className="tw-py-20">
        <Grid2 container spacing={12}>
          <Grid2 size={3} className="tw-flex tw-flex-col tw-gap-y-5">
            <FooterSection title="Language">
              <SelectField
              sx={{
                fieldSet: {
                  border: '1px solid var(--accent-gray-light)'
                }
              }}
                onChange={(e) => {}}
                defaultValue={"value2"}
                size="small"
                options={languageOptions}
                classNameContainer="tw-bg-transparent"
              />
            </FooterSection>
            <FooterSection title="Currency">
              <SelectField
              sx={{
                fieldSet: {
                  border: '1px solid var(--accent-gray-light)'
                }
              }}
                onChange={(e) => {}}
                defaultValue={"USD"}
                size="small"
                options={currencyOptions}
                classNameContainer="tw-bg-transparent"
              />
            </FooterSection>
          </Grid2>
          <Grid2 size={3}>
            <FooterSection title="Company">
              <CommonStyles.Typography
                type="size15Weight300"
                className="tw-flex tw-flex-col tw-gap-y-3"
              >
                <CommonStyles.Link href={"/"}>About Us</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>Blog</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>Press Room</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>Careers</CommonStyles.Link>
              </CommonStyles.Typography>
            </FooterSection>
          </Grid2>
          <Grid2 size={3}>
            <FooterSection title="Help">
              <CommonStyles.Typography className="tw-flex tw-flex-col tw-gap-y-3">
                <CommonStyles.Link href={"/"}>Contact Us</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>FAQs</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>
                  Term and conditions
                </CommonStyles.Link>
                <CommonStyles.Link href={"/"}>Privacy policy</CommonStyles.Link>
                <CommonStyles.Link href={"/"}>Sitemap</CommonStyles.Link>
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
            <FooterSection title="Company">
              <CommonStyles.Typography>
                Become a Tour guide for Us
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
            Copyright 2021 Tour Guide. All Rights Reserved
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
            {[
              { href: "", icon: <CommonIcons.Facebook1 />, bg: "#4B69B1" },
              { href: "", icon: <CommonIcons.Twitter1 />, bg: "#37B1E2" },
              { href: "", icon: <CommonIcons.Instagram1 />, bg: "#C23772" },
              { href: "", icon: <CommonIcons.Pinterest1 />, bg: "#E83F3A" },
            ].map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className={`tw-flex tw-items-center tw-justify-center tw-size-10 tw-rounded-full tw-bg-[${social.bg}]`}
              >
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
