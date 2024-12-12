"use client"
import { default as CommonStyles } from "@/components/common"
import { CommonButton } from "@/components/common/Button";
import CommonDialog from "@/components/common/Dialog";
import TableCommon, { HeadCell } from "@/components/common/Table";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import useGetCities from "@/services/modules/city/hook/useGetAllCity";
import { City as ICity } from "@/services/modules/city/interfaces/city";

const City = () => {
  const { filters, selected, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({});
  const { data: rows } = useGetCities(filters);
  const {open,toggle,shouldRender} = useToggleDialog();
  const headCells: HeadCell<ICity>[] = [
    {
      id: "id",
      label: "ID",
      numeric: true,
      Cell(row: ICity, _index) {
        return <span>{row.id}</span>
      },
    },
    {
      id: "name",
      label: "Name",
      numeric: false,
      Cell(row: ICity, _index) {
        return <span>{row.name}</span>
      },
    }
  ]
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-end tw-mb-5">
      <CommonButton onClick={toggle} label="Create new city" />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {rows &&
          <TableCommon
            sxTableHead={{fontWeight: "bold"}}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={rows.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells}
            rows={rows?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog open={open} toggle={toggle} title="Create new city" body={<h1>HIHI</h1>} />}
    </CommonStyles.Box>
  );
}

export default City;