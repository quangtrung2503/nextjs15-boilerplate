import Form from "next/form"
import { ChangeEvent, FC, useEffect, useMemo } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField"
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from "@/components/customReactFormField/InputField"
import UploadField from "@/components/customReactFormField/UploadField"
import useImageUploader from "@/hooks/useUpload"
import cityServices from "@/services/modules/city/city.services"
import { City } from "@/services/modules/city/interfaces/city"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import useGetCity from "@/services/modules/city/hook/useGetCity"
import { useNotifications } from "@/helpers/toast"
import CommonIcons from "@/components/CommonIcons"
import { useTranslations } from "next-intl"
import apiUrls from "@/constants/apiUrls"

interface createEditCityProps {
  id?: number;
  handleClose: ()=>void;
}
interface FormValues {
  name: string;
  image: string;
  description: string;
}
const CreateEditCity: FC<createEditCityProps> = (props) => {
  const { id, handleClose } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetCity(Number(id), { isTrigger: !!id });
  const {showError,showSuccess} = useNotifications();
  const t = useTranslations("cityAdmin")
  const schema = yup
  .object({
    name: yup.string().required(t("nameRequire")),
    image: yup.string().required(t("imageRequire")),
    description: yup.string().required(t("descriptionRequire")),
    })
    .required();
    
  const initValue = useMemo(() => {
    return { name:  data?.data.name ?? "", image: data?.data.image ?? "", description: data?.data.description ?? ""}
  }, [data?.data]);

  const methods = useForm<FormValues>({
    defaultValues: initValue,
    resolver: yupResolver(schema)
  });
  
  const { reset, setValue,watch } = methods;
  useEffect(() => {
    if (data?.data) {
      // Reset form values when data is loaded
      reset({
        name: data.data.name || "",
        image: data.data.image || "",
        description: data.data.description || "",
      });
    }
  }, [data?.data, reset]);

  const fetchCities = useGet(cachedKeys.fetchCities);
  const onSubmit: SubmitHandler<FormValues> = async (data: City) => {
    try {
      id ? data = { ...data, id } : { data };
      id ? await cityServices.updateCity(data) : await cityServices.createCity(data);
      await fetchCities();
      showSuccess(id ? t("editSuccess"): t("createSuccess"))
      handleClose();
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
  const handleDeleteImage = () => {
    setValue("image","");
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">{id?t("editCity"):t("createNewCity")}</CommonStyles.Typography></CommonStyles.Box>
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="name"
            control={methods.control}
            component={InputField}
            // defaultValue={initValue?.name}
            placeholder={t("placeholderName")}
            label={t("name")}
          />
          <RHFField
            setValue={setValue}
            className="tw-mb-3"
            name="image"
            control={methods.control}
            label={t("image")}
            // defaultValue={initValue?.image}
            component={UploadField}
            onChange={(e) => handleUpload(e)}
          />
          
          {watch("image") != "" && <CommonStyles.Box className="tw-col-span-12 tw-flex tw-flex-wrap">
                  <CommonStyles.Box
                    className="tw-relative tw-w-fit"
                  > <img
                      className="tw-max-w-[100px] tw-h-auto tw-p-5"
                      src={`${apiUrls.IMG_URL}/${watch("image")}`}
                      alt="Uploaded Image"
                    />
                    <CommonStyles.Box
                      className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer"
                      onClick={() => handleDeleteImage()}
                    >
                      <CommonIcons.CancelOutlined className="tw-text-accent_gray_500" />
                    </CommonStyles.Box>
                  </CommonStyles.Box>
            </CommonStyles.Box>
            }
          <RHFField
            className="tw-mb-3"
            name="description"
            placeholder={t("placeholderDescription")}
            // defaultValue={initValue?.description}
            control={methods.control}
            component={InputField}
            label={t("description")}
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

export default CreateEditCity