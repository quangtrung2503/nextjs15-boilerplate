import Form from "next/form"
import { ChangeEvent, FC, useEffect, useMemo } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField"
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from "@/components/customReactFormField/InputField"
import useImageUploader from "@/hooks/useUpload"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import useGetTheme from "@/services/modules/theme/hook/useGetTheme"
import themeServices from "@/services/modules/theme/theme.services"
import CheckboxField from "@/components/customReactFormField/CheckBoxField"
import { Theme } from "@/services/modules/theme/intefaces/theme"
import CommonIcons from "@/components/CommonIcons"
import { useTranslations } from "next-intl"
import { useNotifications } from "@/helpers/toast"

interface createEditThemeProps {
  id?: number;
  handleClose: ()=>void
}
interface FormValues {
  name: string;
  isDisplay?: boolean;
}
const CreateEditTheme: FC<createEditThemeProps> = (props) => {
  const { id, handleClose } = props;
  const { data } = useGetTheme(Number(id), { isTrigger: !!id });
  const t = useTranslations();
  const {showError,showSuccess} = useNotifications();

  const schema = yup
    .object({
      name: yup.string().required(t("themeAdmin.nameRequire")),
    })
    .required();
  const initValue = useMemo(() => {
        return { name: data?.data.name ?? "",isDisplay: data?.data.isDisplay ?? false}
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
        name: data.data.name || "",
        isDisplay: data.data.isDisplay || false
      });
    }
  }, [data?.data, reset]);
  const fetchThemes = useGet(cachedKeys.fetchThemes);
  const onSubmit: SubmitHandler<FormValues> = async (data: Theme) => {
    try {
      id ? data = { ...data, id } : { data };
      id? await themeServices.updateTheme(data): await themeServices.createTheme(data);
      await fetchThemes();
      showSuccess(id?t("editSuccess"):t("createSuccess"));
      handleClose();
    }
    catch (error) {
      showError(error)
    }
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">{id?t("themeAdmin.editTheme"):t("themeAdmin.createNewTheme")}</CommonStyles.Typography></CommonStyles.Box>
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="name"
            control={methods.control}
            component={InputField}
            defaultValue={initValue?.name}
            label={t("themeAdmin.name")}
            placeholder={t("themeAdmin.placeholderName")}
          />
          <RHFField
            name="isDisplay"
            defaultValue={initValue?.isDisplay}
            control={methods.control}
            component={CheckboxField}
            label={t("themeAdmin.isDisplay")}
          />
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">{t("submit")}</CommonStyles.CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={handleClose}><CommonIcons.Close /></CommonStyles.Box>
        </form>
      </FormProvider>
    </CommonStyles.Box>
  )
}

export default CreateEditTheme