import { OrderType } from "@/interfaces/common";
import { SxProps } from "@mui/material";


export enum ORDER_BY {
  DESC = "desc",
  ASC = "asc",
}
interface TableCommonProps<T> {
  order?: OrderType;
  orderBy?: ORDER_BY;
  selected: readonly (string | number)[];
  page: number;
  rowsPerPage?: number;
  rows: T[];
  totalCount: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleSelectAllClick?: (
    event: React.ChangeEvent<HTMLInputElement>,
    rows: T[],
    key?: string
  ) => void;
  handleCheckBox?: (value: T, key: string) => void;
  handleRequestSort: (event: React.MouseEvent<unknown>, property: keyof any) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showCheckBox?: boolean;
  noPagination?: boolean;
  keyPrimary?: string;
  isLoading?: boolean;
  sxTableHead?: SxProps;
  sortByIsNotActived?: string[];
  onClick?: (row: T) => void;
  styleRow?: any;
  isSummary?: boolean;
  disableSort?: boolean;
  actionSelectedMenu?: {
    label: string;
    action: (selectedItem: readonly (string | number)[]) => void;
  }[];
  labelActionMenu?: (numberSelected: number) => React.ReactNode;
}


export const CommonTable = <T,>(props: TableCommonProps<T>) => {
  
}