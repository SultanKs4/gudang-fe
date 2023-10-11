import {
  IDataTables,
  IRequestAdd,
  IRequestEdit,
  IRequestStock,
} from '@/model/body';
import axios from 'axios';

async function addItems(body: IRequestAdd) {
  return await axios({
    method: 'post',
    url: 'http://localhost:8000/v1/item',
    data: body,
  });
  // .then<IResponseAdd>((res) => res.data)
  // .catch((err) => err);
}

async function editItems(body: IRequestEdit) {
  return await axios({
    method: 'put',
    url: 'http://localhost:8000/v1/item',
    data: body,
  });
  // .then<IResponseAdd>((res) => res.data)
  // .catch((err) => err);
}

async function editStocks(body: IRequestStock) {
  return await axios({
    method: 'put',
    url: 'http://localhost:8000/v1/item/stock',
    data: body,
  });
  // .then<IResponseAdd>((res) => res.data)
  // .catch((err) => err);
}

async function getItemsAll() {
  return await axios({
    method: 'get',
    url: 'http://localhost:8000/v1/item',
    params: { limit: 9999 },
  }).then<IDataTables>((res) => res.data);
}

export { addItems, editItems, editStocks, getItemsAll };
