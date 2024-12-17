import React from "react";
import Heading from "./Heading";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import { CommonButton } from "@/components/common/Button";
import {
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
} from "@/assets";
import { useTranslations } from "next-intl";

const Gallery = () => {
  const t = useTranslations("homePage");
  const images = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
  ];
  return (
    <Container className="tw-flex tw-flex-col tw-gap-y-5">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-items-center">
        <Heading
          title={t("galleryTitle")}
          des={t("subGalleryTitle")}
        />
        <CommonButton colorBtn="info">{t("allImageButton")}</CommonButton>
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-4">
        {images.map((image, index) => {
          return (
            <CommonStyles.Box key={index} className="tw-col-span-3">
              <img src={image.src} alt="" />
            </CommonStyles.Box>
          );
        })}
      </CommonStyles.Box>
    </Container>
  );
};

export default Gallery;
