import React from "react";
import Heading from "./Heading";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import { CommonButton } from "@/components/common/Button";
import CardBlogItem from "@/components/Card/CardBlogItem";
import { useTranslations } from "next-intl";

const LatestStories = () => {
  const t = useTranslations("homePage");
  return (
    <Container className="tw-flex tw-flex-col tw-gap-y-8">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-items-center">
        <Heading
          title={t("storyTitle")}
          des={t("subStoryTitle")}
        />
        <CommonButton colorBtn="info">{t("allPostButton")}</CommonButton>
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-4">
        {Array(4)
          .fill(null)
          .map((item, index) => {
            return (
              <CommonStyles.Box key={index} className="tw-col-span-3">
                <CardBlogItem
                  src="https://vietnam.travel/sites/default/files/inline-images/Ha%20Giang%20Loop-9.jpg"
                  author={{ avatar: "", name: "Jackie Moncada" }}
                  title="10 Proven Health Benefits of Cinnamon"
                />
              </CommonStyles.Box>
            );
          })}
      </CommonStyles.Box>
    </Container>
  );
};

export default LatestStories;
