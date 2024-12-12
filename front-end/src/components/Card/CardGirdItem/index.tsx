import { Card, CardContent, CardMedia } from "@mui/material";
import { default as CommonStyles } from "../../common";
import React from "react";
import CommonIcons from "../../CommonIcons";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DriveEtaOutlinedIcon from "@mui/icons-material/DriveEtaOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
interface CardGridItemProps {
  src: string;
  title: string;
  description?: string;
  link?: string;
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
  return (
    <Card className="tw-w-full tw-p-0">
      <CommonStyles.Box className="tw-p-2">
        <CardMedia
          className={`tw-min-h-[140px]`}
          sx={{ padding: "5px" }}
          image={src}
        />
      </CommonStyles.Box>
      <CardContent className="tw-p-0">
        <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-5 tw-px-5">
          <CommonStyles.Typography type="size16Weight600">
            {title}
          </CommonStyles.Typography>
          <CommonStyles.Box className="tw-flex tw-flex-col tw-gap-y-3 tw-text-accent_gray_800">
            <CommonStyles.Box
              sx={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <AccessTimeIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                Duration{" "}
                {duration <= 24 && duration
                  ? `${duration} hours`
                  : `${duration / 24} day`}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box
              sx={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <DriveEtaOutlinedIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {transport}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box
              sx={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <PeopleAltOutlinedIcon className="tw-size-[16px]" />
              <CommonStyles.Typography type="size14Weight400">
                {plan}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Divider className="tw-pb-4" />
      </CardContent>
      <CommonStyles.Box className="tw-px-5 tw-py-2 tw-flex tw-items-start tw-justify-between">
        <CommonStyles.Box>
          <CommonStyles.Rating haveFeedback={false} valueTable={4} />
          <CommonStyles.Typography
            className="tw-ml-[2px]"
            color="var(--accent-gray-500)"
          >
            {feedback_quantity} reviews
          </CommonStyles.Typography>
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
      </CommonStyles.Box>
    </Card>
  );
};

export default CardGridItem;
