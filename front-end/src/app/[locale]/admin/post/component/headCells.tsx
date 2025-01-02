import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover, Tooltip } from "@mui/material";
import { Post } from "@/services/modules/post/interface/post";
import apiUrls from "@/constants/apiUrls";
import { useNotifications } from "@/helpers/toast";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";
import useToggleDialog from "@/hooks/useToggleDialog";

const ActionCell: React.FC<{
  row: Post;
  handleEditId: (id: number) => void;
  handleDeletePost: (id: number) => void;
  t: any
}> = ({ row, handleEditId, handleDeletePost ,t}) => {
  const {open, toggle, shouldRender} = useToggleDialog();
  const {showError,showSuccess} = useNotifications();
  
  const handleConfirmDelete = () => {
    try{
      toggle();
      handleDeletePost(Number(row.id));
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
  handleDeletePost,
  t
}: {
  handleEditId: (id: number) => void;
  handleDeletePost: (id: number) => void;
  t: any
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Post, _index: number) {
        return <span>{_index + 1}</span>;
      },
    },
    {
      id: "title",
      label: t("title"),
      numeric: false,
      Cell(row: Post, _index: number) {
        return <span>{row.title}</span>;
      },
    },
    {
      id: "content",
      label: t("content"),
      numeric: false,
      Cell(row: Post, _index: number) {
        return <span dangerouslySetInnerHTML={{
          __html: row.content
        }}></span>;
      },
    },
    {
      id: "image",
      label: t("image"),
      numeric: false,
      Cell(row: Post, _index: number) {
        return (
          <span>
            {row.image && (
              <img
                className="tw-w-[100px] tw-h-auto"
                src={`${apiUrls.IMG_URL}/${row.image}`}
                alt={`${row.title}-images`}
              />
            )}
          </span>
        );
      },
    },
    {
      id: "views",
      label: t("views"),
      numeric: false,
      Cell(row: Post, _index: number) {
        return <span>{row.views}</span>;
      },
    },
    {
      id: "actionPost",
      label: t("action"),
      numeric: false,
      Cell(row: Post, _index: number) {
        return (
          <ActionCell
            t={t}
            row={row}
            handleEditId={handleEditId}
            handleDeletePost={handleDeletePost}
          />
        );
      },
    },
  ];
};
