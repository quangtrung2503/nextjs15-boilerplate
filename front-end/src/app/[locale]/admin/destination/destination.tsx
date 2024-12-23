"use client"
import { default as CommonStyles } from "@/components/common"
import { CommonButton } from "@/components/common/Button";
import CommonDialog from "@/components/common/Dialog";
import TableCommon, { HeadCell } from "@/components/common/Table";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import cachedKeys from "@/constants/cachedKeys";
import destinationServices from "@/services/modules/destination/destination.services";
import useGetDestinations from "@/services/modules/destination/hook/useGetAllDestination";
import { headCells } from "./component/headCell";
import CreateEditDestination from "./component/createEditDestination";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Destination = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataDestination, refetch: refetchDestination, loading: loadingDestination } = useGetDestinations(filters, { refetchKey: cachedKeys.fetchDestinations });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);

  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeleteDestination = async (id: number) => {
    try {
      await destinationServices.deleteDestination(id);
      await refetchDestination();
    }
    catch (error) {
      console.error(error);
    }
  }
  const methods = useForm<FormSearch>({
    defaultValues: { textSearch: "", sortOrder: "desc" },
  });
  const handleSearch: SubmitHandler<FormSearch> = async (data: FormSearch) => {
    setFilters((prev) => {
      return {
        ...prev,
        textSearch: data.textSearch,
        sortOrder: data.sortOrder
      }
    })
  };
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-mb-5 tw-items-center">
        <CommonStyles.Box className="tw-w-full">
          <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(handleSearch)} className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-w-[20%]">
              <RHFField
                name="textSearch"
                placeholder="Search Destination"
                control={methods.control}
                component={InputField}
              />
            </CommonStyles.Box>
              <CommonStyles.Box className="tw-w-[20%]">
                <CommonStyles.CommonButton variant="outlined" className="outlined rounded tw-ml-5 tw-w-full" type="submit">Search</CommonStyles.CommonButton>
              </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
        <CommonButton className="tw-text-nowrap tw-px-7" onClick={toggle} label="Create new Destination" />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataDestination &&
          <TableCommon
            isLoading={loadingDestination}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataDestination.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeleteDestination })}
            rows={dataDestination?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={() => setId(null)} open={open} toggle={toggle} body={<CreateEditDestination toggle={toggle} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Destination;