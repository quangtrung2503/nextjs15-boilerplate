"use client"

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import useGetThemes from "@/services/modules/theme/hook/useGetAllTheme";
import themeServices from "@/services/modules/theme/theme.services";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {default as CommonStyles} from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import { CommonButton } from "@/components/common/Button";
import TableCommon from "@/components/common/Table";
import { headCells } from "./component/headCells";
import CommonDialog from "@/components/common/Dialog";
import CreateEditTheme from "./component/createEditTheme";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Theme = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataTheme, refetch: refetchTheme, loading: loadingTheme } = useGetThemes(filters, { refetchKey: cachedKeys.fetchThemes });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);

  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeleteTheme = async (id: number) => {
    try {
      await themeServices.deleteTheme(id);
      await refetchTheme();
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
              <CommonStyles.Box  className="tw-w-[20%]">
              <RHFField
                name="textSearch"
                placeholder="Search Theme"
                control={methods.control}
                component={InputField}
              />
              </CommonStyles.Box>
              {/* <RHFField
                name="sortOrder"
                options={[
                  {
                    key: "1",
                    label: "DESC",
                    value: "desc"
                  },
                  {
                    key: "2",
                    label: "ASC",
                    value: "asc"
                  }
                ]}
                className="tw-w-[20%] tw-ml-5"
                control={methods.control}
                fullWidth={false}
                placeholder="Sort"
                component={SelectField}
              /> */}
              <CommonStyles.Box className="tw-w-[20%]">
                <CommonStyles.CommonButton variant="outlined" className="outlined rounded tw-ml-5 tw-w-full" type="submit">Search</CommonStyles.CommonButton>
              </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
        <CommonButton className="tw-text-nowrap" onClick={toggle} label="Create new Theme" />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataTheme &&
          <TableCommon
            isLoading={loadingTheme}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataTheme.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeleteTheme })}
            rows={dataTheme?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={() => setId(null)} open={open} toggle={toggle} body={<CreateEditTheme toggle={toggle} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Theme;