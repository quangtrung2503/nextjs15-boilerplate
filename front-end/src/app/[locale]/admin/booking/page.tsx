"use client"

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import TableCommon from "@/components/common/Table";
import { useTranslations } from "next-intl";
import CommonIcons from "@/components/CommonIcons";
import InputField from "../Component/customField/inputField";
import useGetBookings from "@/services/modules/booking/hooks/useGetBookings";
import { headCells } from "./component/headCell";
import CommonDialog from "@/components/common/Dialog";
import SelectField from "../Component/customField/selectField";
import RefundBooking from "./component/refundBooking";
import { BookingStatus, getOptionEnum } from "@/helpers/common";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
  status: number[];
}
const Booking = () => {
  //State
  const [id, setId] = useState<number | null>(null);
  const BookingStatusOption = getOptionEnum(BookingStatus);

  //Hook
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataBooking, total, refetch: refetchBooking, loading: loadingBooking } = useGetBookings(filters, { refetchKey: cachedKeys.fetchBookings });
  dataBooking?.forEach((e) => {
    console.log('e.RequestRefund', e.RequestRefund)
  })
  
  const { open, toggle, shouldRender } = useToggleDialog();
  const t = useTranslations("bookingAdmin")
  const methods = useForm<FormSearch>({
    defaultValues: { textSearch: "", sortOrder: "desc" },
  });

  //Function
  const handleRefundBooking = (id: number) => {
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
  const handleClose = () => {
    toggle();
    setId(null);
  }


  //Function Render

  //Render
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-mb-5 tw-items-center">
        <CommonStyles.Box className="tw-w-full">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSearch)} className="tw-flex">
                <RHFField
                  className="tw-bg-white"
                  name="textSearch"
                  placeholder={t("placeholderSearch")}
                  control={methods.control}
                  component={InputField}
                  icon={
                    <CommonIcons.Search
                      className="tw-cursor-pointer tw-text-[28px] tw-text-primary"
                      onClick={() => methods.handleSubmit(handleSearch)()}
                    />
                  }
                />

              <CommonStyles.Box className="tw-w-1/5 tw-ml-3 tw-bg-white">
                <RHFField
                  name="status"
                  placeholder={t("status")}
                  control={methods.control}
                  component={SelectField}
                  options={BookingStatusOption}
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
            totalCount={total}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleRefundBooking, t})}
            rows={dataBooking}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={() => setId(null)} open={open} toggle={toggle} body={<RefundBooking handleClose={handleClose} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Booking;