import { Box, Button } from "@mui/material";
import React, { useState } from "react";

interface Tab {
  label: string;
  value: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (tabValue: number) => void;
}

const Tabs: React.FC<TabsProps> = ({tabs, activeTab, onTabChange}) => {
  return (
    <Box className="tw-flex tw-flex-col">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          sx={{
            color: tab.value === activeTab ? "white" : "black",
            backgroundColor:
              tab.value === activeTab ? "var(--primary)" : "white",
            "&:hover": {
              backgroundColor:
                tab.value === activeTab ? "var(--primary)" : "white",
              cursor: "pointer",
            },
          }}
          className="tw-h-14 tw-border-none tw-py-0 tw-px-8 tw-justify-start tw-font-medium tw-rounded-none tw-normal-case"
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default Tabs;
