"use client"

import cachedKeys from "@/constants/cachedKeys";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {default as CommonStyles} from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { CommonButton } from "@/components/common/Button";
import TableCommon from "@/components/common/Table";
import CommonDialog from "@/components/common/Dialog";
import { useNotifications } from "@/helpers/toast";
import tourServices from "@/services/modules/tour/tour.services";
import useGetTours from "@/services/modules/tour/hooks/useGetAllTour";
import { useTranslations } from "next-intl";
import { headCells } from "./component/headCells";
import CreateEditTour from "./component/createEditTour";
import CommonIcons from "@/components/CommonIcons";
import InputField from "../Component/customField/inputField";
import { CommonButtonAdmin } from "../Component/customField/commonButton";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Tour = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataTour, refetch: refetchTour, loading: loadingTour } = useGetTours(filters, { refetchKey: cachedKeys.fetchTours });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);
  const {showError} = useNotifications();
  const t = useTranslations();


  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeleteTour = async (id: number) => {
    try {
      await tourServices.deleteTour(id);
      await refetchTour();
    }
    catch (error) {
      showError(error);
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
  const handleClose = ()=>{
    toggle();
    setId(null);
  }
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
                placeholder={t("tourAdmin.placeholderSearch")}
                control={methods.control}
                component={InputField}
                icon={<CommonIcons.Search className="tw-cursor-pointer tw-mr-3 tw-text-[28px] tw-text-primary" onClick={() => methods.handleSubmit(handleSearch)()} />}
              />
            </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
        <CommonButtonAdmin variant="outlined" className="active tw-text-nowrap tw-px-7" onClick={toggle} label={t("tourAdmin.createNewTour")} />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataTour &&
          <TableCommon
            isLoading={loadingTour}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataTour.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeleteTour,t })}
            rows={dataTour?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog maxWidth="md" onClose={() => setId(null)} open={open} toggle={toggle} body={<CreateEditTour handleClose={handleClose} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Tour;