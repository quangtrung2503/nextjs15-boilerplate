import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover } from "@mui/material";
import { useNotifications } from "@/helpers/toast";
import { Tag } from "@/services/modules/tag/interfaces/tag";
import apiUrls from "@/constants/apiUrls";

const ActionCell: React.FC<{
  row: Tag;
  handleEditId: (id: number) => void;
  handleDeleteTag: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteTag, t }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { showError, showSuccess } = useNotifications();

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    try {
      handleClosePopover();
      handleDeleteTag(Number(row.id));
      showSuccess(t("deleteSuccess"));
    } catch (error) {
      showError(error);
    }
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <CommonStyles.Box
            onClick={() => handleEditId(Number(row.id))}
            className="tw-cursor-pointer tw-rounded-full tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-blue-100 tw-border-blue-500"
          >
            <CommonIcons.EditOutlined className="tw-text-blue-500" />
          </CommonStyles.Box>
          <CommonStyles.Box
            onClick={handleOpenPopover}
            className="tw-rounded-full tw-cursor-pointer tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-red-100 tw-border-red-500"
          >
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
                {t("confirmDelete")}
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-gap-4">
                <CommonStyles.Box
                  className="tw-text-red-500 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-bg-red-100 tw-rounded-md tw-px-2 tw-pb-1"
                  onClick={handleConfirmDelete}
                >
                  {t("delete")}
                </CommonStyles.Box>
                <CommonStyles.Box
                  className="tw-text-gray-700 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-rounded-md tw-px-2 tw-pb-1"
                  onClick={handleClosePopover}
                >
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
