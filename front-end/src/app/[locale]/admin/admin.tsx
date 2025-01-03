"use client";
import { commonImg } from "@/assets";
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
import { FormProvider, useForm } from "react-hook-form";
import useFiltersHandler from "@/hooks/useFiltersHandler";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SelectField from "./Component/customField/selectField";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}
const Admin = () => {
  const {
    filters,
    selected,
    setFilters,
    handleChangePage,
    handleChangeRowsPerPage: changeRowPerPage,
    handleRequestSort,
    handleSelectAllClick: handleSelectAll,
    handleCheckBox,
  } = useFiltersHandler({
    page: 1,
    perPage: 10,
  });
  const data = [
    { month: "Jan", value: 500, expenses: 200 },
    { month: "Feb", value: 200, expenses: 20 },
    { month: "Mar", value: 300, expenses: 30 },
    { month: "Apr", value: 400, expenses: 40 },
    { month: "Mar", value: 200, expenses: 100 },
    { month: "Jun", value: 400, expenses: 50 },
    { month: "Jul", value: 500, expenses: 80 },
    { month: "Aug", value: 800, expenses: 200 },
    { month: "Sep", value: 100, expenses: 230 },
    { month: "Sep", value: 300, expenses: 300 },
    { month: "Oct", value: 600, expenses: 150 },
    { month: "Nov", value: 40, expenses: 60 },
    { month: "Dec", value: 0, expenses: 20 },
    // Add more data as needed
  ];
  const dataTrans = [
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
    { order: "New order #242525", date: new Date() },
  ];
  const Transactions = {
    items: [
      {
        name: "JodDoe",
        status: "Pending",
        date: "2024-12-30T10:37:38.144Z",
        amount: 1523,
      },
      {
        name: "JodDoe1",
        status: "Done",
        date: "2024-12-30T10:37:38.144Z",
        amount: 1523,
      },
      {
        name: "JodDoe2",
        status: "Done",
        date: "2024-12-30T10:37:38.144Z",
        amount: 1523,
      },
      {
        name: "JodDoe3",
        status: "Done",
        date: "2024-12-30T10:37:38.144Z",
        amount: 1523,
      },
      {
        name: "JodDoe4",
        status: "Done",
        date: "2024-12-30T10:37:38.144Z",
        amount: 1523,
      },
    ],
    totalItems: 5,
  };
  const initValue = {
    month: "0",
  };
  interface FormValues {
    month: string
  }
  const methods = useForm<FormValues>({
    defaultValues: initValue,
  });
  const onSubmit = ()=>{

  }
  const searchOption = [
    {label: "AllData",value: "0"},
    {label: "Jan",value: "1"},
    {label: "Feb",value: "2"},
    {label: "Mar",value: "3"},
    {label: "Apr",value: "4"},
  ]
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
                Total revenue
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size48Weight700"
                className="tw-leading-[48px] tw-break-words"
              >
                {Number(1200000).toLocaleString('en-US')}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
              <CommonIcons.TrendingUp className="tw-text-[40px] tw-text-green-600" />
              <CommonStyles.Typography
                type="size20Weight700"
                className="tw-text-green-600 tw-leading-3"
              >
                +16%
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
                Total tours
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size48Weight700"
                className="tw-leading-[48px]"
              >
                1236
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
              <CommonIcons.TrendingUp className="tw-text-[40px] tw-text-green-600" />
              <CommonStyles.Typography
                type="size20Weight700"
                className="tw-text-green-600 tw-leading-3"
              >
                +26%
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>

        {/* <CommonStyles.Box
          className="tw-col-span-2 tw-flex tw-bg-white tw-rounded-xl tw-p-3 tw-justify-between"
          boxShadow="0px 4px 10px 0px #00000014"
        >
          <CommonStyles.Box>
            <CommonStyles.Box className="tw-size-10 tw-bg-primary tw-flex tw-items-center tw-justify-center tw-rounded-md">
              <CommonIcons.GridView className="tw-text-white" />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-mt-3">
              <CommonStyles.Typography
                type="size16Weight400"
                className="tw-text-gray-400 tw-font-bold"
              >
                Total offers
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size48Weight700"
                className="tw-leading-[48px]"
              >
                5423
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-flex tw-flex-col tw-items-center">
              <CommonIcons.TrendingUp className="tw-text-[40px] tw-text-green-600" />
              <CommonStyles.Typography
                type="size20Weight700"
                className="tw-text-green-600 tw-leading-3"
              >
                +8%
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        </CommonStyles.Box>
        <CommonStyles.Box
          className="tw-col-span-4 tw-bg-cover tw-bg-top tw-rounded-xl tw-px-10 tw-flex tw-items-center tw-justify-between"
          boxShadow="0px 4px 10px 0px #00000014"
          sx={{ backgroundImage: `url(${commonImg.bannerTrendingCity.src})` }}
        >
          <CommonStyles.Box>
            <CommonStyles.Typography
              type="size16Weight400"
              className="tw-text-gray-100"
            >
              Goal for this mont
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="size48Weight700"
              className="tw-text-white tw-leading-10"
            >
              120 Offers
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box>
            <CommonStyles.Typography
              type="size64Weight700"
              className="tw-text-white"
            >
              68%
            </CommonStyles.Typography>
          </CommonStyles.Box>
        </CommonStyles.Box> */}
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
              Report overview
            </CommonStyles.Typography>
            <CommonStyles.Typography>
              <span className="tw-text-blue-500">(+5) more</span> in 2024
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-center tw-mt-3">
            <AreaChart
              width={1000}
              height={400}
              data={data}
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
                ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800]}
                axisLine={{ stroke: "transparent" }}
              />
              <CartesianGrid strokeDasharray="3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="url(#colorValue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
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
              Orders overview
            </CommonStyles.Typography>
            <CommonStyles.Typography className="tw-text-gray-400">
              <span className="tw-text-blue-500">(+20) more</span> this month
            </CommonStyles.Typography>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-mt-5">
            <CommonStyles.Box className="tw-grid tw-gap-3">
              {dataTrans.map((trans, index) => {
                return (
                  <CommonStyles.Box key={index} className="tw-flex">
                    <CommonStyles.Box className="tw-relative">
                      <div className="tw-absolute tw-left-1/2 tw-top-0 tw-bottom-0 tw-w-[1.5px] tw-bg-gray-300 tw-transform tw-translate-x-[-50%] tw-translate-y-5 tw-h-[70%]" />
                      <CommonIcons.AcUnit className="tw-text-sm tw-text-primary" />
                    </CommonStyles.Box>
                    <CommonStyles.Box className="tw-ml-3">
                      <CommonStyles.Typography type="size16Weight400">
                        {trans.order}
                      </CommonStyles.Typography>
                      <CommonStyles.Typography className="tw-uppercase tw-font-bold tw-text-gray-400">
                        {moment(trans.date).format("DD MMM h:mm A")}
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
              Transactions
            </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-min-w-[150px]">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <CommonStyles.Box className="">
                  <RHFField
                  sx={{fieldset: {borderRadius: 20}}}
                    name="month"
                    control={methods.control}
                    component={SelectField}
                    options={searchOption}
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
                    <TableCell className="tw-font-bold tw-text-[16px]">Name</TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">Status</TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">Date</TableCell>
                    <TableCell className="tw-font-bold tw-text-[16px]">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Transactions.items.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell className="tw-text-[15px] tw-font-bold tw-text-gray-500" component="th" scope="row">{row.name}</TableCell>
                      <TableCell>
                      <CommonStyles.Box className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize 
                        ${row.status === "Done"
                          ? "tw-text-green-600 tw-bg-green-100"
                          : row.status === "Pending"
                          ? "tw-text-yellow-500 tw-bg-yellow-100"
                          : "tw-text-red-500 tw-bg-red-100"
                        }`}>
                        {row.status}
                      </CommonStyles.Box>
                      </TableCell>
                      <TableCell className="tw-text-[15px] tw-font-bold tw-text-gray-500">{moment(row.date).format("hh:mm DD/MM/YYYY")}</TableCell>
                      <TableCell className="tw-text-[15px] tw-font-bold tw-text-green-500">+ ${row.amount}</TableCell>
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
