import { default as CommonStyles } from "@/components/common"
import CommonIcons from "@/components/CommonIcons"
import { useState } from "react"
import { Popover, Tooltip } from "@mui/material"
import { Destination } from "@/services/modules/destination/interface/destination"
import { useNotifications } from "@/helpers/toast"
import CommonDialog from "@/components/common/Dialog"
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog"
import useToggleDialog from "@/hooks/useToggleDialog"

const ActionCell: React.FC<{ row: Destination; handleEditId: (id: number) => void; handleDeleteDestination: (id: number) => void ;t: any}> = ({
  row,
  handleEditId,
  handleDeleteDestination,
  t
}) => {
  const {showError,showSuccess} = useNotifications();
  const {open, toggle, shouldRender} = useToggleDialog();

  const handleConfirmDelete = () => {
    try{
      toggle();
      showSuccess(t("deleteSuccess"))
      handleDeleteDestination(Number(row.id));
    }
    catch(error){
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
  handleDeleteDestination,
  t
}: {
  handleEditId: (id: number) => void;
  handleDeleteDestination: (id: number) => void;
  t: any
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Destination, _index: number) {
        return <span>{_index+1}</span>;
      },
    },
    {
      id: "name",
      label: t("name"),
      numeric: false,
      Cell(row: Destination, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "isFeature",
      label: t("feature"),
      numeric: false,
      Cell(row: Destination, _index: number) {
        return <span>{row.isFeature ? <CommonIcons.Done className="tw-text-green-500" /> : <></>}</span>;
      },
    },
    {
      id: "actionDestination",
      label: t("action"),
      numeric: false,
      Cell(row: Destination, _index: number) {
        return <ActionCell row={row} handleEditId={handleEditId} handleDeleteDestination={handleDeleteDestination} t={t} />;
      },
    },
  ];
};
