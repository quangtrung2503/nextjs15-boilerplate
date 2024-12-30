"use client"
import { default as CommonStyles } from "@/components/common"
import { CommonButton } from "@/components/common/Button";
import CommonDialog from "@/components/common/Dialog";
import TableCommon, { HeadCell } from "@/components/common/Table";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import useToggleDialog from "@/hooks/useToggleDialog";
import cachedKeys from "@/constants/cachedKeys";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { useNotifications } from "@/helpers/toast";
import { useTranslations } from "next-intl";
import CommonIcons from "@/components/CommonIcons";
import useGetTags from "@/services/modules/tag/hook/useGetTags";
import tagServices from "@/services/modules/tag/tag.services";
import { headCells } from "./component/headCells";
import CreateEditTag from "./component/createEditTag";
import InputField from "../Component/customField/inputField";
import { CommonButtonAdmin } from "../Component/customField/commonButton";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Tag = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataTag, refetch: refetchTag, loading: loadingTag } = useGetTags(filters, { refetchKey: cachedKeys.fetchTags });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);
  const {showError} = useNotifications();
  const t = useTranslations("tagAdmin");
  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeleteTag = async (id: number) => {
    try {
      await tagServices.deleteTag(id);
      await refetchTag();
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
                placeholder={t("placeholderSearch")}
                control={methods.control}
                component={InputField}
                icon={<CommonIcons.Search className="tw-cursor-pointer tw-mr-3 tw-text-[28px] tw-text-primary" onClick={() => methods.handleSubmit(handleSearch)()} />}
              />
            </CommonStyles.Box>
            </form>
          </FormProvider>
        </CommonStyles.Box>
        <CommonButtonAdmin variant="outlined" className="active tw-text-nowrap tw-px-7" onClick={toggle} label={t("createNewTag")} />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataTag &&
          <TableCommon
            isLoading={loadingTag}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={filters.perPage}
            disableSort={false}
            selected={selected}
            totalCount={dataTag.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeleteTag,t })}
            rows={dataTag?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
            labelNoData={t("labelNoData")}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={()=>setId(null)} open={open} toggle={toggle} body={<CreateEditTag id={Number(id)} handleClose={handleClose} />} />}
    </CommonStyles.Box>
  );
}

export default Tag;