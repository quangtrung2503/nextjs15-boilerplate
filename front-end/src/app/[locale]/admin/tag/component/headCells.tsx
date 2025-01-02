import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover, Tooltip } from "@mui/material";
import { useNotifications } from "@/helpers/toast";
import { Tag } from "@/services/modules/tag/interfaces/tag";
import apiUrls from "@/constants/apiUrls";
import useToggleDialog from "@/hooks/useToggleDialog";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";

const ActionCell: React.FC<{
  row: Tag;
  handleEditId: (id: number) => void;
  handleDeleteTag: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteTag, t }) => {
  const { showError, showSuccess } = useNotifications();
  const {open, shouldRender, toggle} = useToggleDialog();

  const handleConfirmDelete = () => {
    try {
      toggle();
      handleDeleteTag(Number(row.id));
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
  handleDeleteTag,
  t,
}: {
  handleEditId: (id: number) => void;
  handleDeleteTag: (id: number) => void;
  t: any;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Tag, _index: number) {
        return <span>{_index + 1}</span>;
      },
    },
    {
      id: "name",
      label: t("name"),
      numeric: false,
      Cell(row: Tag, _index: number) {
        return (
          <span>
            <CommonStyles.Box
              boxShadow="0px 4px 10px 0px #00000014"
              sx={{ color: `${row.color}` }}
              className="tw-px-6 tw-py-3 tw-size-fit tw-rounded-[3px]"
            >
              <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3">
                <img
                  src={`${apiUrls.IMG_URL}/${row.icon}`}
                  className="tw-w-[30px] tw-h-[30px] tw-rounded-full tw-object-cover"
                />
                <CommonStyles.Typography
                  type="size14Weight700"
                  className={`tw-text-[${row.color}]`}
                >
                  {row.name}
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
          </span>
        );
      },
    },
    {
      id: "actionTag",
      label: t("action"),
      numeric: false,
      Cell(row: Tag, _index: number) {
        return (
          <ActionCell
            row={row}
            handleEditId={handleEditId}
            handleDeleteTag={handleDeleteTag}
            t={t}
          />
        );
      },
    },
  ];
};
