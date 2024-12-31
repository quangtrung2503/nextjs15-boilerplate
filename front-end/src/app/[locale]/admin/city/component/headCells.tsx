import { City } from "@/services/modules/city/interfaces/city";
import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover, Tooltip } from "@mui/material";
import apiUrls from "@/constants/apiUrls";
import { useNotifications } from "@/helpers/toast";
import useToggleDialog from "@/hooks/useToggleDialog";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";

const ActionCell: React.FC<{
  row: City;
  handleEditId: (id: number) => void;
  handleDeleteCity: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteCity, t }) => {
  const { showError, showSuccess } = useNotifications();
  const { open, shouldRender, toggle } = useToggleDialog();

  const handleConfirmDelete = () => {
    try {
      toggle();
      handleDeleteCity(Number(row.id));
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
              body={<ConfirmDeleteDialog title={t("deleteTitle")} handleConfirmDelete={handleConfirmDelete} toggle={toggle} />}
            />
          )}
        </>
      )}
    </CommonStyles.Box>
  );
};

export const headCells = ({
  handleEditId,
  handleDeleteCity,
  t,
}: {
  handleEditId: (id: number) => void;
  handleDeleteCity: (id: number) => void;
  t: any;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: City, _index: number) {
        return <span>{_index + 1}</span>;
      },
    },
    {
      id: "name",
      label: t("name"),
      numeric: false,
      Cell(row: City, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "image",
      label: t("image"),
      numeric: false,
      Cell(row: City, _index: number) {
        return (
          <span>
            {row.image && (
              <img
                className="tw-w-[100px] tw-h-auto"
                src={`${apiUrls.IMG_URL}/${row.image}`}
                alt={`${row.name}-images`}
              />
            )}
          </span>
        );
      },
    },
    {
      id: "description",
      label: t("description"),
      numeric: false,
      Cell(row: City, _index: number) {
        const maxLength = 200;
        const description =
          row.description.length > maxLength
            ? row.description.slice(0, maxLength) + "..."
            : row.description;

        return (
          <Tooltip title={row.description}>
            <span>{description}</span>
          </Tooltip>
        );
      },
    },
    {
      id: "tag",
      label: t("tag"),
      sxCell: { width: "50%" },
      numeric: false,
      Cell(row: City, _index: number) {
        return (
          <span>
            <CommonStyles.Box className="tw-flex tw-items-center tw-flex-wrap">
              {row.Tag?.map((tag, index) => {
                return (
                  <CommonStyles.Box
                    key={index}
                    boxShadow="0px 4px 10px 0px #00000014"
                    sx={{ color: `${tag.color}` }}
                    className="tw-px-6 tw-py-3 tw-size-fit tw-rounded-[3px]"
                  >
                    <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3">
                      <img
                        src={`${apiUrls.IMG_URL}/${tag.icon}`}
                        className="tw-max-w-[40px] tw-max-h-[20px] tw-rounded-full"
                      />
                      <CommonStyles.Typography
                        type="size14Weight700"
                        className={`tw-text-[${tag.color}]`}
                      >
                        {tag.name}
                      </CommonStyles.Typography>
                    </CommonStyles.Box>
                  </CommonStyles.Box>
                );
              })}
            </CommonStyles.Box>
          </span>
        );
      },
    },
    {
      id: "actionCity",
      label: t("action"),
      numeric: false,
      Cell(row: City, _index: number) {
        return (
          <ActionCell
            row={row}
            handleEditId={handleEditId}
            handleDeleteCity={handleDeleteCity}
            t={t}
          />
        );
      },
    },
  ];
};
