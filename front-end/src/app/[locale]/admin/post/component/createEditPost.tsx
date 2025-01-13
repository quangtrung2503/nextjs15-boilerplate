"use client";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import useImageUploader from "@/hooks/useUpload";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import CheckboxField from "@/components/customReactFormField/CheckBoxField";
import useGetPost from "@/services/modules/post/hook/useGetPost";
import { Post } from "@/services/modules/post/interface/post";
import postServices from "@/services/modules/post/post.services";
import TinyMCEEditor from "@/components/common/TinyMCEEditor";
import TinyMCEEditorField from "@/components/customReactFormField/TinyNCEEditorField";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import apiUrls from "@/constants/apiUrls";
import CancelButton from "../../Component/buttonCancel";
import InputField from "../../Component/customField/inputField";
import { CommonButtonAdmin } from "../../Component/customField/commonButton";
import uploadField from "../../Component/customField/uploadField";

interface createEditPostProps {
  handleClose: () => void;
  id?: number;
}
interface FormValues {
  title: string;
  content: string;
  image: string;
}
const CreateEditPost: FC<createEditPostProps> = (props) => {
  const { handleClose, id } = props;
  const { data } = useGetPost(Number(id), { isTrigger: !!id });
  const { showError, showSuccess } = useNotifications();
  const t = useTranslations("postAdmin");

  const schema = yup
    .object({
      title: yup.string().required(t("titleRequire")),
      content: yup.string().required(t("contentRequire")),
      image: yup.string().required(t("imageRequire")),
    })
    .required();
  const initValue = useMemo(() => {
    return {
      title: data?.data.title ?? "",
      content: data?.data.content ?? "",
      image: data?.data.image ?? "",
    };
  }, [data?.data]);
  const methods = useForm<FormValues>({
    defaultValues: initValue,
    resolver: yupResolver(schema),
  });
  const { reset, setValue, watch } = methods;

  useEffect(() => {
    if (data?.data) {
      // Reset form values when data is loaded
      reset({
        title: data?.data.title || "",
        content: data.data.content || "",
        image: data.data.image || "",
      });
    }
  }, [data?.data, reset]);
  const fetchPosts = useGet(cachedKeys.fetchPosts);
  const onSubmit: SubmitHandler<FormValues> = async (data: Post) => {
    try {
      id ? (data = { ...data, id }) : { data };
      id
        ? await postServices.updatePost(data)
        : await postServices.createPost(data);
      await fetchPosts();
      showSuccess(id ? t("editSuccess") : t("createSuccess"));
      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteImage = () => {
    setValue("image", "");
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editPost") : t("createNewPost")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="title"
            control={methods.control}
            component={InputField}
            // defaultValue={initValue?.title}
            label={t("title")}
          />
          <RHFField
            id="content"
            name="content"
            control={methods.control}
            component={TinyMCEEditorField}
            // defaultValue={initValue?.title}
            label={t("content")}
          />

          <RHFField
            className="tw-mb-3"
            name="image"
            control={methods.control}
            setValue={setValue}
            label={t("image")}
            // defaultValue={initValue?.image}
            component={uploadField}
          />

          {watch("image") != "" && (
            <CommonStyles.Box className="tw-col-span-12 tw-flex tw-flex-wrap">
              <CommonStyles.Box className="tw-relative tw-w-fit tw-rounded-md">
                {" "}
                <img
                  className="tw-max-w-[100px] tw-h-auto tw-rounded-md"
                  src={`${apiUrls.IMG_URL}/${watch("image")}`}
                  alt="Uploaded Image"
                />
                <CommonStyles.Box
                  className="tw-cursor-pointer"
                  onClick={() => handleDeleteImage()}
                >
                  <CommonIcons.Close className="tw-text-accent_gray_500 tw-size-5 tw-bg-gray-100 tw-rounded-tr-md tw-absolute tw-top-0 tw-right-0" />
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
          )}
          <CommonStyles.Box className="tw-flex tw-justify-center tw-gap-8 tw-mt-8 tw-mb-4">
            <CancelButton handleClose={handleClose} />
            <CommonButtonAdmin
              variant="outlined"
              type="submit"
              className="active tw-min-w-28"
            >
              {id ? t("edit") : t("create")}
            </CommonButtonAdmin>
          </CommonStyles.Box>
          <CommonStyles.Box
            className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer"
            onClick={handleClose}
          >
            <CommonIcons.Close />
          </CommonStyles.Box>
        </form>
      </FormProvider>
    </CommonStyles.Box>
  );
};

export default CreateEditPost;
