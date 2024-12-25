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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const schema = yup.object({
    name: yup.string().required(t("userAdmin.nameRequire")),
    username: id ? yup.string().optional() : yup.string().required(t("userAdmin.usernameRequire")),
    password: id ? yup.string().optional() : yup.string().required(t("userAdmin.passwordRequire")),
    phone: yup
      .string()
      .matches(/^\d{10}$/, t("userAdmin.phoneValid"))
      .required(t("userAdmin.phoneRequired")),
    dateOfBirth: yup.string().required(t("userAdmin.dateOfBirthRequired")),
    email: yup
      .string()
      .email(t("userAdmin.emailValid"))
      .required(t("userAdmin.emailRequire")),
    address: yup.string().required(t("userAdmin.addressRequire")),
    sex: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender))
      .required(t("userAdmin.sexRequire")),
    status: yup
      .mixed<UserStatus>()
      .oneOf(Object.values(UserStatus))
      .required(t("userAdmin.statusRequire")),
    role: yup
      .mixed<Role>()
      .oneOf(Object.values(Role))
      .required(t("userAdmin.roleRequire")),
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
  const { reset, setValue } = methods;

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
    showError(t("noFileSelected"));
    }
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("userAdmin.editUser") : t("userAdmin.createNewUser")}
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
                label={t("userAdmin.name")}
              />
            </CommonStyles.Box>
            {!id && <><CommonStyles.Box className="tw-col-span-12">
              <RHFField
                className=""
                name="username"
                control={methods.control}
                component={InputField}
                label={t("userAdmin.username")}
              />
            </CommonStyles.Box>
              <CommonStyles.Box className="tw-col-span-12">
                <RHFField
                  name="password"
                  type="password"
                  control={methods.control}
                  component={InputField}
                  label={t("userAdmin.password")}
                />
              </CommonStyles.Box></>}
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="phone"
                control={methods.control}
                component={InputField}
                label={t("userAdmin.phone")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="email"
                control={methods.control}
                component={InputField}
                label={t("userAdmin.email")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="address"
                control={methods.control}
                component={InputField}
                label={t("userAdmin.address")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="dateOfBirth"
                control={methods.control}
                border
                component={CommonDatePicker}
                label={t("userAdmin.dateOfBirth")}
                className="tw-bg-white"
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="role"
                control={methods.control}
                component={SelectField}
                options={RoleOption}
                label={t("userAdmin.role")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="sex"
                control={methods.control}
                component={SelectField}
                options={GenderOption}
                label={t("userAdmin.sex")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="status"
                control={methods.control}
                component={SelectField}
                options={StatusOption}
                label={t("userAdmin.status")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
              setValue={setValue}
                className="tw-mb-3"
                name="avatar"
                control={methods.control}
                label={t("userAdmin.avatar")}
                component={UploadField}
                onChange={(e) => handleUpload(e)}
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">
              {t("submit")}
            </CommonStyles.CommonButton>
          </CommonStyles.Box>
          <CommonStyles.Box  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer" onClick={toggle}><CommonIcons.Close /></CommonStyles.Box>

        </form>
      </FormProvider>
    </CommonStyles.Box>
  );
};

export default CreateEditUser;
