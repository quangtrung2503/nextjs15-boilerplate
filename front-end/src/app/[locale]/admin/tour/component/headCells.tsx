import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover, Tooltip } from "@mui/material";
import { Tour } from "@/services/modules/tour/interfaces/tour";
import moment from "moment";
import { useNotifications } from "@/helpers/toast";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";
import useToggleDialog from "@/hooks/useToggleDialog";

const ActionCell: React.FC<{
  row: Tour;
  handleEditId: (id: number) => void;
  handleDeleteTour: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteTour, t }) => {
  const {showError,showSuccess} = useNotifications();
  const {open, shouldRender, toggle} = useToggleDialog();

  const handleConfirmDelete = () => {
    try {
      toggle();
      handleDeleteTour(Number(row.id));
      showSuccess(t("deleteSuccess"));
    } catch (error) {
      showError(error);
    }
  };

  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <Tooltip title={t("edit")}>
            <CommonStyles.Box
              onClick={() => handleEditId(Number(row.id))}
              className="tw-cursor-pointer tw-size-7"
            >
              <CommonIcons.EditOutlined className="tw-text-blue-500" />
            </CommonStyles.Box>
          </Tooltip>
          <Tooltip title={t("delete")}>
            <CommonStyles.Box
              onClick={toggle}
              className="tw-cursor-pointer tw-size-7"
            >
              <CommonIcons.DeleteOutline className="tw-text-red-500" />
            </CommonStyles.Box>
          </Tooltip>
          {shouldRender && (
            <CommonDialog
              open={open}
              toggle={toggle}
              body={<ConfirmDeleteDialog handleConfirmDelete={handleConfirmDelete} toggle={toggle} />}
            />
          )}
        </>
      )}
    </CommonStyles.Box>
  );
};

export const headCells = ({
  handleEditId,
  handleDeleteTour,
  t,
}: {
  handleEditId: (id: number) => void;
  handleDeleteTour: (id: number) => void;
  t: any;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Tour, _index: number) {
        return <span>{_index + 1}</span>;
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
        return (
          <span>
            {row.startDate &&
              moment(row.startDate).format("DD/MM/YYYY").toLowerCase()}
          </span>
        );
      },
    },
    {
      id: "endDate",
      label: t("tourAdmin.endDate"),
      numeric: false,
      Cell(row: Tour, _index: number) {
        return (
          <span>
            {row.endDate &&
              moment(row.endDate).format("DD/MM/YYYY").toLowerCase()}
          </span>
        );
      },
    },
    {
      id: "actionTour",
      label: "Action",
      numeric: false,
      Cell(row: Tour, _index: number) {
        return (
          <ActionCell
            row={row}
            handleEditId={handleEditId}
            handleDeleteTour={handleDeleteTour}
            t={t}
          />
        );
      },
    },
  ];
};
