import { ChangeEvent, FC, useEffect, useMemo } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { default as CommonStyles } from "@/components/common"
import RHFField from "@/components/customReactFormField/ReactFormField"
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from "@/components/customReactFormField/InputField"
import UploadField from "@/components/customReactFormField/UploadField"
import useImageUploader from "@/hooks/useUpload"
import { useGet } from "@/stores/useStore"
import cachedKeys from "@/constants/cachedKeys"
import useGetUser from "@/services/modules/user/hook/useGetUser"
import userServices from "@/services/modules/user/user.services"
import { CommonDatePicker } from "@/components/common/DatePicker"

interface createEditUserProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  name: string;
  username: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
  sex: string;
  status: string;
  email: string;
  address: string;
  avatar?: string;
}
const CreateEditUser: FC<createEditUserProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetUser(Number(id), { isTrigger: !!id });
  const schema = yup
    .object({
      name: yup.string().required("Name is a required field"),
      username: yup.string().required("Username is a required field"),
      password: yup.string().required("Password is a required field"),
      phone: yup.string().required("Phone is a required field"),
      dateOfBirth: yup.date().required("Date of birth is a required field"),
      email: yup.string().required("Email is a required field"),
      address: yup.string().required("Address is a required field"),
      sex: yup.string().required("Sex is a required field"),
      status: yup.string().required("Status is a required field"),
    })
    .required();
  const initValue = useMemo(() => {
    if (data) {
      return {
        name: data?.data.name || "",
        // image: data.data.image, 
        // description: data.data.description 
      }
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
        // image: data.data.image || "",
        // description: data.data.description || "",
      });
    }
  }, [data?.data, reset]);
  const fetchCities = useGet(cachedKeys.fetchCities);
  const onSubmit: SubmitHandler<FormValues> = async (data: User) => {
    try {
      id ? data = { ...data, id } : { data };
      await userServices.createUser(data);
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

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No file selected");

    }
  }
  return (
    <CommonStyles.Box className="tw-w-[500px]">
      <CommonStyles.Box className="tw-flex tw-justify-center"><CommonStyles.Typography type="size20Weight600">Create new user</CommonStyles.Typography></CommonStyles.Box>
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
            name="username"
            control={methods.control}
            component={InputField}
            label="Username"
          />

          <RHFField
            className="tw-mb-3"
            name="password"
            type="password"
            control={methods.control}
            component={InputField}
            label="Password"
          />

          <RHFField
            className="tw-mb-3"
            name="phone"
            control={methods.control}
            component={InputField}
            label="Phone"
          />

          <RHFField
            name="dateOfBirth"
            control={methods.control}
            border
            component={CommonDatePicker}
            label="Date of birth"
            className="tw-flex tw-bg-white"
          />
          <RHFField
            classNameLabel="tw-mt-3"
            className="tw-mb-3"
            name="email"
            control={methods.control}
            component={InputField}
            label="Email"
          />

          <RHFField
            className="tw-mb-3"
            name="address"
            control={methods.control}
            component={InputField}
            label="Address"
          />

          <CommonStyles.Box className="tw-flex tw-w-full tw-justify-between">
            <RHFField
              name="sex"
              control={methods.control}
              component={InputField}
              label="Sex"
            />
            <RHFField
              name="status"
              control={methods.control}
              component={InputField}
              label="Status"
            />
          </CommonStyles.Box>
          <RHFField
            className="tw-mb-3"
            name="avatar"
            control={methods.control}
            label="Image"
            component={UploadField}
            onChange={(e) => handleUpload(e)}
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

export default CreateEditUser