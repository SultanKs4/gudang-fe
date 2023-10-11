import { Data } from '@/model/item';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { createRequestEdit } from '@/model/body';
import { editItems } from '@/api/items';
import Loading from '../loading/Loading';

interface IEditModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedData: Data[];
  setOpenSuccessSnackbar: Dispatch<SetStateAction<boolean>>;
  setMsgSuccessSnackbar: Dispatch<SetStateAction<string>>;
  setOpenErrSnackbar: Dispatch<SetStateAction<boolean>>;
  setMsgErrSnackbar: Dispatch<SetStateAction<string>>;
}

type ErrFieldMsg = Map<string, string>;

export default function EditItems(props: IEditModal) {
  const [openLoading, setOpenLoading] = useState(false);
  const [errorList, setErrorList] = useState<ErrFieldMsg>(new Map());

  const handleClose = () => {
    errorList.clear();
    setErrorList(new Map(errorList));
    props.setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let datas: Data[] = [];
    for (let i = 0; i < props.selectedData.length; i++) {
      let code = data.get(`${i}_code`)?.toString();
      if (code == undefined) {
        return null;
      }
      let nama = data.get(`${i}_nama`)?.toString();
      if (nama == undefined) {
        return null;
      }
      // let jumlah = data.get(`${i}_jumlah`)?.toString();
      // if (jumlah == undefined) {
      //   return null;
      // }
      let deskripsi = data.get(`${i}_deskripsi`)?.toString();
      if (deskripsi == undefined) {
        return null;
      }
      datas.push({
        id: props.selectedData[i].id,
        code: code,
        nama: nama,
        jumlah: props.selectedData[i].jumlah,
        deskripsi: deskripsi,
        status_active: data.get(`${i}_status_active`) ? true : false,
      });
    }

    if (errorList.size > 0) {
      props.setMsgErrSnackbar('must resolve error first!');
      props.setOpenErrSnackbar(true);
      return null;
    }
    const body = createRequestEdit(datas);
    setOpenLoading(true);
    await editItems(body)
      .then((v) => {
        props.setMsgSuccessSnackbar('edit item success');
        props.setOpenSuccessSnackbar(true);
        handleClose();
      })
      .catch((err) => {
        const msg = err.response.data.message;
        props.setMsgErrSnackbar(`failed edit item ${msg ?? ''}`);
        props.setOpenErrSnackbar(true);
      })
      .finally(() => {
        setOpenLoading(false);
      });
  };

  const handleValidation = async (
    event: React.FormEvent<HTMLDivElement> & {
      target: HTMLFormElement;
    }
  ) => {
    const field = event.target;
    const fieldName = field.name.split('_')[1];

    // code
    if (fieldName === 'code' && field.value.length > 10) {
      errorList.set(field.name, `karakter melebihi ketentuan max(10)`);
      setErrorList(new Map(errorList));
      return;
    } else {
      if (errorList.delete(field.name)) {
        setErrorList(new Map(errorList));
      }
    }

    // nama
    if (fieldName === 'nama' && field.value.length > 20) {
      errorList.set(field.name, `karakter melebihi ketentuan max(20)`);
      setErrorList(new Map(errorList));
      return;
    } else {
      if (errorList.delete(field.name)) {
        setErrorList(new Map(errorList));
      }
    }
  };

  const handleIsErrField = (name: string) => {
    const msg = errorList.get(name);
    if (!msg) {
      return false;
    }
    return true;
  };

  const handleErrMsgField = (name: string) => {
    const msg = errorList.get(name);
    if (!msg) {
      return null;
    }
    return msg;
  };

  // useEffect(() => {
  //   console.log(errorList);
  // }, [errorList]);

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogTitle>Edit Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Note: can't update stock in here you must choose edit stock.
          </DialogContentText>
          {props.selectedData.map((x, i) => {
            return (
              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
                key={i}
                onChange={handleValidation}
              >
                <Grid item xs={12}>
                  <Typography variant="h6" noWrap component="div">
                    {`Item ke-${i + 1}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    // autoComplete="given-name"
                    name={`${i}_code`}
                    required
                    fullWidth
                    id="code"
                    label="Code"
                    defaultValue={x.code}
                    helperText={handleErrMsgField(`${i}_code`)}
                    error={handleIsErrField(`${i}_code`)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nama"
                    label="Nama"
                    name={`${i}_nama`}
                    defaultValue={x.nama}
                    helperText={handleErrMsgField(`${i}_nama`)}
                    error={handleIsErrField(`${i}_nama`)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    disabled
                    type="number"
                    id="jumlah"
                    label="Jumlah"
                    name={`${i}_jumlah`}
                    defaultValue={x.jumlah}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    id="deskripsi"
                    label="Deskripsi"
                    name={`${i}_deskripsi`}
                    defaultValue={x.deskripsi}
                    helperText={handleErrMsgField(`${i}_deskripsi`)}
                    error={handleIsErrField(`${i}_deskripsi`)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    id="status_active"
                    control={
                      <Switch
                        defaultChecked={x.status_active ? true : false}
                        value={true}
                        color="primary"
                      />
                    }
                    label="Aktif"
                    name={`${i}_status_active`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} endIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button type="submit" endIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Box>
      <Loading open={openLoading} />
    </Dialog>
  );
}
