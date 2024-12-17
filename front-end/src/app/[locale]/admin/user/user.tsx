"use client"

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import useGetUsers from "@/services/modules/user/hook/useGetAllUser";
import userServices from "@/services/modules/user/user.services";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import TableCommon from "@/components/common/Table";
import { headCells } from "./component/headCells";
import CommonDialog from "@/components/common/Dialog";
import CreateEditUser from "./component/createEditUser";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const User = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataUser, refetch: refetchUser, loading: loadingUser } = useGetUsers(filters, { refetchKey: cachedKeys.fetchUsers });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);

  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeleteUser = async (id: number) => {
    try {
      await userServices.deleteUser(id);
      await refetchUser();
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
                  placeholder="Search User"
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
        <CommonStyles.CommonButton className="tw-text-nowrap" onClick={toggle} label="Create new User" />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataUser &&
          <TableCommon
            isLoading={loadingUser}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataUser.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeleteUser })}
            rows={dataUser?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog
        onClose={() => setId(null)}
        open={open}
        toggle={toggle}
        body={<CreateEditUser toggle={toggle} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default User;