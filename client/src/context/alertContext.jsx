import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import MuiSnackbar from '../Components/MuiSnackbar';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showAlert = useCallback((message, severity = 'success') => {
    setAlertState({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const value = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [hideAlert, showAlert]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <MuiSnackbar
        open={alertState.open}
        message={alertState.message}
        severity={alertState.severity}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};
