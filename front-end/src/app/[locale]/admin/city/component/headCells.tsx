import { City } from "@/services/modules/city/interfaces/city"
import { default as CommonStyles } from "@/components/common"
import CommonIcons from "@/components/CommonIcons"
import { useState } from "react"
import { Popover } from "@mui/material"

const ActionCell: React.FC<{ row: City; handleEditId: (id: number) => void; handleDeleteCity: (id: number) => void }> = ({
  row,
  handleEditId,
  handleDeleteCity
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    handleClosePopover();
    handleDeleteCity(Number(row.id));
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <CommonStyles.Box className="tw-flex tw-gap-2">
      {row.id && (
        <>
          <CommonStyles.Box onClick={() => handleEditId(Number(row.id))} className="tw-cursor-pointer tw-rounded-full tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-blue-100 tw-border-blue-500">
            <CommonIcons.EditOutlined className="tw-text-blue-500" />
          </CommonStyles.Box>
          <CommonStyles.Box onClick={handleOpenPopover} className="tw-rounded-full tw-cursor-pointer tw-border-solid tw-size-7 tw-border-[1px] tw-flex tw-justify-center tw-items-center tw-bg-red-100 tw-border-red-500">
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
                Are you sure you want to delete this city?
              </CommonStyles.Typography>
              <CommonStyles.Box className="tw-flex tw-gap-4">
                <CommonStyles.Box className="tw-text-red-500 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-bg-red-100 tw-rounded-md tw-px-2 tw-pb-1" onClick={handleConfirmDelete}>
                  Delete
                </CommonStyles.Box>
                <CommonStyles.Box className="tw-text-gray-700 tw-cursor-pointer tw-border-solid tw-border-[1px] tw-rounded-md tw-px-2 tw-pb-1" onClick={handleClosePopover}>
                  Cancel
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
  handleDeleteCity
}: {
  handleEditId: (id: number) => void;
  handleDeleteCity: (id: number) => void;
}) => {
  return [
    {
      id: "id",
      label: "STT",
      numeric: true,
      Cell(row: City, _index: number) {
        return <span>{_index+1}</span>;
      },
    },
    {
      id: "name",
      label: "Name",
      numeric: false,
      Cell(row: City, _index: number) {
        return <span>{row.name}</span>;
      },
    },
    {
      id: "image",
      label: "Image",
      numeric: false,
      Cell(row: City, _index: number) {
        return <span>{row.image}</span>;
      },
    },
    {
      id: "description",
      label: "Description",
      numeric: false,
      Cell(row: City, _index: number) {
        return <span>{row.description}</span>;
      },
    },
    {
      id: "actionCity",
      label: "Action",
      numeric: false,
      Cell(row: City, _index: number) {
        return <ActionCell row={row} handleEditId={handleEditId} handleDeleteCity={handleDeleteCity} />;
      },
    },
  ];
};
