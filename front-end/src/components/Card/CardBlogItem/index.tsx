import { Card, CardContent, CardMedia } from "@mui/material";
import { default as CommonStyles } from "../../common";
import React from "react";
import CommonIcons from "../../CommonIcons";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DriveEtaOutlinedIcon from "@mui/icons-material/DriveEtaOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
type Author = {
  avatar: string;
  name: string;
};
interface CardBlogItemProps {
  src?: string;
  title: string;
  author: Author;
  link?: string;
}
const CardBlogItem = (props: CardBlogItemProps) => {
  const { src, title, link, author, ...rest } = props;
  return (
    <Card className="tw-w-full tw-p-0 tw-rounded-lg">
      <CommonStyles.Box className="">
        <CardMedia
          className={`tw-min-h-[200px]`}
          sx={{ padding: "5px" }}
          image={src}
        />
      </CommonStyles.Box>
      <CardContent className="tw-flex tw-flex-col tw-gap-3">
        <CommonStyles.Box className="tw-flex tw-items-center tw-gap-2 tw-text-accent_gray_500">
          <CommonStyles.Avatar className="tw-size-6" src={author.avatar} />
          <CommonStyles.Typography
            type="size14Weight500"
            className="tw-leading-3"
          >
            {author.name}
          </CommonStyles.Typography>
        </CommonStyles.Box>
        <CommonStyles.Typography type="size18Weight600">{title}</CommonStyles.Typography>
      </CardContent>
    </Card>
  );
};

export default CardBlogItem;
