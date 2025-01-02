import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CommonButton } from "./Button";

interface DialogProps {
  open: boolean;
  body: React.ReactNode;
  toggle: () => void;
  title?: string;
  onClose?: () => void;
  maxWidth?: "xs"|"sm"|"md"|"lg"|"xl";
}
export default function CommonDialog(props: DialogProps) {
  const { open, title, body, toggle, onClose, maxWidth } = props;
  return (
    <Dialog
    sx={{".css-17jr764-MuiPaper-root-MuiDialog-paper": {
      borderRadius: "12px"
    }}}
      open={open}
      onClose={() => {
        onClose && onClose();toggle();
      }}
      maxWidth={maxWidth || "xl"}
    >
      {title && (
        <>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={toggle}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}
      <DialogContent className="tw-rounded-xl" dividers>{body}</DialogContent>
    </Dialog>
  );
}
