import { Booking } from "@/services/modules/booking/interfaces/booking";
import CommonStyles from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { Tooltip } from "@mui/material";
import moment from "moment";
import { DateTimeFormat } from "@/helpers/common";
import { isEmpty } from "lodash";

const ActionCell: React.FC<{
  row: Booking;
  handleRefundBooking: (id: number) => void;
  t: any;
}> = ({ row, handleRefundBooking, t }) => {
  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <Tooltip title={t("confirm")}>
            <CommonStyles.Box
              onClick={() => handleRefundBooking(Number(row.id))}
              className="tw-cursor-pointer tw-size-7"
            >
              <CommonIcons.CurrencyExchange className="tw-text-blue-500" />
            </CommonStyles.Box>
          </Tooltip>
        </>
      )}
    </CommonStyles.Box>
  );
};

const StatusCell = ({row,content}: {row: Booking,content: string})=>{
    switch (row.status) {
      case "CONFIRMED":
        return <span className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize tw-text-green-600 tw-bg-green-100`}>
        {content}
      </span>
      case "COMPLETED":
      return <span className={`tw-flex tw-w-fit tw-items-center tw-rounded-full tw-py-1 tw-px-4 tw-text-sm tw-font-medium tw-capitalize tw-text-blue-600 tw-bg-blue-100`}>
        {content}
      </span>
      default:
        break;
    }
}
export const headCells = ({
  handleRefundBooking,
  t,
}: {
  handleRefundBooking: (id: number) => void;
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
    {
      id: "bookingCode",
      label: t("bookingCode"),
      numeric: true,
      Cell(row: Booking, _index: number) {
        return <span>{row.bookingCode}</span>;
      },
    },
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
        return <span>{moment(row.startDate).format(DateTimeFormat.DateTime24hReverse)}</span>;
      },
    },
    
    {
      id: "endDate",
      label: t("endDate"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <span>{moment(row.endDate).format(DateTimeFormat.DateTime24hReverse)}</span>;
      },
    },
    {
      id: "status",
      label: t("status"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        return <StatusCell row={row} content={row.status}/>;
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
    // {
    //   id: "amountPaid",
    //   label: t("amountPaid"),
    //   numeric: false,
    //   Cell(row: Booking, _index: number) {
    //   return <StatusCell row={row} content={row.amountPaid.toString()} />
    //   },
    // },
    {
      id: "actionBooking",
      label: t("action"),
      numeric: false,
      Cell(row: Booking, _index: number) {
        if(isEmpty(row.RequestRefund)) return <div />
        return <ActionCell row={row} handleRefundBooking={handleRefundBooking} t={t} />;
      },
    },
  ];
};
