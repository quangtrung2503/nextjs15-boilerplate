import React, { Fragment } from 'react';
import useToggleDialog from '@/hooks/useToggleDialog';
import {default as CommonStyles} from "@/components/common";
import { CommonButton } from './Button';

type OptionsRenderFilterHeader = {
  open: boolean;
  toggle: () => void;
};


export enum TypeOfFilterHeader {
  dialog = 'dialog',
}
export type RenderComponentHeadFilter = (options: OptionsRenderFilterHeader) => React.ReactNode;

interface Props<T> {
  type?: TypeOfFilterHeader;
  label?: string | React.ReactNode;
  renderComponent?: RenderComponentHeadFilter;
}

const HeadFilters = <T,>({
  type = TypeOfFilterHeader.dialog,
  renderComponent,
  label,
}: Props<T>) => {
  const { open, toggle, shouldRender } = useToggleDialog();
  const isOpenAnDialog = type === TypeOfFilterHeader.dialog;

  const renderContent = () => {
    if (isOpenAnDialog) {
      if (!shouldRender) {
        return;
      }
    }

    return renderComponent && renderComponent({ open, toggle });
  };

  return (
    <Fragment>
      {renderContent()}

      <CommonStyles.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {label}
        <CommonButton
          onClick={(e) => {
            e.stopPropagation();
            if (type === TypeOfFilterHeader.dialog) {
              toggle();
            }
          }}
        >
        </CommonButton>
      </CommonStyles.Box>
    </Fragment>
  );
};

export default HeadFilters;
