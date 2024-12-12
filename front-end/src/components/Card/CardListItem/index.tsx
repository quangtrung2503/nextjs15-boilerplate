import { Card, CardContent, CardMedia } from "@mui/material";
import { default as CommonStyles } from "../../common";
import React from "react";
import CommonIcons from "../../CommonIcons";
interface CardListItemProps {
  src: string;
  title: string;
  description?: string;
  link?: string;
  price?: number;
  options?: [];
  activity?: string;
  feedback_quantity?: number;
  feedback_average?: number;
  plan?: string;
  duration: number;
  transport?: string;
}
const CardListItem = (props: CardListItemProps) => {
  const {
    src,
    title,
    description,
    link,
    price,
    options,
    feedback_quantity = 0,
    feedback_average = 0,
    plan,
    duration,
    transport,
    activity = "Water Activity",
    ...rest
  } = props;
  return (
    <Card className="tw-w-fit tw-p-0 tw-flex">
      <CommonStyles.Box className="tw-w-fit">
        <CardMedia
          className="tw-min-h-[150px] tw-aspect-square tw-rounded-r-sm"
          image={src}
        />
      </CommonStyles.Box>
      <CardContent className="tw-flex tw-gap-12 tw-items-center">
        <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3">
          <CommonStyles.Box className="tw-flex tw-gap-5">
            <CommonStyles.Typography className="tw-px-3 tw-py-1 tw-rounded-full tw-bg-primary tw-text-white">
              {activity}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-flex tw-items-center">
              <CommonStyles.Rating haveFeedback={false} readOnly valueTable={4} />
              <CommonStyles.Typography
                className="tw-ml-[2px]"
                color="var(--accent-gray-500)"
              >
                ({feedback_quantity} reviews)
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Typography type="size20Weight800">
            {title}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-items-center tw-gap-x-2 tw-text-accent_gray_800">
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.AccessTime className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {(duration <= 24 && duration) ? `${duration} hours` : `${(duration/24)} day`}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Divider orientation="vertical" className="tw-h-4" />
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.DriveEtaOutlined className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {transport}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Divider orientation="vertical" className="tw-h-4" />
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-1">
              <CommonIcons.PeopleAltOutlined className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {plan}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box>
          <CommonStyles.Typography
            type="size20Weight800"
            color="var(--primary)"
          >
            $
            {price?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CommonStyles.Typography>
          <CommonStyles.Typography color="var(--accent-gray-500)">
            per person
          </CommonStyles.Typography>
        </CommonStyles.Box>
      </CardContent>
    </Card>
  );
};

export default CardListItem;
