"use client";

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import TableCommon from "@/components/common/Table";
import { useTranslations } from "next-intl";
import CommonIcons from "@/components/CommonIcons";
import InputField from "../Component/customField/inputField";
import useGetBookings from "@/services/modules/booking/hooks/useGetBookings";
import { headCells } from "./component/headCell";
import { BookingStatus } from "@/helpers/common";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Booking = () => {
  //State

  //Hook
  const {
    filters,
    selected,
    setFilters,
    handleChangePage,
    handleChangeRowsPerPage: changeRowPerPage,
    handleRequestSort,
    handleSelectAllClick: handleSelectAll,
    handleCheckBox,
  } = useFiltersHandler({
    page: 1,
    perPage: 10,
    statuses: BookingStatus.PENDING,
  });
  const {
    data: dataBooking,
    loading: loadingBooking,
  } = useGetBookings(filters, { refetchKey: cachedKeys.fetchBookings });
  const t = useTranslations("bookingAdmin");

  const methods = useForm<FormSearch>({
    defaultValues: { textSearch: "", sortOrder: "desc" },
  });

  //Function

  const handleSearch: SubmitHandler<FormSearch> = async (data: FormSearch) => {
    setFilters((prev) => {
      return {
        ...prev,
        textSearch: data.textSearch,
        sortOrder: data.sortOrder,
      };
    });
  };

  //Function Render

  //Render
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-mb-5 tw-items-center">
        <CommonStyles.Box className="tw-w-full">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSearch)}
              className="tw-flex tw-items-center"
            >
              <CommonStyles.Box className="tw-w-[100%]">
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
              </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataBooking && (
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
            headCells={headCells({ t })}
            rows={dataBooking?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />
        )}
      </CommonStyles.Box>
    </CommonStyles.Box>
  );
};

export default Booking;
