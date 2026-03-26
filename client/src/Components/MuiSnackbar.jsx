import { Snackbar } from "@mui/material";
import React, { useState } from 'react'
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const MuiSnackbar = () => {
    const [ open, setOpen ] = useState(true)
    const handleClose = ( event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setOpen(false)
    }    

  return (
    <div>     
      <Snackbar open={open}  autoHideDuration={6000}    onClose={handleClose} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MuiSnackbar