import { default as CommonStyles } from "@/components/common"
import CommonIcons from "@/components/CommonIcons"
import { useState } from "react"
import { Popover, Tooltip } from "@mui/material"
import { User } from "@/services/modules/user/interfaces/user.inteface";
import moment from "moment";
import { useNotifications } from "@/helpers/toast";
import useToggleDialog from "@/hooks/useToggleDialog";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";

const ActionCell: React.FC<{ row: User; handleEditId: (id: number) => void; handleDeleteUser: (id: number) => void; t: any }> = ({
  row,
  handleEditId,
  handleDeleteUser,
  t
}) => {
  const {open, toggle, shouldRender} = useToggleDialog();
  const {showError,showSuccess} = useNotifications();

  const handleConfirmDelete = () => {
    try{
      toggle();
      handleDeleteUser(Number(row.id));
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
  handleDeleteUser,
  page,
  perPage,
  t
}: {
  handleEditId: (id: number) => void;
  handleDeleteUser: (id: number) => void;
  page: number,
  perPage: number,
  t: any
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: User, _index: number) {
        return <span>{(page-1) * perPage +_index+1}</span>;
      },
    },
    {
      id: "name",
      label: t("userAdmin.name"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "username",
      label: t("userAdmin.username"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.username}</span>;
      },
    },
    {
      id: "phone",
      label: t("userAdmin.phone"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.phone}</span>;
      },
    },
    {
      id: "dataOfBirth",
      label: t("userAdmin.dateOfBirth"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.dateOfBirth && moment(row.dateOfBirth).format("DD/MM/YYYY").toLowerCase()}</span>;
      },
    },
    {
      id: "sex",
      label: t("userAdmin.sex"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.sex}</span>;
      },
    },
    {
      id: "status",
      label: t("userAdmin.status"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <span>{row.status}</span>;
      },
    },
    {
      id: "actionUser",
      label: t("action"),
      numeric: false,
      Cell(row: User, _index: number) {
        return <ActionCell row={row} handleEditId={handleEditId} handleDeleteUser={handleDeleteUser} t={t} />;
      },
    },
  ];
};
