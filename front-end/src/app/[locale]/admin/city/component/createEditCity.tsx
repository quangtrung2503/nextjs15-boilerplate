import Form from "next/form";
import { ChangeEvent, FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import useImageUploader from "@/hooks/useUpload";
import cityServices from "@/services/modules/city/city.services";
import { City } from "@/services/modules/city/interfaces/city";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import useGetCity from "@/services/modules/city/hook/useGetCity";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import apiUrls from "@/constants/apiUrls";
import useGetTags from "@/services/modules/tag/hook/useGetTags";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import CancelButton from "../../Component/buttonCancel";
import { CommonButtonAdmin } from "../../Component/customField/commonButton";
import InputField from "../../Component/customField/inputField";
import uploadField from "../../Component/customField/uploadField";
import SelectField from "../../Component/customField/selectField";

interface createEditCityProps {
  id?: number;
  handleClose: () => void;
}
interface FormValues {
  name: string;
  image: string;
  description: string;
  tagIds: number[];
}
const CreateEditCity: FC<createEditCityProps> = (props) => {
  const { id, handleClose } = props;
  const { uploadImage } = useImageUploader();
  const { data } = useGetCity(Number(id), { isTrigger: !!id });
  const { filters } = useFiltersHandler({});
  const { data: dataTag } = useGetTags(filters);
  const { showError, showSuccess } = useNotifications();
  const t = useTranslations("cityAdmin");
  const schema = yup
    .object({
      name: yup.string().required(t("nameRequire")),
      image: yup.string().required(t("imageRequire")),
      description: yup.string().required(t("descriptionRequire")),
      tagIds: yup.array().min(3, t("tagIdsMin")).required(t("tagIdsRequire")),
    })
    .required();

  const initValue = useMemo(() => {
    return {
      name: data?.data.name ?? "",
      image: data?.data.image ?? "",
      description: data?.data.description ?? "",
      tagIds: data?.data.Tag?.map((tag) => tag.id) ?? [],
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
        name: data.data.name ?? "",
        image: data.data.image ?? "",
        description: data.data.description ?? "",
        tagIds: data?.data.Tag?.map((tag) => tag.id) ?? [],
      });
    }
  }, [data?.data, reset]);

  const fetchCities = useGet(cachedKeys.fetchCities);
  const onSubmit: SubmitHandler<FormValues> = async (data: City) => {
    try {
      id ? (data = { ...data, id }) : { data };
      data = { ...data, tagIds: data.tagIds.map((tag) => Number(tag)) };
      id
        ? await cityServices.updateCity(data)
        : await cityServices.createCity(data);
      await fetchCities();
      showSuccess(id ? t("editSuccess") : t("createSuccess"));
      handleClose();
    } catch (error) {
      showError(error);
    }
  };
  const tagOption = useMemo(() => {
    return dataTag?.items.map((tag) => {
      return {
        key: tag.id?.toString(),
        label: (
          <CommonStyles.Box
            sx={{ color: `${tag.color}` }}
            className="tw-size-fit"
          >
            <CommonStyles.Box className="tw-flex tw-items-center tw-gap-3">
              <img
                src={`${apiUrls.IMG_URL}/${tag.icon}`}
                className="tw-max-w-[40px] tw-max-h-[30px] tw-rounded-full"
              />
              <CommonStyles.Typography
                type="size14Weight700"
                className={`tw-text-[${tag.color}]`}
              >
                {tag.name}
              </CommonStyles.Typography>
            </CommonStyles.Box>
          </CommonStyles.Box>
        ),
        value: tag.id?.toString(),
      };
    });
  }, [dataTag?.items]);
  const handleDeleteImage = () => {
    setValue("image", "");
  };

  return (
    <CommonStyles.Box className="tw-w-[800px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center tw-mb-8">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editCity") : t("createNewCity")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
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
            component={uploadField}
            // onChange={(e) => handleUpload(e)}
          />

          {watch("image") != "" && (
            <CommonStyles.Box className="tw-col-span-12 tw-flex tw-flex-wrap tw-mb-3">
              <CommonStyles.Box className="tw-relative tw-w-fit tw-rounded-md">
                {" "}
                <img
                  className="tw-max-w-[100px] tw-h-auto tw-rounded-md"
                  src={`${apiUrls.IMG_URL}/${watch("image")}`}
                  alt="Uploaded Image"
                />
                <CommonStyles.Box
                  className="tw-cursor-pointer"
                  onClick={() => handleDeleteImage()}
                >
                  <CommonIcons.Close className="tw-text-accent_gray_500 tw-size-5 tw-bg-gray-100 tw-rounded-tr-md tw-absolute tw-top-0 tw-right-0" />
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
          )}
          <RHFField
            className="tw-mb-3"
            name="description"
            placeholder={t("placeholderDescription")}
            // defaultValue={initValue?.description}
            control={methods.control}
            component={InputField}
            multiline
            label={t("description")}
          />
          <RHFField
            name="tagIds"
            placeholder={t("placeholderTag")}
            control={methods.control}
            component={SelectField}
            options={tagOption}
            multiple
            label={t("tag")}
          />
          <CommonStyles.Box className="tw-flex tw-justify-center tw-gap-8 tw-mt-8 tw-mb-4">
            <CancelButton handleClose={handleClose} />
            <CommonButtonAdmin
              variant="outlined"
              type="submit"
              className="active tw-min-w-28"
            >
              {id ? t("edit") : t("create")}
            </CommonButtonAdmin>
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

export default CreateEditCity;
