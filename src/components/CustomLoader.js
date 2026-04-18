import React from 'react';
import { CircularProgress, styled } from '@mui/material';

const LoaderContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 9999,
});

const CustomLoader = ({ size = 40, ...props }) => {
  return (
    <LoaderContainer>
      <CircularProgress size={size} color="#68171b" {...props} />
    </LoaderContainer>
  );
};

export default CustomLoader;
