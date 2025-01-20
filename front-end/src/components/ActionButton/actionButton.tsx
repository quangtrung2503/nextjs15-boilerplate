import React from 'react';
import { Box } from '@mui/material';
import { CommonButton } from '@/components/common/Button';
import { useTranslations } from 'next-intl';

interface StatusActionButtonsProps {
  status?: 'PENDING' | 'CANCELLED' | 'CONFIRMED' | 'COMPLETED';
  id: number;
  onCancel: (id: number) => void;
  onNavigate: (id: number) => void;
  extraClassName?: string;
}

const StatusActionButtons: React.FC<StatusActionButtonsProps> = ({ 
  status, 
  id, 
  onCancel, 
  onNavigate,
  extraClassName = '' 
}) => {
  const t = useTranslations('profile.bookingHistory');

  if (status === 'CANCELLED' || status === 'COMPLETED') {
    return null;
  }

  return (
    <Box className={`tw-mt-1 ${extraClassName}`}>
      {status === 'CONFIRMED' && (
        <CommonButton
          variant="contained"
          color="primary"
          size="small"
          className="tw-mt-8 tw-scroll-py-px tw-text-xs tw-rounded-ls tw-border-red-600 tw-text-red-700 tw-bg-red-100 hover:tw-bg-red-100 hover:tw-border-red-700"
          onClick={(event) => {
            event.stopPropagation();
            onCancel(id);
          }}
        >
          {t('cancel_tour')}
        </CommonButton>
      )}
      {status === 'PENDING' && (
        <CommonButton
          variant="contained"
          color="primary"
          size="small"
          className="tw-mt-8 tw-scroll-py-px tw-text-xs tw-rounded-ls tw-border-green-600 tw-text-green-700 tw-bg-green-100 hover:tw-bg-green-100 hover:tw-border-green-700"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(id);
          }}
        >
          {t('pay_now')}
        </CommonButton>
      )}
    </Box>
  );
};

export default StatusActionButtons;