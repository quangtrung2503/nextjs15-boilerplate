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
import useGetDestination from "@/services/modules/destination/hook/useGetDestination"
import { Destination } from "@/services/modules/destination/interface/destination"
import destinationServices from "@/services/modules/destination/destination.services"
import CommonIcons from "@/components/CommonIcons"

interface createEditDestinationProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  name: string;
}
const CreateEditDestination: FC<createEditDestinationProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetDestination(Number(id), { isTrigger: !!id });
  const schema = yup
    .object({
      name: yup.string().required("Name is a required field"),
    })
    .required();
  const initValue = useMemo(() => {
        return { name: data?.data.name ?? ""}
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
      });
    }
  }, [data?.data, reset]);
  const fetchDestinations = useGet(cachedKeys.fetchDestinations);
  const onSubmit: SubmitHandler<FormValues> = async (data: Destination) => {
    try {
      id ? data = { ...data, id } : { data };
      id? await destinationServices.updateDestination(data): await destinationServices.createDestination(data);
      await fetchDestinations();
      toggle();
    }
    catch (error) {
      console.log(error);
    }
  };
  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">{id?"Edit Destination":"Create new Destination"}</CommonStyles.Typography></CommonStyles.Box>
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
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">Submit</CommonStyles.CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={toggle}><CommonIcons.Close /></CommonStyles.Box>

        </form>
      </FormProvider>
    </CommonStyles.Box>
  )
}

export default CreateEditDestination