import { Card, CardContent, CardMedia } from "@mui/material";
import { default as CommonStyles } from "../../common";
import React from "react";
import CommonIcons from "../../CommonIcons";
import { useTranslations } from "next-intl";
export interface CardGridItemProps {
  src: string;
  title: string;
  description?: string;
  link: string;
  price?: number;
  options?: [];
  feedback_quantity?: number;
  feedback_average?: number;
  plan?: string;
  duration: number;
  transport?: string;
}
const CardGridItem = (props: CardGridItemProps) => {
  const {
    src,
    title,
    description,
    link,
    price = 0,
    options,
    feedback_quantity = 0,
    feedback_average = 0,
    plan,
    duration = 0,
    transport,
    ...rest
  } = props;
  const t = useTranslations("card")
  return (
    <Card className="tw-w-full tw-p-0 tw-shadow-card">
      <CommonStyles.Link href={link} className="tw-w-full">
      <CommonStyles.Box className="tw-p-2">
        <CardMedia
          className={`tw-min-h-[180px]`}
          sx={{ padding: "5px" }}
          image={src}
        />
      </CommonStyles.Box>
      <CardContent className="tw-p-0">
        <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-5 tw-px-5">
          <CommonStyles.Typography type="size16Weight400">
            {title}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3 tw-text-accent_gray_800">
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-2">
              <CommonIcons.AccessTime className="tw-size-[19px]" />
              <CommonStyles.Typography type="size14Weight600">
                {t("duration")}{" "}
                {duration <= 24 && duration
                  ? `${duration} ${t("hours")}`
                  : `${duration / 24} ${t("days")}`}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-2">
              <CommonIcons.Car color="var(--accent-gray-800)" />
              <CommonStyles.Typography type="size14Weight600">
                {transport}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-2">
              <CommonIcons.PeopleAltOutlined className="tw-size-[20px]" />
              <CommonStyles.Typography type="size14Weight600">
                {plan}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Divider className="tw-pb-4" />
      </CardContent>
      <CommonStyles.Box className="tw-px-5 tw-py-2 tw-flex tw-items-center tw-justify-between">
        <CommonStyles.Box>
          <CommonStyles.Rating readOnly haveFeedback={false} valueTable={feedback_average} />
          <CommonStyles.Typography
            type="size12Weight600"
            className="tw-ml-[3px]"
            color="var(--accent-gray-500)"
          >
            {feedback_quantity} {t("reviews")}
          </CommonStyles.Typography>
        </CommonStyles.Box>
        <CommonStyles.Box>
          <CommonStyles.Typography
            type="size20Weight700"
            color="var(--primary)"
          >
            {t("currency")}
            {price?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CommonStyles.Typography>
          <CommonStyles.Typography
            type="size12Weight600"
            color="var(--accent-gray-500)"
          >
            {t("perPerson")}
          </CommonStyles.Typography>
        </CommonStyles.Box>
      </CommonStyles.Box>
      </CommonStyles.Link>
    </Card>
  );
};

export default CardGridItem;
