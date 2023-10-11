import { Alert, Snackbar } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface ISnackbar {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
}

export default function SnackbarError(props: ISnackbar) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        severity="error"
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
