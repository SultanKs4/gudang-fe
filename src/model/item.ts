export interface Data {
  id: number;
  code: string;
  nama: string;
  jumlah: number;
  deskripsi?: string;
  status_active: boolean;
}

export interface DataDto {
  code: string;
  nama: string;
  jumlah: number;
  deskripsi?: string | null;
  status_active: boolean;
}

export function createData(
  id: number,
  code: string,
  nama: string,
  jumlah: number,
  deskripsi: string,
  status_active: boolean
): Data {
  return { id, code, nama, jumlah, deskripsi, status_active };
}
