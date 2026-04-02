import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const MuiSnackbar = ({ open, message, severity = 'success', onClose, autoHideDuration = 4200 }) => {
  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', minWidth: 280, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MuiSnackbar;
