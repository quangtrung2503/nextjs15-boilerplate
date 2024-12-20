import React from "react";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";

type FeedbackData = {
  avatar: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  isVerified: boolean;
  helpful: boolean;
};

type Props = {
  feedback: FeedbackData;
};

const FeedbackItem: React.FC<Props> = ({ feedback }) => {
  const {
    avatar,
    name,
    rating,
    date,
    title,
    content,
    isVerified,
    helpful,
  } = feedback;

  return (
    <div className="tw-py-5 tw-border-b">
      <CommonStyles.Box className="tw-flex tw-gap-10 tw-items-start">
        <CommonStyles.Box className="tw-flex tw-items-center tw-gap-5">
          <CommonStyles.Avatar
            className="tw-border-solid tw-border-[4px] tw-border-white tw-shadow-lg"
            src={avatar}
            alt={name}
          />
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-1">
            <CommonStyles.Rating valueTable={rating} readOnly />
            <CommonStyles.Typography
              type="size15Weight600"
              className="tw-flex tw-items-center tw-gap-2"
            >
              {name}
              {isVerified && (
                <CommonIcons.DoneAllRounded className="tw-text-primary" />
              )}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="size13Weight600"
              className="tw-text-accent_gray_500"
            >
              {date}
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box className="tw-flex tw-justify-between tw-items-start tw-flex-1">
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-5 tw-w-3/4">
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
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
            <CommonStyles.Typography type="size13Weight600">
              Helpful?
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="size13Weight600"
              className={
                helpful ? "tw-text-primary" : "tw-text-accent_gray_500"
              }
            >
              {helpful ? "Yes" : "No"}
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
    </div>
  );
};

export default FeedbackItem;
