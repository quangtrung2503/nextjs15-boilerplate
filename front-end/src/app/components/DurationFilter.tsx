"use client";
import * as React from "react";
import { SelectOption } from "@/interfaces/common";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { default as CommonStyles } from '@/components/common'
import AccordionMUI from "@/components/common/Accordion";
import { useTranslations } from "next-intl";


interface DurationAccordionProps {
  options: SelectOption[];
  onChange?: (selectedOptions: string[]) => void;
}

const DurationFilter: React.FC<DurationAccordionProps> = ({ options, onChange }) => {
  const t = useTranslations("cityTour")
  const [selectedDurations, setSelectedDurations] = React.useState<string[]>([]);
  const [showMore, setShowMore] = React.useState(false);

  const handleCheckboxChange = (value: string) => {
    setSelectedDurations((prev) => {
      const updatedDurations = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      if (onChange) {
        onChange(updatedDurations);
      }

      return updatedDurations;
    });
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleDurations = showMore ? options : options.slice(0, 7);

  return (
    <CommonStyles.Box>
      <AccordionMUI
        title={t("titleDuration")}
        detail={
          <>
            <FormGroup sx={{ width: "100%" }}>
              {visibleDurations.map((duration) => (
                <FormControlLabel
                  key={duration.value}
                  control={
                    <Checkbox
                      checked={selectedDurations.includes(duration.value)}
                      onChange={() => handleCheckboxChange(duration.value)}
                    />
                  }
                  label={duration.label}
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
                {showMore ? "Show Less Durations" : "Show More Durations"}
              </CommonStyles.Typography>
            )}
          </>
        }
      />
    </CommonStyles.Box>
  );
};

export default DurationFilter;
