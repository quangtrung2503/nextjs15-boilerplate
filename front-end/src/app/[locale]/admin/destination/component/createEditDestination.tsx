import Form from "next/form"
import { ChangeEvent, FC, useEffect, useMemo } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField"
import { yupResolver } from "@hookform/resolvers/yup"
import useImageUploader from "@/hooks/useUpload"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import useGetDestination from "@/services/modules/destination/hook/useGetDestination"
import { Destination } from "@/services/modules/destination/interface/destination"
import destinationServices from "@/services/modules/destination/destination.services"
import CommonIcons from "@/components/CommonIcons"
import { useTranslations } from "next-intl"
import { useNotifications } from "@/helpers/toast"
import CheckboxField from "@/components/customReactFormField/CheckBoxField"
import CancelButton from "../../Component/buttonCancel"
import { CommonButtonAdmin } from "../../Component/customField/commonButton"
import InputField from "../../Component/customField/inputField"

interface createEditDestinationProps {
  id?: number;
  handleClose: () => void;
}
interface FormValues {
  name: string;
  isFeature?: boolean;
}
const CreateEditDestination: FC<createEditDestinationProps> = (props) => {
  const { id, handleClose } = props;
  const { data } = useGetDestination(Number(id), { isTrigger: !!id });
  const t = useTranslations("destinationAdmin");
  const {showError,showSuccess} = useNotifications();

  const schema = yup
    .object({
      name: yup.string().required(t("nameRequire")),
    })
    .required();
  const initValue = useMemo(() => {
        return { name: data?.data.name ?? "",isFeature: data?.data.isFeature ?? false}
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
        name: data.data.name ?? "",
        isFeature: data.data.isFeature ?? false
      });
    }
  }, [data?.data, reset]);
  const fetchDestinations = useGet(cachedKeys.fetchDestinations);
  const onSubmit: SubmitHandler<FormValues> = async (data: Destination) => {
    try {
      id ? data = { ...data, id } : { data };
      id? await destinationServices.updateDestination(data): await destinationServices.createDestination(data);
      await fetchDestinations();
      showSuccess(id?t("editSuccess"):t("createSuccess"));
      handleClose();
    }
    catch (error) {
      showError(error);
    }
  };
  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center tw-mb-8"><CommonStyles.Typography type="size20Weight600">{id?t("editDestination"):t("createNewDestination")}</CommonStyles.Typography></CommonStyles.Box>
      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="name"
            control={methods.control}
            component={InputField}
            defaultValue={initValue?.name}
            placeholder={t("placeholderName")}
            label={t("name")}
          />
          
          <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="isFeature"
                control={methods.control}
                component={CheckboxField}
                label={t("feature")}
              />
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
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={handleClose}><CommonIcons.Close /></CommonStyles.Box>

        </form>
      </FormProvider>
    </CommonStyles.Box>
  )
}

export default CreateEditDestination