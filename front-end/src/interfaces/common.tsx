import React from "react";

export interface SelectOption {
  key?: string;
  label: string | React.ReactNode;
  value: any;
}
