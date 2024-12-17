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

interface createEditThemeProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  name: string;
  isDisplay?: boolean;
}
const CreateEditTheme: FC<createEditThemeProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetTheme(Number(id), { isTrigger: !!id });
  const schema = yup
    .object({
      name: yup.string().required("Name is a required field"),
    })
    .required();
  const initValue = useMemo(() => {
    if (data) {
        return { name: data?.data.name || "",isDisplay: data?.data.isDisplay || false}
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
      toggle();
    }
    catch (error) {
      console.log(error);
    }
  };
  return (
    <CommonStyles.Box className="tw-w-[500px]">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">{id?"Edit Theme":"Create new Theme"}</CommonStyles.Typography></CommonStyles.Box>
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="name"
            control={methods.control}
            component={InputField}
            defaultValue={initValue?.name}
            label="Name"
          />
          <RHFField
            name="isDisplay"
            defaultValue={initValue?.isDisplay}
            control={methods.control}
            component={CheckboxField}
            label="Display"
          />
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">Submit</CommonStyles.CommonButton>
            <CommonStyles.CommonButton onClick={toggle} colorBtn="info">Cancel</CommonStyles.CommonButton>
          </CommonStyles.Box>
        </form>
      </FormProvider>
    </CommonStyles.Box>
  )
}

export default CreateEditTheme