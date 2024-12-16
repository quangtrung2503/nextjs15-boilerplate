import React from "react";

export interface SelectOption {
  key?: string;
  label: string | React.ReactNode;
  value: any;
}
export interface ResponseCommon<T> {
  data: T;
  message: string;
  statusCode?: number;
  success: boolean;
}