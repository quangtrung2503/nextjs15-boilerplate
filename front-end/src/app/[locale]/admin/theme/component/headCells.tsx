import { default as CommonStyles } from "@/components/common"
import CommonIcons from "@/components/CommonIcons"
import { useState } from "react"
import { Popover, Tooltip } from "@mui/material"
import { Theme } from "@/services/modules/theme/interfaces/theme";
import { useNotifications } from "@/helpers/toast";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";
import useToggleDialog from "@/hooks/useToggleDialog";

const ActionCell: React.FC<{ row: Theme; handleEditId: (id: number) => void; handleDeleteTheme: (id: number) => void;t: any }> = ({
  row,
  handleEditId,
  handleDeleteTheme,
  t
}) => {
  const {showError,showSuccess} = useNotifications();
  const {open, shouldRender, toggle} = useToggleDialog();  

  const handleConfirmDelete = () => {
    try{
      toggle();
      handleDeleteTheme(Number(row.id));
      showSuccess(t("deleteSuccess"))
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
  handleDeleteTheme,
  t
}: {
  handleEditId: (id: number) => void;
  handleDeleteTheme: (id: number) => void;
  t: any
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Theme, _index: number) {
        return <span>{_index+1}</span>;
      },
    },
    {
      id: "name",
      label: t("themeAdmin.name"),
      numeric: false,
      Cell(row: Theme, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "isDisplay",
      label: t("themeAdmin.isDisplay"),
      numeric: false,
      Cell(row: Theme, _index: number) {
        return <span>{row.isDisplay ? <CommonIcons.Done className="tw-text-green-500" /> : <></>}</span>;
      },
    },
    {
      id: "actionTheme",
      label: t("action"),
      numeric: false,
      Cell(row: Theme, _index: number) {
        return <ActionCell row={row} handleEditId={handleEditId} handleDeleteTheme={handleDeleteTheme} t={t} />;
      },
    },
  ];
};
