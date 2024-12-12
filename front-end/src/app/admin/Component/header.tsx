import { Box, Container, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Box className="tw-h-header-admin tw-w-content-admin tw-fixed tw-top-0 tw-right-0 tw-z-50 tw-flex tw-items-center tw-bg-gray-200 tw-shadow-sm">
      <Container className="tw-h-5 tw-flex tw-items-center tw-justify-between">
        <Typography
          className="tw-text-primary tw-font-semibold"
          sx={{ fontWeight: 600 }}
          variant="h5"
        >
          Hello, Tour guide<span className="tw-ml-1">👋</span>
        </Typography>
        <Box className="tw-flex tw-items-center tw-gap-3">
          {/* Add your header content here, e.g., icons or buttons */}
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
