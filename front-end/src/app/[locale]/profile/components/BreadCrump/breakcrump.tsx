import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box'

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function DivBreadcrumbs() {
  return (
    <Box role="presentation" onClick={handleClick} className="tw-mt-24 tw-pl-36 tw-pt-4 tw-pb-5 tw-shadow-md">
      <Typography variant="h6" className='tw-font-bold tw-font-serif'>My Profile</Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/en/profile"
        >
          My Profile
        </Link>
      </Breadcrumbs>
    </Box>
  );
}
