import { Card, CardContent, CardMedia } from "@mui/material";
import { default as CommonStyles } from "../../common";
import React from "react";
import CommonIcons from "../../CommonIcons";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
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
  duration?: string;
  transport?: string;
}
const CardGridItem = (props: CardGridItemProps) => {
  const {
    src,
    title,
    description,
    link,
    price,
    options,
    feedback_quantity,
    feedback_average,
    plan,
    duration,
    transport,
    ...rest
  } = props;
  return (
    <Card className="w-fit">
      <CommonStyles.Box className="p-2">
      <CardMedia className={`min-h-[140px]`} sx={{padding: "5px"}} image={src} />
      </CommonStyles.Box>
      <CardContent className="flex flex-col gap-y-5 border-b">
        <CommonStyles.Typography type="size16Weight600">
          {title}
        </CommonStyles.Typography>
        <CommonStyles.Box className="flex flex-col gap-y-3">
          <CommonStyles.Box sx={{display: "flex", alignItems: "center", gap: "10px"}}>
            <AccessTimeIcon className="size-[16px]" />
            <CommonStyles.Typography type="size14Weight400">{duration}</CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box sx={{display: "flex", alignItems: "center", gap: "10px"}}>
            <DriveEtaOutlinedIcon className="size-[16px]" />
            <CommonStyles.Typography type="size14Weight400">{transport}</CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box sx={{display: "flex", alignItems: "center", gap: "10px"}}>
            <PeopleAltOutlinedIcon className="size-[16px]" />
            <CommonStyles.Typography type="size14Weight400">{plan}</CommonStyles.Typography>
          </CommonStyles.Box>  
        </CommonStyles.Box>
      </CardContent>
    </Card>
  );
};

export default CardGridItem;
