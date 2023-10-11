'use client';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import AddForm from '@/components/itemForm/Form';
import { addItems } from '@/api/items';
import { useState } from 'react';
import { Data, DataDto } from '@/model/item';
import { createRequestAdd } from '@/model/body';
import Loading from '@/components/loading/Loading';
import SnackbarError from '@/components/snackbar/error';
import { useRouter } from 'next/navigation';

export type ErrFieldMsg = Map<string, string>;

export default function AddItem() {
  const [openLoading, setOpenLoading] = useState(false);
  const [addFormLength, setAddFormLength] = useState(1);
  const [errorList, setErrorList] = useState<ErrFieldMsg>(new Map());
  const [openErrSnackbar, setOpenErrSnackbar] = useState(false);
  const [msgErrSnackbar, setMsgErrSnackbar] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let datas: DataDto[] = [];
    for (let i = 0; i < addFormLength; i++) {
      let code = data.get(`${i}_code`)?.toString();
      if (code == undefined) {
        return null;
      }
      let nama = data.get(`${i}_nama`)?.toString();
      if (nama == undefined) {
        return null;
      }
      let jumlah = data.get(`${i}_jumlah`)?.toString();
      if (jumlah == undefined) {
        return null;
      }
      let deskripsi = data.get(`${i}_deskripsi`)?.toString();
      if (deskripsi == undefined) {
        return null;
      }
      datas.push({
        code: code,
        nama: nama,
        jumlah: parseInt(jumlah),
        deskripsi: deskripsi === '' ? null : deskripsi,
        status_active: data.get(`${i}_status_active`) ? true : false,
      });
    }

    if (errorList.size > 0) {
      setMsgErrSnackbar('must resolve error first!');
      setOpenErrSnackbar(true);
      return null;
    }
    const body = createRequestAdd(datas);
    setOpenLoading(true);
    await addItems(body)
      .then((v) => {
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
        const msg = err.response.data.message;
        setMsgErrSnackbar(`failed add item ${msg ?? ''}`);
        setOpenErrSnackbar(true);
      })
      .finally(() => {
        setOpenLoading(false);
      });
  };
  const handleAddItem = () => {
    let idx = addFormLength;
    setAddFormLength(++idx);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" noWrap component="div">
          Add Item
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2} direction="row" sx={{ float: 'right' }}>
          <Button variant="outlined" endIcon={<HomeIcon />} href="/">
            Home
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mb: 2 }}
            endIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
          {[...Array(addFormLength)].map((x, i) => {
            return (
              <AddForm
                key={i}
                index={i}
                errorList={errorList}
                setErrorList={setErrorList}
              />
            );
          })}
          <Button
            type="submit"
            variant="outlined"
            // color="primary"
            endIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
      </Grid>
      <Loading open={openLoading} />
      <SnackbarError
        open={openErrSnackbar}
        setOpen={setOpenErrSnackbar}
        message={msgErrSnackbar}
      />
    </Grid>
  );
}
