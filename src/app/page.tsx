'use client';
import {
  Button,
  ExtendButtonBase,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import ItemTable from '@/components/itemTable/Table';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowIcon from '@mui/icons-material/CompareArrows';
import { Data } from '@/model/item';
import EditItems from '@/components/modal/EditItems';
import EditStocks from '@/components/modal/EditStock';
import SnackbarSuccess from '@/components/snackbar/success';
import SnackbarError from '@/components/snackbar/error';

export default function Home() {
  const [selected, setSelected] = useState<Data[]>([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalStock, setOpenModalStock] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [msgSuccessSnackbar, setMsgSuccessSnackbar] = useState<string>('');
  const [openErrSnackbar, setOpenErrSnackbar] = useState(false);
  const [msgErrSnackbar, setMsgErrSnackbar] = useState<string>('');

  const handleOnClickEdit = () => {
    setOpenModalEdit(true);
  };

  const handleOnClickStock = () => {
    setOpenModalStock(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" noWrap component="div">
          Item
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2} direction="row" sx={{ float: 'right' }}>
          {selected.length == 0 ? (
            <Button variant="outlined" endIcon={<AddIcon />} href="/add-item">
              Add
            </Button>
          ) : (
            [
              <Button
                key={0}
                variant="outlined"
                color="secondary"
                endIcon={<CompareArrowIcon />}
                onClick={handleOnClickStock}
              >
                Edit Stock
              </Button>,
              <Button
                key={1}
                variant="outlined"
                endIcon={<EditIcon />}
                onClick={handleOnClickEdit}
              >
                Edit
              </Button>,
              // <Button
              //   variant="outlined"
              //   color="error"
              //   endIcon={<DeleteIcon />}
              //   onClick={handleOnClickEdit}
              // >
              //   Delete
              // </Button>,
            ]
          )}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <ItemTable
          openModalEdit={openModalEdit}
          openModalStock={openModalStock}
          setSelected={setSelected}
        />
        <EditItems
          open={openModalEdit}
          setOpen={setOpenModalEdit}
          selectedData={selected}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setMsgSuccessSnackbar={setMsgSuccessSnackbar}
          setOpenErrSnackbar={setOpenErrSnackbar}
          setMsgErrSnackbar={setMsgErrSnackbar}
        />
        <EditStocks
          open={openModalStock}
          setOpen={setOpenModalStock}
          selectedData={selected}
          setOpenSuccessSnackbar={setOpenSuccessSnackbar}
          setMsgSuccessSnackbar={setMsgSuccessSnackbar}
          setOpenErrSnackbar={setOpenErrSnackbar}
          setMsgErrSnackbar={setMsgErrSnackbar}
        />
      </Grid>
      <SnackbarSuccess
        open={openSuccessSnackbar}
        setOpen={setOpenSuccessSnackbar}
        message={msgSuccessSnackbar}
      />
      <SnackbarError
        open={openErrSnackbar}
        setOpen={setOpenErrSnackbar}
        message={msgErrSnackbar}
      />
    </Grid>
  );
}
