import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box'
import { useTranslations } from "next-intl";
import pageUrls from '@/constants/pageUrls';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

export default function CardBreadcrumbs() {
  const t = useTranslations('breadcrumb')
  return (
    <Box role="presentation" onClick={handleClick} className="tw-mt-24 tw-pl-36 tw-pt-4 tw-pb-5 tw-shadow-md">
      <Typography variant="h6" className='tw-font-bold tw-font-serif'>{t("myProfile")}</Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href={pageUrls.Homepage}>
          {t('home')}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={pageUrls.Profile}
        >
          {t('myProfile')}
        </Link>
      </Breadcrumbs>
    </Box>
  );
}