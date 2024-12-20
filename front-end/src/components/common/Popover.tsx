import * as React from "react";
import Popover from "@mui/material/Popover";

type AnchorOrigin = {
  vertical: "top" | "bottom" | "center";
  horizontal: "left" | "right" | "center";
};

type Props = {
  body: React.ReactNode;
  children: React.ReactNode;
  zIndex?: number;
  anchorOrigin?: AnchorOrigin;
  transformOrigin?: AnchorOrigin;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const PopoverMui: React.FC<Props> = ({
  body,
  children,
  zIndex = 1200,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  transformOrigin = { vertical: "top", horizontal: "right" },
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    if (onClick) {
      onClick(event);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <Popover
        sx={{ zIndex }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        disableScrollLock
      >
        {body}
      </Popover>
    </>
  );
};

export default PopoverMui;
