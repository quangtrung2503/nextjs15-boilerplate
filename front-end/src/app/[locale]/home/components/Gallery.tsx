import React, { useState } from "react";
import Heading from "./Heading";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import { CommonButton } from "@/components/common/Button";
import { commonImg } from "@/assets";
import { useTranslations } from "next-intl";
import useGetTourGallery from "@/services/modules/tour/hooks/useGetGalleryCustomer";
import { filter } from "lodash";
import apiUrls from "@/constants/apiUrls";

const Gallery = () => {
  const t = useTranslations("homePage");
  const { data, loading } = useGetTourGallery();
  const [showAll, setShowAll] = useState(false);

  const displayedImages = showAll ? data?.items : data?.items.slice(0, 8);

  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-12">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-items-center">
        <Heading title={t("galleryTitle")} des={t("subGalleryTitle")} />
        <CommonButton colorBtn="info" className="tw-w-44" onClick={() => setShowAll(!showAll)}>
          <CommonStyles.Typography type="size14Weight700">
            {showAll ? t("viewLessButton") : t("allImageButton")}
          </CommonStyles.Typography>
        </CommonButton>

      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-6">
        {displayedImages?.map((image, index) => {
          return (
            <CommonStyles.Box key={index} className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3">
              <img src={`${apiUrls.IMG_URL}/${image?.image}`} alt="" className="tw-w-full tw-h-80 tw-object-cover tw-rounded-lg" />
            </CommonStyles.Box>
          );
        })}
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Gallery;
