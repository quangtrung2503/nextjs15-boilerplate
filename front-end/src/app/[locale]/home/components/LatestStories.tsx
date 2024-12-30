import React from "react";
import Heading from "./Heading";
import { Container } from "@mui/material";
import { default as CommonStyles } from "@/components/common";
import { CommonButton } from "@/components/common/Button";
import CardBlogItem from "@/components/Card/CardBlogItem";
import { useTranslations } from "next-intl";
import useGetPostCustomer from "@/services/modules/post/hook/useGetPostCustomer";
import { Post } from "@/services/modules/post/interface/post";
import apiUrls from "@/constants/apiUrls";

const LatestStories = () => {
  const t = useTranslations("homePage");
  const { data: dataPost } = useGetPostCustomer();
  return (
    <CommonStyles.Box className="tw-flex tw-flex-col tw-w-full tw-gap-12">
      {/* <Container className="tw-flex tw-flex-col tw-gap-y-8"> */}
      <CommonStyles.Box className="tw-flex tw-justify-between tw-items-center">
        <Heading
          title={t("storyTitle")}
          des={t("subStoryTitle")}
        />
        <CommonButton colorBtn="info" className="tw-w-44">
          <CommonStyles.Typography type="size14Weight700">
            {t("allPostButton")}
          </CommonStyles.Typography>
        </CommonButton>
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-4">
        {dataPost?.items.map((item: Post, index) => {
          return (
            <CommonStyles.Box key={index} className="tw-col-span-3">
              <CardBlogItem
                src={`${apiUrls.IMG_URL}/${item?.image}`}
                author={{
                  avatar: item?.UserCreated?.[0]?.avatar || "",
                  name: item?.UserCreated?.[0]?.name || ""
                }}
                title={item?.title}
              />
            </CommonStyles.Box>
          );
        })}
      </CommonStyles.Box>
      {/* </Container> */}
    </CommonStyles.Box>
  );
};

export default LatestStories;
