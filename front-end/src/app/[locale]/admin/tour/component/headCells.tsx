import { default as CommonStyles } from "@/components/common"
import CommonIcons from "@/components/CommonIcons"
import { useState } from "react"
import { Popover } from "@mui/material"
import { Tour } from "@/services/modules/tour/interfaces/tour";
import moment from "moment";

const ActionCell: React.FC<{ row: Tour; handleEditId: (id: number) => void; handleDeleteTour: (id: number) => void;t: any }> = ({
  row,
  handleEditId,
  handleDeleteTour,
  t
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    handleClosePopover();
    handleDeleteTour(Number(row.id));
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <CommonStyles.Box onClick={() => handleEditId(Number(row.id))} className="tw-cursor-pointer tw-rounded-full tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-blue-100 tw-border-blue-500">
            <CommonIcons.EditOutlined className="tw-text-blue-500" />
          </CommonStyles.Box>
          <CommonStyles.Box onClick={handleOpenPopover} className="tw-rounded-full tw-cursor-pointer tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-red-100 tw-border-red-500">
            <CommonIcons.DeleteOutline className="tw-text-red-500" />
          </CommonStyles.Box>
          <Popover
          className="tw-mt-1"
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <CommonStyles.Box className="tw-p-2 tw-flex tw-flex-col tw-items-center">
              <CommonStyles.Typography className="tw-text-md tw-mb-1 tw-font-bold">
                {t("tourAdmin.confirmDelete")}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-gap-4">
                <CommonStyles.Box className="tw-text-red-500 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-bg-red-100 tw-rounded-md tw-px-2 tw-pb-1" onClick={handleConfirmDelete}>
                  {t("delete")}
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-text-gray-700 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-rounded-md tw-px-2 tw-pb-1" onClick={handleClosePopover}>
                  {t("cancel")}
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </Popover>
        </>
      )}
    </CommonStyles.Box>
  );
};

export const headCells = ({
  handleEditId,
  handleDeleteTour,
  t
}: {
  handleEditId: (id: number) => void;
  handleDeleteTour: (id: number) => void;
  t: any
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Tour, _index: number) {
        return <span>{_index+1}</span>;
      },
    },
    {
      id: "name",
      label: t("tourAdmin.name"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "price",
      label: t("tourAdmin.price"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.price}</span>;
      },
    },
    {
      id: "transport",
      label: t("tourAdmin.transport"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.transport}</span>;
      },
    },
    {
      id: "package",
      label: t("tourAdmin.package"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.package}</span>;
      },
    },
    {
      id: "numberOfPeople",
      label: t("tourAdmin.numberOfPeople"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.numberOfPeople}</span>;
      },
    },
    {
      id: "numberOfHours",
      label: t("tourAdmin.numberOfHours"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.numberOfHours}</span>;
      },
    },
    {
      id: "startDate",
      label: t("tourAdmin.startDate"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.startDate && moment(row.startDate).format("DD/MM/YYYY").toLowerCase()}</span>;
      },
    },
    {
      id: "endDate",
      label: t("tourAdmin.endDate"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <span>{row.endDate && moment(row.endDate).format("DD/MM/YYYY").toLowerCase()}</span>;
      },
    },
    {
      id: "actionTour",
      label: "Action",
      numeric: false,
      Cell(row: Tour, _index: number) {
        return <ActionCell row={row} handleEditId={handleEditId} handleDeleteTour={handleDeleteTour} t={t} />;
      },
    },
  ];
};
