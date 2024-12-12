import React from 'react';
import DividerMui, { DividerProps } from '@mui/material/Divider';

const Divider = (props: DividerProps) => {
  return <DividerMui {...props} />;
};

export default React.memo(Divider);
