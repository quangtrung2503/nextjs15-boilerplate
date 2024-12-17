import { Menu, PaginationItem, SxProps, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Pagination, { PaginationProps } from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Theme, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Order, OrderType } from '@/interfaces/common';
import {default as CommonStyles} from "@/components/common";
import { CommonButton } from './Button';
import HeadFilters, { RenderComponentHeadFilter, TypeOfFilterHeader } from './HeaderFilter';


const PaperProps = {
  elevation: 0,
  sx: {
    // padding: '0 0.5rem',
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
    ul: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: 150,
      li: {
        // width: '284px',
        padding: '8px 12px',
        minWidth: 150,
        ':hover': {
          borderRadius: 1,
        },
      },
    },
  },
};

interface EnhancedTableProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: OrderType;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell<T>[];
  showCheckBox?: boolean;
  noPagination?: boolean;
  sxTableHead?: SxProps;
  sortByIsNotActived?: string[];
  disableSort?: boolean;
  selectedItem?: readonly (string | number)[];
  actionSelectedMenu?: {
    label: string;
    action: (selectedItem: readonly (string | number)[]) => void;
  }[];
  labelActionMenu?: (numSelected: number) => React.ReactNode;
}

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    sxTableHead,
    sortByIsNotActived,
    disableSort = true,
    selectedItem = [],
    actionSelectedMenu = [],
    labelActionMenu,
  } = props;
  const t = useTranslations();
  const theme = useTheme();
  const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
    const fieldCanSortBy = !sortByIsNotActived?.includes(property?.toString());
    if (fieldCanSortBy) {
      onRequestSort(event, property);
    }
    return;
  };
  const isNotActiveSortBy = (item: string) => {
    const value = sortByIsNotActived?.includes(item || '');
    return value;
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderOptionSelectedCheckbox = () => {
    return (
      <TableCell colSpan={props.headCells.length}>
        <FormControl
          size='small'
          sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}
        >
          <CommonStyles.Typography component='span' sx={{ textTransform: 'none' }}>
            {"Yes"}{' '}
            <CommonStyles.Typography
              component='span'
              type='size14Weight500'
            >
              {labelActionMenu ? labelActionMenu(numSelected) : `${numSelected} bản ghi`}{' '}
            </CommonStyles.Typography>
            {"Selected"}
          </CommonStyles.Typography>
          <CommonButton
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant='contained'
            sx={{ m: 0, minWidth: 150 }}
          >
            {"SelectAction"}
          </CommonButton>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            PaperProps={PaperProps}
          >
            {actionSelectedMenu.map((e) => (
              <MenuItem
                key={e.label}
                onClick={() => {
                  e.action(selectedItem);
                  handleClose();
                }}
              >
                {e.label}
              </MenuItem>
            ))}
          </Menu>
        </FormControl>
      </TableCell>
    );
  };

  return (
    <TableHead>
      <TableRow>
        {props?.showCheckBox && (
          <TableCell padding='checkbox'>
            <Checkbox
              sx={{ p: 0 }}
              color='warning'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        )}
        {numSelected
          ? renderOptionSelectedCheckbox()
          : props.headCells.map(
              (
                headCell: { [key: string]: any; renderFilters?: RenderComponentHeadFilter },
                idx: number
              ) => {
                const needStickey = headCell?.id === 'action' || !headCell?.label;
                const hasFilters = !!headCell?.renderFilters;

                const Wrapper = hasFilters ? CommonStyles.Box : React.Fragment;
                const propsWrapper = hasFilters
                  ? {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  : undefined;

                if (headCell.isHided) {
                  return null;
                }

                if (disableSort || headCell?.disableSort) {
                  const style = needStickey
                    ? {
                        position: 'sticky',
                        right: 0,
                        backgroundColor: '#f2f7fa',
                        boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
                        zIndex: 20,
                      }
                    : {};

                  return (
                    <TableCell
                      key={headCell.id}
                      // align={headCell.numeric ? 'right' : 'left'}
                      // align={'center'}
                      padding={headCell.disablePadding ? 'none' : 'normal'}
                      sortDirection={orderBy === headCell.id ? order : false}
                      sx={
                        sxTableHead
                          ? { ...sxTableHead }
                          : {
                              whiteSpace: 'nowrap',
                              ...style,
                            }
                      }
                    >
                      <Wrapper {...propsWrapper}>
                        {headCell.label}

                        {hasFilters && (
                          <HeadFilters
                            type={TypeOfFilterHeader.dialog}
                            renderComponent={headCell.renderFilters}
                          />
                        )}
                      </Wrapper>
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={headCell.id}
                    // align={headCell.numeric ? 'right' : 'left'}
                    // align={'center'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={sxTableHead}
                  >
                    <Wrapper {...propsWrapper}>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                        hideSortIcon={isNotActiveSortBy(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component='span' sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>

                      {hasFilters && (
                        <HeadFilters
                          type={TypeOfFilterHeader.dialog}
                          renderComponent={headCell.renderFilters}
                        />
                      )}
                    </Wrapper>
                  </TableCell>
                );
              }
            )}
      </TableRow>
    </TableHead>
  );
}

export interface HeadCell<T> {
  disablePadding?: boolean;
  id: keyof any;
  label?: string | React.ReactNode;
  numeric?: boolean;
  disableSort?: boolean;
  renderFilters?: RenderComponentHeadFilter;
  Cell?: (row: T, index: number) => React.ReactElement;
  isHided?: boolean;
  total?: number | string;
  sxCell?: any;
}

interface TableCommonProps<T> {
  order?: OrderType;
  orderBy?: any;
  selected: readonly (string | number)[];
  page: number;
  rowsPerPage?: number;
  rows: T[];
  headCells: HeadCell<T>[];
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

function TableCommon<T>({
  order,
  orderBy,
  selected,
  page,
  rowsPerPage,
  rows,
  headCells,
  totalCount,
  showCheckBox,
  noPagination,
  keyPrimary = 'id',
  isLoading,
  handleCheckBox,
  handleChangePage,
  handleSelectAllClick,
  handleRequestSort,
  handleChangeRowsPerPage,
  sxTableHead,
  sortByIsNotActived,
  onClick,
  styleRow,
  isSummary,
  disableSort = true,
  actionSelectedMenu = [],
  labelActionMenu,
}: TableCommonProps<T>) {
  const theme = useTheme();
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const t = useTranslations();
  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > START_PAGE ? Math.max(0, (1 + page) * (rowsPerPage || 5) - totalCount) : 0;

  const renderTableRow = (row: T[]) => {
    return (
      <>
        {rows.map((row, index) => {
          const rowAny = row as any;
          const isItemSelected = isSelected(rowAny?.[keyPrimary] || '');
          const labelId = `enhanced-table-checkbox-${index}-${keyPrimary}` as any;

          return (
            <TableRow
              hover
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={labelId}
              selected={isItemSelected}
              onClick={() => onClick?.(row)}
              sx={{
                ...styleRow?.(row),
                ':hover': {
                  '#action': {
                    background: '#f4f4f5',
                  },
                },
              }}
            >
              {showCheckBox && (
                <TableCell padding='checkbox'>
                  <Checkbox
                    sx={{ p: 0 }}
                    color='warning'
                    checked={isItemSelected}
                    onClick={() => {
                      handleCheckBox && handleCheckBox(row, keyPrimary);
                    }}
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </TableCell>
              )}
              {headCells.map((hc, idx) => {
                const needStickey = hc?.id === 'action' || !hc?.label;

                const style = needStickey
                  ? {
                      position: 'sticky',
                      right: 0,
                      background: index % 2 === 0 ? '#ffffff' : '#f4f4f5',
                    }
                  : {};
                if (hc.isHided) {
                  return null;
                }

                return (
                  <TableCell
                    key={`cell-${index}-${idx}`}
                    sx={{ '& .MuiButton-outlined': { mb: 0 }, ...style, ...hc.sxCell }}
                    id='action'
                  >
                    {hc?.Cell?.(rowAny, index) || rowAny?.[hc?.id]}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
        {isSummary ? (
          <TableRow>
            {showCheckBox && (
              <TableCell sx={{ position: 'relative', height: '4rem' }}>
                <CommonStyles.Typography
                  overflow='hidden'
                  whiteSpace='nowrap'
                  type='size20Weight800'
                  position='absolute'
                  left='16px'
                  top='50%'
                  sx={{ transform: 'translateY(-50%)' }}
                >
                  {"Summary"}
                </CommonStyles.Typography>
              </TableCell>
            )}
            {headCells.map((hc, idx) => {
              return (
                <TableCell
                  key={`cell-summary-${idx}`}
                  sx={{ position: 'relative', height: '4rem' }}
                >
                  <CommonStyles.Box>
                    <CommonStyles.Typography
                      overflow='hidden'
                      whiteSpace='nowrap'
                      type='size16Weight600'
                      // position='absolute'
                      // left='16px'
                      // top='50%'
                      // sx={{ transform: 'translateY(-50%)' }}
                    >
                      {idx === 0 && !showCheckBox
                        ? "Summary"
                        : hc?.total
                        ? (Number(hc?.total || '0'))
                        : null}
                    </CommonStyles.Typography>
                  </CommonStyles.Box>
                </TableCell>
              );
            })}
          </TableRow>
        ) : null}
      </>
    );
  };

  return (
    <CommonStyles.Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer className='custom-for-me'>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
            <EnhancedTableHead
              numSelected={selected?.length}
              order={order ? order : Order.asc}
              orderBy={orderBy}
              onSelectAllClick={(e) => {
                handleSelectAllClick && handleSelectAllClick(e, rows, keyPrimary);
              }}
              onRequestSort={handleRequestSort}
              rowCount={totalCount}
              headCells={headCells}
              showCheckBox={showCheckBox}
              sxTableHead={sxTableHead}
              sortByIsNotActived={sortByIsNotActived}
              disableSort={disableSort}
              selectedItem={selected}
              actionSelectedMenu={actionSelectedMenu}
              labelActionMenu={labelActionMenu}
            />
            <TableBody>
              {!isLoading && totalCount !== 0 && renderTableRow(rows)}
              {!isLoading && totalCount === 0 && (
                <TableRow
                // style={{ height: 53 * emptyRows }}
                >
                  <TableCell colSpan={headCells.length}>
                    <CommonStyles.Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 1,
                        fontSize: '14px',
                      }}
                    >
                      "Icon No Data"
                      <CommonStyles.Typography
                        variant='body1'
                      >
                        "Nodata"
                      </CommonStyles.Typography>
                    </CommonStyles.Box>
                  </TableCell>
                </TableRow>
              )}

              {isLoading && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={headCells.length}>
                    <CommonStyles.Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <CommonStyles.Loading />
                    </CommonStyles.Box>
                  </TableCell>
                </TableRow>
              )}

              {/* {!isLoading && emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>

        {noPagination ? (
          <Box></Box>
        ) : (
          <CommonStyles.Box
            sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', px: 2 }}
          >
            <TablePagination
              rowsPerPageOptions={[10, 30, 50]}
              component='div'
              count={totalCount}
              rowsPerPage={rowsPerPage ? rowsPerPage : 5}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ style: { display: 'none' } }}
              backIconButtonProps={{ style: { display: 'none' } }}
              // labelRowsPerPage={"Dòng mỗi trang"}
              // labelDisplayedRows={({ from, to, count, page }) =>
              //   "t('Common.displayedRow', { from, to, count })"
              // }
            />
            {/* <CustomPagination
              className='pagination-list'
              count={Math.ceil(totalCount / (rowsPerPage || 1))}
              size='medium'
              page={page}
              variant='outlined'
              color='primary'
              onChange={(e, page) => handleChangePage(e, page - 1)}
              renderItem={(item) => <PaginationItem className='pagination-item' {...item} />}
            /> */}
          </CommonStyles.Box>
        )}
      </Paper>
    </CommonStyles.Box>
  );
}

// const CustomPagination = styled(Pagination)<PaginationProps>(({ theme }) => ({
//   '& nav': {
//     borderRadius: '4px',
//   },
//   '& ul > li': {
//     '& .Mui-selected': {
//       background: theme.colors?.primaryDefault,
//       color: theme.colors?.white,
//       borderColor: theme.colors?.primaryDefault,
//       ':hover': {
//         background: theme.colors?.primaryDefault,
//       },
//     },
//     '& button': {
//       borderRadius: 0,
//       margin: 0,
//       ':hover': {
//         background: `${theme.colors?.primary100}50`,
//       },
//     },
//     ':nth-child(2n)': {
//       '& button': {
//         borderRightWidth: 0,
//         borderLeftWidth: 0,
//       },
//     },
//     ':first-child': {
//       '& button': {
//         borderTopLeftRadius: '4px',
//         borderBottomLeftRadius: '4px',
//       },
//     },
//     ':last-child': {
//       '& button': {
//         borderTopRightRadius: '4px',
//         borderBottomRightRadius: '4px',
//       },
//     },
//     '& div': {
//       border: '1px solid rgba(0, 0, 0, 0.23)',
//       borderRadius: 0,
//       height: '32px',
//       justifyContent: 'center',
//       alignItems: 'center',
//       display: 'flex',
//       margin: 0,
//     },
//   },
// }));

export default TableCommon;
