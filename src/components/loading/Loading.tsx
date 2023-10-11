import { Backdrop, CircularProgress } from '@mui/material';

interface ILoading {
  open: boolean;
}

export default function Loading(props: ILoading) {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
      >
        <CircularProgress />
      </Backdrop>
    </div>
  );
}
