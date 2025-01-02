import React from "react";
import CommonStyles from "@/components/common";
import { useTranslations } from "next-intl";
import {
  CustomerReview,
} from "@/services/modules/tour/interfaces/tour";
import moment from "moment";

interface FeedbackData {
  items?: CustomerReview;
}

const FeedbackItem: React.FC<FeedbackData> = (props: FeedbackData) => {
  const t = useTranslations('cityTour.cityTourDetail');
  const { items } = props;
  const { User, rating, title, content, createdAt } = items ?? {};

  return (
    <CommonStyles.Box className="tw-py-5 tw-border-b">
      <CommonStyles.Box className="tw-flex tw-gap-10 tw-items-start">
        <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
          <CommonStyles.Avatar
            className="tw-border-solid tw-border-[4px] tw-border-white tw-shadow-lg"
            src={User?.avatar}
            alt={User?.name}
          />
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-1">
            <CommonStyles.Rating valueTable={rating} readOnly />
            <CommonStyles.Typography
              type="size15Weight600"
              className="tw-flex tw-items-center tw-gap-2"
            >
              {User?.name}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="size13Weight600"
              className="tw-text-accent_gray_500"
            >
              {createdAt ? moment(createdAt).format("D MMMM YYYY") : "Unknown Date"}
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-flex tw-justify-between tw-items-start tw-flex-1">
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-5 tw-w-full">
            <CommonStyles.Typography
              type="size15Weight700"
              className="tw-text-accent_gray_dark"
            >
              {title}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="size14Weight400"
              className="tw-text-accent_gray_800"
            >
              {content}
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default FeedbackItem;
