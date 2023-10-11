import { Data, DataDto } from './item';
import { StockItem } from './stock';

export interface IMeta {
  message: string;
}

export interface IRequestAdd {
  items: Array<DataDto>;
}

export function createRequestAdd(items: Array<DataDto>): IRequestAdd {
  return { items: items };
}

export interface IRequestEdit {
  items: Array<Data>;
}

export function createRequestEdit(items: Array<Data>): IRequestEdit {
  return { items: items };
}

export interface IRequestStock {
  items: Array<StockItem>;
}

export function createRequestStock(items: Array<StockItem>): IRequestStock {
  return { items: items };
}

export interface IResponseAdd {
  data: Array<Data>;
  meta: IMeta;
}

export interface IDataTables {
  limit: number;
  page: number;
  sort: string;
  total_data: number;
  total_page: number;
  data: Array<Data>;
}
