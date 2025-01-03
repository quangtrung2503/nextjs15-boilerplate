import { Booking } from "@/services/modules/booking/interfaces/booking";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import moment from "moment";
import apiUrls from "@/constants/apiUrls";
import Link from "next/link";
import pageUrls from "@/constants/pageUrls";

const ActionCell: React.FC<{
  row: Booking;
  t: any;
}> = ({ row, t }) => {
  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <Tooltip title={t("confirm")}>
            <Link href={`${pageUrls.Admin.confirmTour}/${row.id}`}
              className="tw-cursor-pointer tw-size-7"
            >
              <CommonIcons.ConfirmationNumberOutlined className="tw-text-blue-500" />
            </Link>
          </Tooltip>
        </>
      )}
    </CommonStyles.Box>
  );
};
interface FormValues {
  paid: number;
}
const PaidCell: React.FC<{ row: Booking }> = ({ row }) => {
  //State
  const [show, setShow] = useState(false);

  //Hook
  const methods = useForm<FormValues>({});

  //Function
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      alert(data);
    } catch (error) {}
  };
  return (
    <>
    {!show ? <Tooltip title="Update">
       <span className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize 
          ${
            row.status === "PENDING"
              ? "tw-text-yellow-500 tw-bg-yellow-100"
                : row.status === "CONFIRMED"
                  ? "tw-text-green-600 tw-bg-green-100"
                  : row.status === "COMPLETED"
                    ? "tw-text-green-700 tw-bg-green-200"
                    : row.status === "CANCELLED"
                      ? "tw-text-red-600 tw-bg-red-100"
                      : row.status === "REFUNDED"
                        ? "tw-text-gray-600 tw-bg-gray-100"
                        : "tw-text-red-500 tw-bg-red-100" // Default for unhandled statuses
          }`} onClick={() => setShow(!show)}>{row.amountPaid}</span>
    </Tooltip>
      : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RHFField
            onBlur={()=>setShow(!show)}
              className="tw-mb-3"
              name="paid"
              control={methods.control}
              component={InputField}
            />
          </form>
        </FormProvider>
      )}
    </>
  );
};
export const headCells = ({
  t,
}: {
  t: any;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Booking, _index: number) {
        return <span>{_index + 1}</span>;
      },
    },
    // {
    //   id: "bookingCode",
    //   label: t("bookingCode"),
    //   numeric: true,
    //   Cell(row: Booking, _index: number) {
    //     return <span>{row.bookingCode}</span>;
    //   },
    // },
    {
      id: "name",
      label: t("name"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <span>{row.User.name}</span>;
      },
    },
    {
      id: "tour",
      label: t("tour"),
      numeric: false,
      sxCell: { width: "200px" },
      Cell(row: Booking, _index: number) {
        return <Tooltip title={row.Tour.name}><span className='tw-line-clamp-3 tw-overflow-hidden tw-whitespace-normal tw-text-ellipsis'>{row.Tour.name}</span></Tooltip>;
      },
    },
    
    {
      id: "startDate",
      label: t("startDate"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <span>{moment(row.startDate).format("hh:mm DD/MM/YYYY")}</span>;
      },
    },
    
    {
      id: "endDate",
      label: t("endDate"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <span>{moment(row.endDate).format("hh:mm DD/MM/YYYY")}</span>;
      },
    },
    {
      id: "status",
      label: t("status"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return (
          <span
            className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize 
          ${
            row.status === "PENDING"
              ? "tw-text-yellow-500 tw-bg-yellow-100"
                : row.status === "CONFIRMED"
                  ? "tw-text-green-600 tw-bg-green-100"
                  : row.status === "COMPLETED"
                    ? "tw-text-green-700 tw-bg-green-200"
                    : row.status === "CANCELLED"
                      ? "tw-text-red-600 tw-bg-red-100"
                      : row.status === "REFUNDED"
                        ? "tw-text-gray-600 tw-bg-gray-100"
                        : "tw-text-red-500 tw-bg-red-100" // Default for unhandled statuses
          }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      id: "totalPrice",
      label: t("totalPrice"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <span>{row.totalPrice}</span>;
      },
    },
    {
      id: "amountPaid",
      label: t("amountPaid"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return (
          <CommonStyles.Box className="tw-flex">
            {row.PaymentProof.map((payment,index)=>{
              return (
                  <img key={index} className="tw-ml-2" width={50} src={`${apiUrls.IMG_URL}/${payment.image}`} />
              )
            })}
          </CommonStyles.Box>
        );
      },
    },
    {
      id: "actionBooking",
      label: t("action"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <ActionCell row={row} t={t} />;
      },
    },
  ];
};
