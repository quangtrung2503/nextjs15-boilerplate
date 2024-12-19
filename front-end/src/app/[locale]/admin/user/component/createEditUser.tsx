import { ChangeEvent, FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/customReactFormField/InputField";
import UploadField from "@/components/customReactFormField/UploadField";
import useImageUploader from "@/hooks/useUpload";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import useGetUser from "@/services/modules/user/hook/useGetUser";
import userServices from "@/services/modules/user/user.services";
import { CommonDatePicker } from "@/components/common/DatePicker";
import { User } from "@/services/modules/user/interfaces/user.inteface";
import { Gender, getOptionEnum, Role, UserStatus } from "@/helpers/common";
import SelectField from "@/components/customReactFormField/SelectField";
import moment, { Moment } from "moment";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";

interface createEditUserProps {
  toggle: () => void;
  id?: number;
}
interface FormValues {
  name: string;
  username?: string;
  password?: string;
  phone: string;
  dateOfBirth: string;
  sex: Gender;
  status: UserStatus;
  email: string;
  address: string;
  avatar?: string;
  role: Role;
}
const GenderOption = getOptionEnum(Gender);
const StatusOption = getOptionEnum(UserStatus);
const RoleOption = getOptionEnum(Role);

const CreateEditUser: FC<createEditUserProps> = (props) => {
  const { toggle, id } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetUser(Number(id), { isTrigger: !!id });
  const {showError} = useNotifications();
  const schema = yup.object({
    name: yup.string().required("Name is a required field"),
    username: id ? yup.string().optional() : yup.string().required("Username is a required field"),
    password: id ? yup.string().optional() : yup.string().required("Password is a required field"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone is a required field"),
    dateOfBirth: yup.string().required("Date of birth is a required field"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is a required field"),
    address: yup.string().required("Address is a required field"),
    sex: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender))
      .required("Sex is a required field"),
    status: yup
      .mixed<UserStatus>()
      .oneOf(Object.values(UserStatus))
      .required("Status is a required field"),
    role: yup
      .mixed<Role>()
      .oneOf(Object.values(Role))
      .required("Role is a required field"),
    avatar: yup.string().optional(),
  });
  const initValue = useMemo(() => {
    return {
      name: data?.data.name ?? "",
      username: data?.data.username ?? "",
      password: data?.data.password ?? "",
      phone: data?.data.phone ?? "",
      dateOfBirth: data?.data.dateOfBirth ?? "",
      // dateOfBirth: data?.data.dateOfBirth ? moment(data?.data.dateOfBirth).toDate() : new Date(),
      sex: data?.data.sex ?? undefined,
      status: data?.data.status ?? undefined,
      email: data?.data.email ?? "",
      address: data?.data.address ?? "",
      avatar: data?.data.avatar ?? "",
      role: data?.data.role ?? undefined,
    };
  }, [data?.data]);
  const methods = useForm<FormValues>({
    defaultValues: initValue,
    resolver: yupResolver(schema),
  });
  const { reset } = methods;

  useEffect(() => {
    if (data?.data) {
      // Reset form values when data is loaded
      reset({
        name: data?.data.name ?? "",
        username: data?.data.username ?? "",
        password: data?.data.password ?? "",
        phone: data?.data.phone ?? "",
        dateOfBirth: data?.data.dateOfBirth ?? "",
        // dateOfBirth: data?.data.dateOfBirth ? moment(data?.data.dateOfBirth).toDate() : new Date(),
        sex: data?.data.sex ?? undefined,
        status: data?.data.status ?? undefined,
        email: data?.data.email ?? "",
        address: data?.data.address ?? "",
        avatar: data?.data.avatar ?? "",
        role: data?.data.role ?? undefined,
      });
    }
  }, [data?.data, reset]);
  const fetchUsers = useGet(cachedKeys.fetchUsers);
  const onSubmit: SubmitHandler<FormValues> = async (data: User) => {
    try {
      const body = {
        id: Number(id),
        email: data.email,
        name: data.name,
        phone: data.phone,
        nickName: data.nickName,
        avatar: data.avatar,
        role: data.role,
        status: data.status,
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
      };
      id ? await userServices.updateUser(body) : await userServices.createUser(data);
      await fetchUsers();
      toggle();
    } catch (error) {
      showError(error);
    }
  };
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await uploadImage(file);;
        methods.setValue("avatar", res.data.data.uri);
      } catch (error) {
        showError(error);
      }
    } else {
    showError("No file selected");
    }
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? "Edit user" : "Create new user"}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-3">
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                className=""
                name="name"
                control={methods.control}
                component={InputField}
                label="Name"
              />
            </CommonStyles.Box>
            {!id && <><CommonStyles.Box className="tw-col-span-12">
              <RHFField
                className=""
                name="username"
                control={methods.control}
                component={InputField}
                label="Username"
              />
            </CommonStyles.Box>
              <CommonStyles.Box className="tw-col-span-12">
                <RHFField
                  name="password"
                  type="password"
                  control={methods.control}
                  component={InputField}
                  label="Password"
                />
              </CommonStyles.Box></>}
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="phone"
                control={methods.control}
                component={InputField}
                label="Phone"
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="email"
                control={methods.control}
                component={InputField}
                label="Email"
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="address"
                control={methods.control}
                component={InputField}
                label="Address"
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="dateOfBirth"
                control={methods.control}
                border
                component={CommonDatePicker}
                label="Date of birth"
                className="tw-bg-white"
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="role"
                control={methods.control}
                component={SelectField}
                options={RoleOption}
                label="Role"
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="sex"
                control={methods.control}
                component={SelectField}
                options={GenderOption}
                label="Sex"
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="status"
                control={methods.control}
                component={SelectField}
                options={StatusOption}
                label="Status"
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                className="tw-mb-3"
                name="avatar"
                control={methods.control}
                label="Image"
                component={UploadField}
                onChange={(e) => handleUpload(e)}
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">
              Submit
            </CommonStyles.CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={toggle}><CommonIcons.Close /></CommonStyles.Box>

        </form>
      </FormProvider>
    </CommonStyles.Box>
  );
};

export default CreateEditUser;
