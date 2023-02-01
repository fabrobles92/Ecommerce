import {forwardRef} from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function SnackbarMessage({state, handleClose}) {
    switch (state.flag) {
        case false:                
            return(
                <Snackbar autoHideDuration={4000} open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
                    <Alert severity='error' sx={{ width: '100%' }} onClose={handleClose}>
                        {state.message}
                    </Alert>
                </Snackbar>
            )
        case true:
            return(
            <Snackbar autoHideDuration={4000} open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
                <Alert severity='success' sx={{ width: '100%' }} onClose={handleClose}>
                    {state.message}
                </Alert>
            </Snackbar>
        )
        default:
            return null
    }
}

export default SnackbarMessage