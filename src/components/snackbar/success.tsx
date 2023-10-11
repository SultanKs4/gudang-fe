import { Alert, Snackbar } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface ISnackbar {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
}

export default function SnackbarSuccess(props: ISnackbar) {
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
    <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        variant="filled"
        severity="success"
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
