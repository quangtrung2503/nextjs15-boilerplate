import { default as CommonStyles } from "@/components/common";
import CommonIcons from "@/components/CommonIcons";
import { useState } from "react";
import { Popover } from "@mui/material";
import moment from "moment";
import { useNotifications } from "@/helpers/toast";
import { Video } from "@/services/modules/video/interfaces/video";
import apiUrls from "@/constants/apiUrls";
import Link from "next/link";

const ActionCell: React.FC<{
  row: Video;
  handleEditId: (id: number) => void;
  handleDeleteVideo: (id: number) => void;
  t: any;
}> = ({ row, handleEditId, handleDeleteVideo, t }) => {
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
      handleDeleteVideo(Number(row.id));
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
            {row.isDisplay ? <CommonIcons.CheckCircleOutline /> : <></>}
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
