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
import cityServices from "@/services/modules/city/cityServices"
import { City } from "@/services/modules/city/interfaces/city"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import useGetCity from "@/services/modules/city/hook/useGetCity"

interface createEditCityProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  name: string;
  image: string;
  description: string;
}
const CreateEditCity: FC<createEditCityProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetCity(Number(id), { isTrigger: !!id });
  const schema = yup
    .object({
      name: yup.string().required("Name is a required field"),
      image: yup.string().required("Image is a required field"),
      description: yup.string().required("Description is a required field"),
    })
    .required();
  const initValue = useMemo(() => {
    if (data) {
      return { name: data?.data.name || "", image: data.data.image, description: data.data.description }
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
      toggle();
    }
    catch (error) {
      console.log(error);
    }
  };
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await uploadImage(file);;
        methods.setValue("image", res.data.data.uri);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No file selected");

    }
  }
  return (
    <CommonStyles.Box className="tw-w-[500px]">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">Create new city</CommonStyles.Typography></CommonStyles.Box>
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="name"
            control={methods.control}
            component={InputField}
            label="Name"
          />
          <RHFField
            className="tw-mb-3"
            name="image"
            control={methods.control}
            label="Image"
            component={UploadField}
            onChange={(e) => handleUpload(e)}
          />
          {data?.data.image && <img className="tw-w-[100px] tw-h-auto" alt={`${data.data.name}-image`} src={data?.data.image} />}
          <RHFField
            className="tw-mb-3"
            name="description"
            control={methods.control}
            component={InputField}
            label="Description"
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

export default CreateEditCity