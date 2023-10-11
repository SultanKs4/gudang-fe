import { ErrFieldMsg } from '@/app/add-item/page';
import {
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface IAddForm {
  index: number;
  errorList: ErrFieldMsg;
  setErrorList: Dispatch<SetStateAction<ErrFieldMsg>>;
}

export default function AddForm(props: IAddForm) {
  const handleValidation = async (
    event: React.FormEvent<HTMLDivElement> & {
      target: HTMLFormElement;
    }
  ) => {
    const field = event.target;
    const fieldName = field.name.split('_')[1];

    // code
    if (fieldName === 'code') {
      if (field.value.length == 0) {
        props.errorList.set(field.name, `tidak boleh kosong`);
        props.setErrorList(new Map(props.errorList));
        return;
      }

      if (field.value.length > 10) {
        props.errorList.set(field.name, `karakter melebihi ketentuan max(10)`);
        props.setErrorList(new Map(props.errorList));
        return;
      }
    } else {
      if (props.errorList.delete(field.name)) {
        props.setErrorList(new Map(props.errorList));
      }
    }

    // nama
    if (fieldName === 'nama') {
      if (field.value.length == 0) {
        props.errorList.set(field.name, `tidak boleh kosong`);
        props.setErrorList(new Map(props.errorList));
        return;
      }

      if (field.value.length > 20) {
        props.errorList.set(field.name, `karakter melebihi ketentuan max(20)`);
        props.setErrorList(new Map(props.errorList));
        return;
      }
    } else {
      if (props.errorList.delete(field.name)) {
        props.setErrorList(new Map(props.errorList));
      }
    }

    // jumlah
    if (fieldName === 'jumlah') {
      if (field.value.length == 0) {
        props.errorList.set(field.name, `tidak boleh kosong`);
        props.setErrorList(new Map(props.errorList));
        return;
      }

      if (field.value < 0) {
        props.errorList.set(field.name, `tidak boleh dibawah 0`);
        props.setErrorList(new Map(props.errorList));
        return;
      }
    } else {
      if (props.errorList.delete(field.name)) {
        props.setErrorList(new Map(props.errorList));
      }
    }
  };

  const handleIsErrField = (name: string) => {
    const msg = props.errorList.get(name);
    if (!msg) {
      return false;
    }
    return true;
  };

  const handleErrMsgField = (name: string) => {
    const msg = props.errorList.get(name);
    if (!msg) {
      return null;
    }
    return msg;
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ mb: 2, pb: 2 }}
      onChange={handleValidation}
    >
      <Grid item xs={12}>
        <Typography variant="h6" noWrap component="div">
          {`Item ke-${props.index + 1}`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          // autoComplete="given-name"
          name={`${props.index}_code`}
          required
          fullWidth
          id="code"
          label="Code"
          helperText={handleErrMsgField(`${props.index}_code`)}
          error={handleIsErrField(`${props.index}_code`)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="nama"
          label="Nama"
          name={`${props.index}_nama`}
          helperText={handleErrMsgField(`${props.index}_nama`)}
          error={handleIsErrField(`${props.index}_nama`)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          type="number"
          id="jumlah"
          label="Jumlah"
          name={`${props.index}_jumlah`}
          InputProps={{ inputProps: { min: 0 } }}
          defaultValue={0}
          helperText={handleErrMsgField(`${props.index}_jumlah`)}
          error={handleIsErrField(`${props.index}_jumlah`)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          id="deskripsi"
          label="Deskripsi"
          name={`${props.index}_deskripsi`}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          id="status_active"
          control={<Switch defaultChecked value={true} color="primary" />}
          label="Aktif"
          name={`${props.index}_status_active`}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
}
