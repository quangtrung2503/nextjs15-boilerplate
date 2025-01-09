"use client";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import RHFField from "@/components/customReactFormField/ReactFormField";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useFiltersHandler from "@/hooks/useFiltersHandler";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useGetStatTotalBookingRevenue from "@/services/modules/stats/hook/useGetStatTotalBookingRevenue";
import useGetStatMonthly from "@/services/modules/stats/hook/useGetStatMonthly";
import useGetStatNewBookings from "@/services/modules/stats/hook/useGetStatNewBookings";
import { isNumber } from "lodash";
import { CommonDatePicker } from "./Component/customField/datePickerField";
import { DateTimeFormat } from "@/helpers/common";
import { useTranslations } from "next-intl";

const Admin = () => {
  //State & props
  const initValue = {
    month: undefined,
  };
  interface FormValues {
    month: string;
  }

  //Hook
  const { filters,setFilters } = useFiltersHandler({
    year: new Date().getFullYear(),
  });
  const { data: dataBookingRevenue } = useGetStatTotalBookingRevenue();
  const { data: dataStatMonthly } = useGetStatMonthly(filters);
  const { data: dataStatNewBookings } = useGetStatNewBookings(filters);
  const methods = useForm<FormValues>({
    defaultValues: initValue,
  });
  const t = useTranslations("adminDashboard")
  
  
  //Function
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setFilters((prev) => {
      return {
        ...prev,
        dateApplied: moment(data.month).format(DateTimeFormat.DateYearMonthDash)
      }
    })
  };
  const handleChange = async ()=>{
    await methods.handleSubmit(onSubmit)();
  }

  //Render
  return (
    <CommonStyles.Box className="tw-p-5 tw-text-black">
      <CommonStyles.Box className="tw-grid tw-grid-cols-11 tw-gap-5">
        <CommonStyles.Box
          className="tw-col-span-3 tw-flex tw-bg-white tw-rounded-xl tw-p-5 tw-justify-between"
          boxShadow="0px 4px 10px 0px #00000014"
        >
          <CommonStyles.Box>
            <CommonStyles.Box className="tw-size-10 tw-bg-primary tw-flex tw-items-center tw-justify-center tw-rounded-md">
              <CommonIcons.AccountBalanceOutlined className="tw-text-white" />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-mt-3">
              <CommonStyles.Typography
                type="size16Weight400"
                className="tw-text-gray-400 tw-font-bold"
              >
                {t("totalRevenue")}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size48Weight700"
                className="tw-leading-[48px] tw-break-words"
              >
                {dataBookingRevenue?.data.revenue.current.toLocaleString(
                  "en-US",
                )}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
            {isNumber(dataBookingRevenue?.data.revenue.growthRate) && (
              dataBookingRevenue?.data.revenue.growthRate > 0 ? (
                <CommonIcons.TrendingUp className="tw-text-[40px] tw-text-green-600" />
              ) : dataBookingRevenue?.data.revenue.growthRate < 0 ? (
                <CommonIcons.TrendingDown className="tw-text-[40px] tw-text-red-600" />
              ) : null
            )}
              <CommonStyles.Typography
                type="size20Weight700"
                className={`${dataBookingRevenue?.data.revenue.growthRate && dataBookingRevenue?.data.revenue.growthRate >= 0 ? "tw-text-green-600" : "tw-text-red-600"} tw-leading-3`}
              >
                {dataBookingRevenue?.data.revenue.growthRate}%
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>

        <CommonStyles.Box
          className="tw-col-span-3 tw-flex tw-bg-white tw-rounded-xl tw-p-5 tw-justify-between"
          boxShadow="0px 4px 10px 0px #00000014"
        >
          <CommonStyles.Box>
            <CommonStyles.Box className="tw-size-10 tw-bg-primary tw-flex tw-items-center tw-justify-center tw-rounded-md">
              <CommonIcons.TourOutlined className="tw-text-white" />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-mt-3">
              <CommonStyles.Typography
                type="size16Weight400"
                className="tw-text-gray-400 tw-font-bold"
              >
                {t("totalBookings")}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size48Weight700"
                className="tw-leading-[48px]"
              >
                {dataBookingRevenue?.data.bookings.current}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
              {isNumber(dataBookingRevenue?.data.revenue.growthRate) && (
                dataBookingRevenue?.data.revenue.growthRate > 0 ? (
                  <CommonIcons.TrendingUp className="tw-text-[40px] tw-text-green-600" />
                ) : dataBookingRevenue?.data.revenue.growthRate < 0 ? (
                  <CommonIcons.TrendingDown className="tw-text-[40px] tw-text-red-600" />
                ) : null
              )}
              <CommonStyles.Typography
                type="size20Weight700"
                className={`${dataBookingRevenue?.data.bookings.growthRate && dataBookingRevenue?.data.bookings.growthRate >= 0 ? "tw-text-green-600" : "tw-text-red-600"} tw-leading-3`}
              >
                {dataBookingRevenue?.data.bookings.growthRate}%
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-5 tw-mt-5">
        <CommonStyles.Box
          boxShadow="0px 4px 10px 0px #00000014"
          className="tw-col-span-9 tw-bg-white tw-rounded-lg tw-p-5"
        >
          <CommonStyles.Box>
            <CommonStyles.Typography
              type="size20Weight600"
              className="tw-font-bold"
            >
              {t("reportOverview")}
            </CommonStyles.Typography>
            {/* <CommonStyles.Typography>
              <span className="tw-text-blue-500">(+5) more</span> in 2024
            </CommonStyles.Typography> */}
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-center tw-mt-3">
            <AreaChart
              width={1000}
              height={400}
              data={dataStatMonthly?.data.monthlyStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tick={{ fontSize: 14, fill: "gray", fontWeight: "bold" }}
                dataKey="month"
                axisLine={{ stroke: "transparent" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 14, fill: "gray", fontWeight: "bold" }}
                tickLine={false}
                // ticks={[
                //   0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,
                //   1200, 1300, 1400, 1500, 1600,
                // ]}
                axisLine={{ stroke: "transparent" }}
              />
              <CartesianGrid strokeDasharray="3" />
              <Tooltip/>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="url(#colorValue)"
              />
              <Area
                type="monotone"
                dataKey="bookingCount"
                stroke="#82ca9d"
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box
          boxShadow="0px 4px 10px 0px #00000014"
          className="tw-col-span-3 tw-bg-white tw-rounded-lg tw-p-5"
        >
          <CommonStyles.Box>
            <CommonStyles.Typography type="size18Weight500">
              {t("ordersOverview")}
            </CommonStyles.Typography>
            {isNumber(dataStatNewBookings?.totalItems) &&
              dataStatNewBookings.totalItems > 7 && (
                <CommonStyles.Typography className="tw-text-gray-400">
                  <span className="tw-text-blue-500">
                    (+{dataStatNewBookings.totalItems - 7}) {t("more")}
                  </span>{" "}
                  {t("thisMonth")}
                </CommonStyles.Typography>
              )}
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-mt-5">
            <CommonStyles.Box className="tw-grid tw-gap-3">
              {dataStatNewBookings?.items.map((newBooking, index) => {
                return (
                  <CommonStyles.Box key={index} className="tw-flex">
                    <CommonStyles.Box className="tw-relative">
                      <div className="tw-absolute tw-left-1/2 tw-top-0 tw-bottom-0 tw-w-[1.5px] tw-bg-gray-300 tw-transform tw-translate-x-[-50%] tw-translate-y-5 tw-h-[70%]" />
                      <CommonIcons.AcUnit className="tw-text-sm tw-text-primary" />
                    </CommonStyles.Box>
                    <CommonStyles.Box className="tw-ml-3">
                      <CommonStyles.Typography type="size16Weight400">
                        {newBooking.bookingCode}
                      </CommonStyles.Typography>
                      <CommonStyles.Typography className="tw-uppercase tw-font-bold tw-text-gray-400">
                        {moment(newBooking.createdAt).format(DateTimeFormat.DateTime24h)}
                      </CommonStyles.Typography>
                    </CommonStyles.Box>
                  </CommonStyles.Box>
                );
              })}
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
      <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-5 tw-mt-5">
        <CommonStyles.Box
          boxShadow="0px 4px 10px 0px #00000014"
          className="tw-col-span-12 tw-bg-white tw-rounded-lg tw-p-5"
        >
          <CommonStyles.Box className="tw-justify-between tw-flex">
            <CommonStyles.Box className="tw-flex-1">
              <CommonStyles.Typography
                type="size20Weight600"
                className="tw-font-bold"
              >
                {t("transactions")}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-min-w-[150px]">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <CommonStyles.Box className="">
                    <RHFField
                      sx={{ fieldset: { borderRadius: 20 } }}
                      name="month"
                      control={methods.control}
                      component={CommonDatePicker}
                      onClose={handleChange}
                      views={["month","year"]}
                      format={DateTimeFormat.NameMonthYear}
                    />
                  </CommonStyles.Box>
                </form>
              </FormProvider>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tw-font-bold tw-text-[16px]">
                      {t("name")}
                    </TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">
                      {t("status")}
                    </TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">
                      {t("date")}
                    </TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">
                      {t("amount")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataStatNewBookings?.items.map((row) => (
                    <TableRow
                      key={row.bookingCode}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        className="tw-text-[15px] tw-font-bold tw-text-gray-500"
                        component="th"
                        scope="row"
                      >
                        {row.User.name}
                      </TableCell>
                      <TableCell>
                        <CommonStyles.Box
                          className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize 
                        ${
                          row.status === "COMPLETED"
                            ? "tw-text-green-600 tw-bg-green-100"
                            : row.status === "PENDING"
                              ? "tw-text-yellow-500 tw-bg-yellow-100"
                              : row.status === "CONFIRMED"
                              ? "tw-text-blue-500 tw-bg-blue-100"
                              : "tw-text-red-500 tw-bg-red-100"
                        }`}
                        >
                          {row.status}
                        </CommonStyles.Box>
                      </TableCell>
                      <TableCell className="tw-text-[15px] tw-font-bold tw-text-gray-500">
                        {moment(row.createdAt).format(DateTimeFormat.DateTime24hReverse)}
                      </TableCell>
                      <TableCell className="tw-text-[15px] tw-font-bold tw-text-green-500">
                        + {row.amountPaid}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CommonStyles.Box>
        </CommonStyles.Box>
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Admin;
