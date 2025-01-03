"use client"
import React from 'react';
import { CircularProgress, CircularProgressProps } from '@mui/material';
import { styled } from '@mui/system';

const Overlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: "var(--background)", // Màu nền mờ
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999, // Hiển thị trên cùng
});

const Loading: React.FC<CircularProgressProps> = (props) => {
  const { color = 'primary', ...rest } = props;
  return (
    <Overlay>
      <CircularProgress {...rest} color={color} />
    </Overlay>
  );
};

export default Loading;