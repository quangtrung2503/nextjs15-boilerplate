"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { default as CommonStyles } from ".";


interface AccordionMUIProps {
  title: string;
  detail?: React.ReactNode;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowRightIcon color="inherit" fontSize="medium" />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#fff",
  paddingLeft: "25px",
  borderBottom: `1px solid #f4f4f5 !important`,
  flexDirection: "row",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transform: "rotate(90deg)",
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginRight: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingLeft: "25px",
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const AccordionMUI = (props: AccordionMUIProps) => {
  const { title, detail } = props;
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [showMore, setShowMore] = React.useState(false);


  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };


  return (
    <div className="tw-w-full tw-shadow-md tw-rounded-md tw-overflow-hidden">
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <CommonStyles.Typography type="size18Weight700">
            {title}
          </CommonStyles.Typography>
        </AccordionSummary>
        <AccordionDetails className="tw-flex tw-flex-col tw-items-start">
          {detail}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionMUI;
