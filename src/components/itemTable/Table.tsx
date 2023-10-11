'use client';
import * as React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { useState, useEffect } from 'react';
import { getItemsAll } from '@/api/items';
import { Data } from '@/model/item';
import { IDataTables } from '@/model/body';

interface ITable {
  openModalEdit: boolean;
  openModalStock: boolean;
  setSelected: React.Dispatch<React.SetStateAction<Data[]>>;
}

const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Code',
    type: 'string',
    width: 180,
  },
  { field: 'nama', headerName: 'Nama', width: 230 },
  {
    field: 'jumlah',
    headerName: 'Jumlah',
    type: 'number',
    width: 150,
    align: 'left',
    headerAlign: 'left',
  },
  { field: 'deskripsi', headerName: 'Deskripsi', width: 350 },
  {
    field: 'status_active',
    headerName: 'Status Active',
    width: 180,

    type: 'boolean',
  },
];

export default function ItemTable(props: ITable) {
  const [listData, setListData] = useState<IDataTables>();
  const [data, setData] = useState<Array<Data>>([]);

  useEffect(() => {
    if (props.openModalEdit || props.openModalStock) {
      return;
    }
    getItemsAll().then((v) => {
      setListData(v);
      setData(v.data);
    });
  }, [props.openModalEdit, props.openModalStock]);

  const onRowSelectionHandle = (newRow: GridRowSelectionModel) => {
    // setRowSelectionModel(newRow);
    if (newRow.length < 1) {
      props.setSelected([]);
    }
    const selectedIDs = new Set(newRow);
    const selectedData = data.filter((row) => selectedIDs.has(row.id));
    props.setSelected(selectedData);
  };

  return (
    <DataGrid
      rows={data || []}
      columns={columns}
      sx={{
        minHeight: 630,
      }}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 },
        },
      }}
      pageSizeOptions={[5, 10, 15]}
      checkboxSelection
      rowSelection
      onRowSelectionModelChange={onRowSelectionHandle}
      rowCount={listData?.total_data || 0}
    />
  );
}
