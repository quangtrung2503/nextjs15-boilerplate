import { FieldInputProps, FormikProps } from "formik";
import { AxiosResponse } from "axios";
import { FormikHelpers } from "formik";
import React, { ReactNode } from "react";

export interface SelectOption {
  key?: string;
  label: string | React.ReactNode;
  value: any;
}

export enum Order {
  desc = "desc",
  asc = "asc",
}

export type OrderType = Order.desc | Order.asc;

export interface CommonFilters {
  order?: OrderType;
  page?: number;
  perPage?: number;
  dateApplied?: string;
  createdAt?: string | null;
  userId?: number | null ;
  orderBy?: string | number | symbol;
  sortOrder?: string | number | symbol;
  sortField?: string | number | symbol;
  textSearch?: string | number | symbol;
}

export interface ResponseList<T> {
  currentPage: number;
  perPage: number;
  items: T;
  totalItems: number
  totalPage: number;
}
export interface ResponseCommon<T> {
  data: T;
  message: string;
  statusCode?: number;
  success: boolean;
}
