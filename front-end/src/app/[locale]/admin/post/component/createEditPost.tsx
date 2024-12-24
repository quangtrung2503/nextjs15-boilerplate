"use client"
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField"
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from "@/components/customReactFormField/InputField"
import useImageUploader from "@/hooks/useUpload"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import CheckboxField from "@/components/customReactFormField/CheckBoxField"
import useGetPost from "@/services/modules/post/hook/useGetPost"
import { Post } from "@/services/modules/post/interface/post"
import postServices from "@/services/modules/post/post.services"
import UploadField from "@/components/customReactFormField/UploadField"
import TinyMCEEditor from "@/components/common/TinyMCEEditor"
import TinyMCEEditorField from "@/components/customReactFormField/TinyNCEEditorField"
import { useNotifications } from "@/helpers/toast"
import CommonIcons from "@/components/CommonIcons"
import { useTranslations } from "next-intl"

interface createEditPostProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  title: string;
  content: string;
  image: string;
}
const CreateEditPost: FC<createEditPostProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage,uploadImages } = useImageUploader();
  const { data } = useGetPost(Number(id), { isTrigger: !!id });
  const {showError} = useNotifications();
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
        image: data?.data.image ?? ""
    }
  }, [data?.data]);
  const methods = useForm<FormValues>({
    defaultValues: initValue,
    resolver: yupResolver(schema)
  });
  const { reset } = methods;

  useEffect(() => {
    if (data?.data) {
      // Reset form values when data is loaded
      reset({
        title: data?.data.title || "",
        content: data.data.content || "",
        image: data.data.image || ""
      });
    }
  }, [data?.data, reset]);
  const fetchPosts = useGet(cachedKeys.fetchPosts);
  const onSubmit: SubmitHandler<FormValues> = async (data: Post) => {
    try {
      id ? data = { ...data, id } : { data };
      id ? await postServices.updatePost(data) : await postServices.createPost(data);
      await fetchPosts();
      toggle();
    }
    catch (error) {
      showError(error);
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await uploadImage(file);;
        methods.setValue("image", res.data.data.uri);
      } catch (error) {
        showError(error);
      }
    } else {
      showError(t("noFileSelected"));
    }
  }  

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">{id ? t("editPost") : t("createNewPost")}</CommonStyles.Typography>
        </CommonStyles.Box>
      <FormProvider {...methods} >
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
            multiple
            label={t("image")}
            // defaultValue={initValue?.image}
            component={UploadField}
            onChange={(e) => handleUpload(e)}
          />
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">{t("submit")}</CommonStyles.CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={toggle}><CommonIcons.Close /></CommonStyles.Box>
        </form>
      </FormProvider>
    </CommonStyles.Box>
  )
}

export default CreateEditPost