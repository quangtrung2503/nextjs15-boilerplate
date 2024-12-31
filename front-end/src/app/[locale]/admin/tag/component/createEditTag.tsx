import { FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/helpers/toast";
import UploadField from "@/components/customReactFormField/UploadField";
import useGetTag from "@/services/modules/tag/hook/useGetTag";
import tagServices from "@/services/modules/tag/tag.services";
import { Tag } from "@/services/modules/tag/interfaces/tag";
import apiUrls from "@/constants/apiUrls";
import InputFieldColor from "@/components/customReactFormField/InputFieldColor";
import { commonImg } from "@/assets";
import CancelButton from "../../Component/buttonCancel";
import InputField from "../../Component/customField/inputField";
import { CommonButtonAdmin } from "../../Component/customField/commonButton";

interface createEditTagProps {
  id?: number;
  handleClose: () => void;
}
interface FormValues {
  name: string;
  icon?: string;
  color: string;
}
const CreateEditTag: FC<createEditTagProps> = (props) => {
  const { id, handleClose } = props;
  const { data } = useGetTag(Number(id), { isTrigger: !!id });
  const t = useTranslations("tagAdmin");
  const { showError, showSuccess } = useNotifications();

  const schema = yup
    .object({
      name: yup.string().required(t("nameRequire")),
      icon: yup.string().optional(),
      color: yup.string().required(t("colorRequire")),
    })
    .required();
  const initValue = useMemo(() => {
    return {
      name: data?.data.name ?? "",
      icon: data?.data.icon ?? "",
      color: data?.data.color ?? "#000000",
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
        name: data?.data.name ?? "",
        icon: data?.data.icon ?? "",
        color: data?.data.color ?? "#000000",
      });
    }
  }, [data?.data, reset]);
  const fetchTags = useGet(cachedKeys.fetchTags);
  const onSubmit: SubmitHandler<FormValues> = async (data: Tag) => {
    try {
      id ? (data = { ...data, id }) : { data };
      id
        ? await tagServices.updateTag(data)
        : await tagServices.createTag(data);
      await fetchTags();
      showSuccess(id ? t("editSuccess") : t("createSuccess"));
      handleClose();
    } catch (error) {
      showError(error);
    }
  };
  const handleDeleteIcon = () => {
    setValue("icon", "");
  };
  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center tw-mb-8">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editTag") : t("createNewTag")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CommonStyles.Box className="tw-mb-3">
            <CommonStyles.Box className="tw-flex tw-w-full tw-justify-between tw-mb-4">
              <label className="tw-font-mulish tw-font-bold tw-text-accent_gray_800">
                {t("icon")}
              </label>
              <RHFField
                name="icon"
                setValue={setValue}
                control={methods.control}
                component={UploadField}
                showDelete
                renderButton={
                  <CommonStyles.Box className="tw-relative">
                    {watch("icon") ? (
                      <CommonStyles.Box className="tw-border-solid tw-border-[1.5px] tw-border-gray-100 tw-flex tw-rounded-md tw-items-center">
                        <img
                          className="tw-w-[64px] tw-h-[64px] tw-border-primary tw-rounded-md tw-object-scale-down"
                          src={`${apiUrls.IMG_URL}/${watch("icon")}`}
                        />
                      </CommonStyles.Box>
                    ) : (
                      <CommonStyles.Box className="tw-flex tw-items-center tw-px-3 tw-h-[40px] tw-border-primary tw-rounded-md tw-bg-gray-100">
                        <CommonStyles.Typography
                          className="tw-text-accent_gray_300 tw-mr-2"
                          type="size16Weight400"
                        >
                          Choose image
                        </CommonStyles.Typography>
                        <img
                          className="tw-w-7 tw-h-auto"
                          src={commonImg.upload.src}
                        />
                        {/* <CloudUploadOutlined className="tw-size-7 tw-cursor-pointer tw-text-primary" /> */}
                      </CommonStyles.Box>
                    )}
                    {watch("icon") && (
                      <CommonStyles.Box
                        className="tw-cursor-pointer"
                        onClick={() => handleDeleteIcon()}
                      >
                        <CommonIcons.Close className="tw-text-accent_gray_500 tw-size-5 tw-bg-gray-100 tw-rounded-tr-md tw-absolute tw-top-0 tw-right-0" />
                      </CommonStyles.Box>
                    )}
                  </CommonStyles.Box>
                }
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-justify-between tw-w-full">
              <label className="tw-font-mulish tw-font-bold tw-text-accent_gray_800">
                {t("color")}
              </label>
              <RHFField
                name="color"
                control={methods.control}
                component={InputFieldColor}
                type="color"
                placeholder={t("placeholderName")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-flex tw-w-full tw-justify-between tw-mt-4">
              <label className="tw-min-w-fit tw-font-mulish tw-font-bold tw-text-accent_gray_800 tw-mr-[20%]">
                {t("name")}
              </label>
              <RHFField
                name="name"
                control={methods.control}
                component={InputField}
                placeholder={t("placeholderName")}
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-center tw-gap-8 tw-mt-8 tw-mb-4">
          <CancelButton handleClose={handleClose} />
            <CommonButtonAdmin
              variant="outlined"
              type="submit"
              className="active tw-min-w-28"
            >
              {id? t("edit") : t("create")}
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

export default CreateEditTag;
