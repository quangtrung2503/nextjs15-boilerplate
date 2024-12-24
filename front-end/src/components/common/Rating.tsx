"use client"
import React, { memo } from 'react';
import Rating from '@mui/material/Rating';
import { FieldInputProps, FormikProps } from 'formik';
import { default as CommonStyles } from ".";
import { SxProps } from '@mui/material';
import CommonIcons from '../CommonIcons';
import { twMerge } from 'tailwind-merge';

interface Props {
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
  readOnly?: boolean;
  disabled?: boolean;
  haveFeedback?: boolean;
  valueTable?: number;
  sxRating?: SxProps;
  setValue?: boolean;
  classNameIcon?: string;
}

const RatingMui = (props: Props) => {
  //! State
  const { field, form, readOnly, disabled, haveFeedback, valueTable, sxRating, setValue, classNameIcon } = props;
  const { name, value, onChange } = field || {};
  const { errors, touched } = form || {};
  const [hover, setHover] = React.useState(-1);
  const valueRating = valueTable ? valueTable : value;
  //! Function
  const getLabelText = (value: number) => {
    return `${value} Star${value !== 1 ? 's' : ''}, ${value}`;
  };

  //! Render
  return (
    <CommonStyles.Box sx={{ display: 'flex' }}>
      <Rating
        name={name}
        value={valueRating}
        onChange={onChange}
        size='small'
        icon={<CommonIcons.Star fontSize="inherit" className={twMerge(classNameIcon, "tw-text-[#FFA432]")}/>}
        emptyIcon={<CommonIcons.Star fontSize="inherit" className={twMerge(classNameIcon, "tw-text-[#CFD9DE]")}/>}
        readOnly={readOnly}
        disabled={disabled}
        getLabelText={getLabelText}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        precision={setValue && !readOnly ? 1 : 0.1}
        sx={{ ...sxRating }}
      />

      {(!!value || hover !== -1) && haveFeedback && (
        <CommonStyles.Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          {hover !== -1 ? Number(hover)?.toFixed(1) : Number(value)?.toFixed(1)}
        </CommonStyles.Box>
      )}
    </CommonStyles.Box>
  );
};
export default memo(RatingMui);
