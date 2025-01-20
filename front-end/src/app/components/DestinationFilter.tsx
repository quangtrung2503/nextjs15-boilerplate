"use client";
import * as React from "react";
import { SelectOption } from "@/interfaces/common";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { default as CommonStyles } from '@/components/common'
import AccordionMUI from "@/components/common/Accordion";
import { useTranslations } from "next-intl";


interface DestinationAccordionProps {
  options: SelectOption[];
  onChange?: (selectedOptions: string[]) => void;
}

const DestinationFilter: React.FC<DestinationAccordionProps> = ({ options, onChange }) => {
  const t = useTranslations("cityTour")
  const [selectedDestinations, setSelectedDestinations] = React.useState<string[]>([]);
  const [showMore, setShowMore] = React.useState(false);

  const handleCheckboxChange = (value: string) => {
    setSelectedDestinations((prev) => {
      const updatedDestinations = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      if (onChange) {
        onChange(updatedDestinations);
      }

      return updatedDestinations;
    });
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleDestinations = showMore ? options : options.slice(0, 7);

  return (
    <CommonStyles.Box>
      <AccordionMUI
        title={t("titleDestination")}
        detail={
          <>
            <FormGroup sx={{ width: "100%" }}>
              {visibleDestinations.map((destination) => (
                <FormControlLabel
                  key={destination.value}
                  control={
                    <Checkbox
                      checked={selectedDestinations.includes(destination.value)}
                      onChange={() => handleCheckboxChange(destination.value)}
                    />
                  }
                  label={destination.label}
                />
              ))}
            </FormGroup>
            {options.length > 7 && (
              <CommonStyles.Typography
                type="size14Weight700"
                className="tw-cursor-pointer tw-mt-3"
                color="#7BBCB0"
                onClick={handleShowMore}
              >
                {showMore ? "Show Less Destinations" : "Show More Destinations"}
              </CommonStyles.Typography>
            )}
          </>
        }
      />
    </CommonStyles.Box>
  );
};

export default DestinationFilter;
