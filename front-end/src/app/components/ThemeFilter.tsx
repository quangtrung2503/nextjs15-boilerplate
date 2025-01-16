"use client";
import * as React from "react";
import { SelectOption } from "@/interfaces/common";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { default as CommonStyles } from '@/components/common'
import AccordionMUI from "@/components/common/Accordion";
import { useTranslations } from "next-intl";


interface ThemeAccordionProps {
  options: SelectOption[];
  onChange?: (selectedOptions: string[]) => void;
}

const ThemeFilter: React.FC<ThemeAccordionProps> = ({ options, onChange }) => {
  const t = useTranslations("cityTour")
  const [selectedThemes, setSelectedThemes] = React.useState<string[]>([]);
  const [showMore, setShowMore] = React.useState(false);

  const handleCheckboxChange = (value: string) => {
    setSelectedThemes((prev) => {
      const updatedThemes = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      if (onChange) {
        onChange(updatedThemes);
      }

      return updatedThemes;
    });
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleThemes = showMore ? options : options.slice(0, 7);

  return (
    <CommonStyles.Box>
      <AccordionMUI
        title={t("titleTheme")}
        detail={
          <>
            <FormGroup sx={{ width: "100%" }}>
              {visibleThemes.map((theme) => (
                <FormControlLabel
                  key={theme.value}
                  control={
                    <Checkbox
                      checked={selectedThemes.includes(theme.value)}
                      onChange={() => handleCheckboxChange(theme.value)}
                    />
                  }
                  label={theme.label}
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
                {showMore ? "Show Less Themes" : "Show More Themes"}
              </CommonStyles.Typography>
            )}
          </>
        }
      />
    </CommonStyles.Box>
  );
};

export default ThemeFilter;
