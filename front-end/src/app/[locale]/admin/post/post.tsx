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
import SelectField from "@/components/customReactFormField/SelectField";
import useGetPosts from "@/services/modules/post/hook/useGetAllPost";
import cachedKeys from "@/constants/cachedKeys";
import postServices from "@/services/modules/post/post.services";
import { headCells } from "./component/headCells";
import CreateEditPost from "./component/createEditPost";
import { useNotifications } from "@/helpers/toast";

interface FormSearch {
  textSearch: string;
  sortOrder: string;
}
const Post = () => {
  const { filters, selected, setFilters, handleChangePage, handleChangeRowsPerPage: changeRowPerPage, handleRequestSort, handleSelectAllClick: handleSelectAll, handleCheckBox, } = useFiltersHandler({
    page: 1,
    perPage: 10
  });
  const { data: dataPost, refetch: refetchPost, loading: loadingPost } = useGetPosts(filters, { refetchKey: cachedKeys.fetchPosts });
  const { open, toggle, shouldRender } = useToggleDialog();
  const [id, setId] = useState<number | null>(null);
  const {showError} = useNotifications();
  const handleEditId = (id: number) => {
    setId(id);
    toggle();
  }
  const handleDeletePost = async (id: number) => {
    try {
      await postServices.deletePost(id);
      await refetchPost();
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
  return (
    <CommonStyles.Box className="tw-px-10">
      <CommonStyles.Box className="tw-flex tw-justify-between tw-mb-5 tw-items-center">
        <CommonStyles.Box className="tw-w-full">
          <FormProvider {...methods} >
            <form onSubmit={methods.handleSubmit(handleSearch)} className="tw-flex tw-items-center">
            <CommonStyles.Box className="tw-w-[20%]">
              <RHFField
                name="textSearch"
                placeholder="Search Post"
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
        <CommonButton className="tw-text-nowrap tw-px-7" onClick={toggle} label="Create new Post" />
      </CommonStyles.Box>
      <CommonStyles.Box>
        {dataPost &&
          <TableCommon
            isLoading={loadingPost}
            sxTableHead={{ fontWeight: "bold" }}
            rowsPerPage={10}
            disableSort={false}
            selected={selected}
            totalCount={dataPost.totalItems}
            handleCheckBox={handleCheckBox}
            handleSelectAllClick={handleSelectAll}
            page={filters?.page || 0}
            headCells={headCells({ handleEditId, handleDeletePost })}
            rows={dataPost?.items}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={changeRowPerPage}
            handleRequestSort={handleRequestSort}
          />}
      </CommonStyles.Box>
      {shouldRender && <CommonDialog onClose={() => setId(null)} open={open} toggle={toggle} body={<CreateEditPost toggle={toggle} id={Number(id)} />} />}
    </CommonStyles.Box>
  );
}

export default Post;