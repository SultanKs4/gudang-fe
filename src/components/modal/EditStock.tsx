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
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { createRequestEdit, createRequestStock } from '@/model/body';
import { editItems, editStocks } from '@/api/items';
import { StockItem } from '@/model/stock';
import Loading from '../loading/Loading';
import SnackbarSuccess from '../snackbar/success';

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

export default function EditStocks(props: IEditModal) {
  const [openLoading, setOpenLoading] = useState(false);
  const [errorList, setErrorList] = useState<ErrFieldMsg>(new Map());

  const handleValidation = async (
    event: React.FormEvent<HTMLDivElement> & {
      target: HTMLFormElement;
    }
  ) => {
    const { selectedData } = props;

    const indexField: number = parseInt(event.target.name.split('_')[0]);

    const inputJumlah = event.target.value;
    const remoteJumlah = selectedData[indexField].jumlah;

    const operation = (
      document.getElementsByName(
        `${indexField}_operation`
      )[0] as HTMLInputElement
    ).value;

    if (remoteJumlah < inputJumlah && operation === '-') {
      errorList.set(
        event.target.name,
        `item ${inputJumlah} melebihi stok (${remoteJumlah})`
      );
      setErrorList(new Map(errorList));
    } else {
      if (errorList.delete(event.target.name)) {
        setErrorList(new Map(errorList));
      }
    }
  };

  const handleClose = () => {
    errorList.clear();
    setErrorList(new Map(errorList));
    props.setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let datas: StockItem[] = [];
    for (let i = 0; i < props.selectedData.length; i++) {
      let operation = data.get(`${i}_operation`)?.toString();
      if (operation == undefined) {
        return null;
      }
      let jumlah = data.get(`${i}_jumlah`)?.toString();
      if (jumlah == undefined) {
        return null;
      }
      datas.push({
        id: props.selectedData[i].id,
        code: props.selectedData[i].code,
        jumlah: parseInt(jumlah),
        operation: operation,
      });
    }
    if (errorList.size > 0) {
      props.setMsgErrSnackbar('must resolve error first!');
      props.setOpenErrSnackbar(true);
      return null;
    }
    // TODO: check error list dulu sebelum submit
    const body = createRequestStock(datas);
    setOpenLoading(true);
    await editStocks(body)
      .then((v) => {
        console.log(v.data);
        props.setMsgSuccessSnackbar('edit stock success');
        props.setOpenSuccessSnackbar(true);
        handleClose();
      })
      .catch((err) => {
        const msg = err.response.data.message;
        props.setMsgErrSnackbar(`failed edit stock ${msg ?? ''}`);
        props.setOpenErrSnackbar(true);
      })
      .finally(() => {
        setOpenLoading(false);
      });
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
  return (
    <Dialog open={props.open} onClose={handleClose}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogTitle>Edit Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Note: can't update other than stock in here, you must choose edit.
          </DialogContentText>
          {props.selectedData.map((x, i) => {
            return (
              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
                key={i}
                onChange={handleValidation}
                // onChange={(e) => handleValidation(e)}
              >
                <Grid item xs={12}>
                  <Typography variant="h6" noWrap component="div">
                    {`Item ke-${i + 1}`}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    // autoComplete="given-name"
                    name={`${i}_code`}
                    fullWidth
                    disabled
                    id="code"
                    label="Code"
                    defaultValue={x.code}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    id="nama"
                    label="Nama"
                    name={`${i}_nama`}
                    defaultValue={x.nama}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="type_operation_label">Type</InputLabel>
                    <Select
                      labelId="type_operation_label"
                      id="type_operation"
                      // value={age}
                      label="Type"
                      name={`${i}_operation`}
                      defaultValue={'+'}
                      // onChange={handleChange}
                    >
                      <MenuItem value={'+'}>Masuk</MenuItem>
                      <MenuItem value={'-'}>Keluar</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="jumlah"
                    label="Jumlah"
                    InputProps={{ inputProps: { min: 0 } }}
                    name={`${i}_jumlah`}
                    defaultValue={0}
                    helperText={handleErrMsgField(`${i}_jumlah`)}
                    error={handleIsErrField(`${i}_jumlah`)}
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
