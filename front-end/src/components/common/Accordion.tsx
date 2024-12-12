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
import { SelectOption } from "@/interfaces/common";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { default as CommonStyles } from ".";

interface AccordionMUIProps {
  title: string;
  options: SelectOption[];
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
  const { title, options } = props;
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [showMore, setShowMore] = React.useState(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleOptions = showMore ? options : options.slice(0, 7);

  return (
    <div className="tw-w-full tw-shadow-md tw-rounded-md tw-overflow-hidden">
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <CommonStyles.Typography type="size16Weight600">
            {title}
          </CommonStyles.Typography>
        </AccordionSummary>
        <AccordionDetails className="tw-flex tw-flex-col tw-items-start">
          <FormGroup sx={{ width: "100%" }}>
            {visibleOptions.map((item: SelectOption, index) => (
              <FormControlLabel
                sx={{
                  width: "100%",
                  paddingY: "3px",
                  boxShadow: "5px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", 
                  },
                }}
                key={index}
                control={<Checkbox />}
                label={item.label}
              />
            ))}
          </FormGroup>
          {options.length > 7 && (
            <CommonStyles.Typography
              type="size14Weight700"
              className="tw-!cursor-pointer tw-mt-3"
              color="#7BBCB0"
              onClick={handleShowMore}
            >
              {showMore ? "Show Less" : "Show More"}
            </CommonStyles.Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionMUI;
