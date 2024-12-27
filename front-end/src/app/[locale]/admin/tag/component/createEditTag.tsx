import { FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/customReactFormField/InputField";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/helpers/toast";
import UploadField from "@/components/customReactFormField/UploadField";
import useGetTag from "@/services/modules/tag/hook/useGetTag";
import tagServices from "@/services/modules/tag/tag.services";
import { Tag } from "@/services/modules/tag/interfaces/tag";
import { CloudUploadOutlined } from "@mui/icons-material";
import apiUrls from "@/constants/apiUrls";

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
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editTag") : t("createNewTag")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CommonStyles.Box className="tw-mb-3">
              <RHFField
                label={t("name")}
                name="name"
                control={methods.control}
                component={InputField}
                startIcon={
                  <RHFField
                    name="icon"
                    setValue={setValue}
                    control={methods.control}
                    component={UploadField}
                    renderButton={
                      <CommonStyles.Box className="tw-relative">
                        {watch("icon") ? (
                        <CommonStyles.Box><img
                        className="tw-w-[40px]"
                        src={`${apiUrls.IMG_URL}/${watch("icon")}`}
                      />
                          <CommonStyles.Box
                            className="tw-cursor-pointer tw-z-10 tw-absolute tw-top-0 -tw-right-2"
                            onClick={() => handleDeleteIcon()}
                          >
                            <CommonIcons.CancelOutlined className="tw-text-accent_gray_500 tw-size-4" />
                          </CommonStyles.Box>
                          </CommonStyles.Box>
                        ) : (
                          <CloudUploadOutlined className="tw-size-10 tw-cursor-pointer tw-text-primary" />
                        )}
                      </CommonStyles.Box>
                    }
                  />
                }
                icon={
                <RHFField
                sx={{fieldset: {border: "none"},input:{width: 30,height: 30}}}
                  name="color"
                  control={methods.control}
                  component={InputField}
                  type="color"
                  placeholder={t("placeholderName")}
                />}
                placeholder={t("placeholderName")}
              />
            </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-around">
            <CommonStyles.CommonButton type="submit">
              {t("submit")}
            </CommonStyles.CommonButton>
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
