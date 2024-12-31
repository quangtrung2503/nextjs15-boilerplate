import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover, Tooltip } from "@mui/material";
import moment from "moment";
import { useNotifications } from "@/helpers/toast";
import { Video } from "@/services/modules/video/interfaces/video";
import apiUrls from "@/constants/apiUrls";
import Link from "next/link";
import CommonDialog from "@/components/common/Dialog";
import ConfirmDeleteDialog from "../../Component/confirmDeleteDialog";
import useToggleDialog from "@/hooks/useToggleDialog";

const ActionCell: React.FC<{
  row: Video;
  handleEditId: (id: number) => void;
  handleDeleteVideo: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteVideo, t }) => {
  const { showError, showSuccess } = useNotifications();
  const {open, toggle, shouldRender} = useToggleDialog();


  const handleConfirmDelete = () => {
    try {
      toggle();
      handleDeleteVideo(Number(row.id));
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
  handleDeleteVideo,
  t,
}: {
  handleEditId: (id: number) => void;
  handleDeleteVideo: (id: number) => void;
  t: any;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: Video, _index: number) {
        return <span>{_index + 1}</span>;
      },
    },
    {
      id: "title",
      label: t("title"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return <span>{row.title}</span>;
      },
    },
    {
      id: "description",
      label: t("description"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return <span>{row.description}</span>;
      },
    },
    {
      id: "thumbnail",
      label: t("thumbnail"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return (
          <span>
            {row.thumbnail && (
              <img
                className="tw-w-[100px] tw-h-auto"
                src={`${apiUrls.IMG_URL}/${row.thumbnail}`}
                alt={`${row.title}-images`}
              />
            )}
          </span>
        );
      },
    },
    {
      id: "video",
      label: t("video"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return (
          <div>
            {row.video && (
              <Link  className="tw-flex tw-items-center" href={`${apiUrls.IMG_URL}/${row.video}`} target="_blank"><CommonIcons.PlayCircleOutline />{row.title}</Link>
            )}
          </div>
        );
      },
    },
    {
      id: "isDisplay",
      label: t("isDisplay"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return (
          <span>
            <span>{row.isDisplay ? <CommonIcons.Done className="tw-text-green-500" /> : <></>}</span>
          </span>
        );
      },
    },
    {
      id: "actionVideo",
      label: t("action"),
      numeric: false,
      Cell(row: Video, _index: number) {
        return (
          <ActionCell
            row={row}
            handleEditId={handleEditId}
            handleDeleteVideo={handleDeleteVideo}
            t={t}
          />
        );
      },
    },
  ];
};
