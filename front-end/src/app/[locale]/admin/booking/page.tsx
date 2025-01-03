"use client"

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {default as CommonStyles} from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import TableCommon from "@/components/common/Table";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import CommonIcons from "@/components/CommonIcons";
import InputField from "../Component/customField/inputField";
import useGetBookings from "@/services/modules/booking/hooks/useGetBookings";
import { headCells } from "./component/headCell";
import EditBooking from "./component/editBooking";
import CommonDialog from "@/components/common/Dialog";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Booking = () => {
  //State
  const [id, setId] = useState<number | null>(null);

  //Hook
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataBooking, refetch: refetchBooking, loading: loadingBooking } = useGetBookings(filters, { refetchKey: cachedKeys.fetchBookings });
  const { open, toggle, shouldRender } = useToggleDialog();
  const t = useTranslations("bookingAdmin")
  const methods = useForm<FormSearch>({
    defaultValues: { textSearch: "", sortOrder: "desc" },
  });
  
  //Function
  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }

  const handleSearch: SubmitHandler<FormSearch> = async (data: FormSearch) => {
    setFilters((prev) => {
      return {
        ...prev,
        textSearch: data.textSearch,
        sortOrder: data.sortOrder
      }
    })
  };
  const handleClose = ()=>{
    toggle();
    setId(null);
  }


  //Function Render

  //Render
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-mb-5 tw-items-center">
        <CommonStyles.Box className="tw-w-full">
          <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(handleSearch)} className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-w-[100%] tw-mr-9">
              <RHFField
                className="tw-bg-white"
                name="textSearch"
                placeholder={t("placeholderSearch")}
                control={methods.control}
                component={InputField}
                icon={<CommonIcons.Search className="tw-cursor-pointer tw-mr-3 tw-text-[28px] tw-text-primary" onClick={() => methods.handleSubmit(handleSearch)()} />}
              />
            </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataBooking &&
          <TableCommon
            isLoading={loadingBooking}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataBooking.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, t })}
            rows={dataBooking?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={()=>setId(null)} open={open} toggle={toggle} body={<EditBooking handleClose={handleClose} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Booking;