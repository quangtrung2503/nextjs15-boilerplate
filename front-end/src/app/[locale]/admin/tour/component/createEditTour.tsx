import { FC, useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import InputField from "@/components/customReactFormField/InputField";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import useGetTour from "@/services/modules/tour/hooks/useGetTour";
import { CommonDatePicker } from "@/components/common/DatePicker";
import CheckboxField from "@/components/customReactFormField/CheckBoxField";
import useGetThemes from "@/services/modules/theme/hook/useGetAllTheme";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import SelectField from "@/components/customReactFormField/SelectField";
import useGetCities from "@/services/modules/city/hook/useGetAllCity";
import useGetDestinations from "@/services/modules/destination/hook/useGetAllDestination";
import { yupResolver } from "@hookform/resolvers/yup";
import { getOptionEnum, Package, Transport } from "@/helpers/common";
import UploadField from "@/components/customReactFormField/UploadField";
import { isArray } from "lodash";
import apiUrls from "@/constants/apiUrls";
import tourServices from "@/services/modules/tour/tour.services";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import Loading from "@/components/common/Loading";
import TinyMCEEditorField from "@/components/customReactFormField/TinyNCEEditorField";

interface createEditTourProps {
  handleClose: () => void;
  id?: number;
}
interface FormValues {
  name: string;
  price: number;
  transport: string;
  package: string;
  numberOfPeople: number;
  numberOfHours: number;
  startDate: string;
  endDate: string;
  isFeature?: boolean;
  description: string;
  activity: string;
  included: string;
  notIncluded: string;
  safety: string;
  cityId: number;
  themeId: number;
  language: string;
  destinationIds: number[];
  images: string[];
}
const transportOption = getOptionEnum(Transport);
const packageOption = getOptionEnum(Package);
const CreateEditTour: FC<createEditTourProps> = (props) => {
  const { id, handleClose } = props;
  const { data, loading } = useGetTour(Number(id), { isTrigger: !!id });
  const { showError,showSuccess } = useNotifications();
  const t = useTranslations("tourAdmin");
  const [loadingPost, setLoadingPost] = useState(false);
  const fetchTour = useGet(cachedKeys.fetchTours);
  const schema = yup
    .object({
      name: yup.string().required(t("nameRequire")),
      transport: yup.string().required(t("transportRequire")),
      price: yup.number().required(t("priceRequire")),
      package: yup.string().required(t("packageRequire")),
      numberOfPeople: yup.number().required(t("numberOfPeopleRequire")),
      numberOfHours: yup.number().required(t("numberOfHoursRequire")),
      startDate: yup.string().required(t("startDateRequire"))
      .test(
        "is-after-today",
        t("startDateAfterToday"),
        (value) => {
          if (!value) return false;
          const startDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
          return startDate > today; // `startDate` phải sau ngày hôm nay
        }
      ),
      endDate: yup.string().required(t("endDateRequire"))
      .test(
        "is-after-or-equal-startDate",
        t("endDateAfterStartDate"),
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) return false;
          const endDate = new Date(value);
          const start = new Date(startDate);
          return endDate >= start; // `endDate` phải lớn hơn hoặc bằng `startDate`
        }
      ),
      language: yup.string().required(t("languageRequire")),
      cityId: yup.number().required(t("cityRequire")),
      themeId: yup.number().required(t("themeRequire")),
      destinationIds: yup
        .array()
        .min(1, t("destinationRequire"))
        .required(t("destinationRequire")),
      isFeature: yup.boolean().optional(),
      description: yup.string().required(t("descriptionRequire")),
      activity: yup.string().required(t("activityRequire")),
      included: yup.string().required(t("includedRequire")),
      notIncluded: yup.string().required(t("notIncludedRequire")),
      safety: yup.string().required(t("safetyRequire")),
      images: yup.array()
      .min(1, t("imagesRequire"))
      .required(t("imagesRequire")),
    })
    .required();
  const { filters } = useFiltersHandler({});
  const { data: dataTheme } = useGetThemes(filters);
  const { data: dataCities } = useGetCities(filters);
  const { data: dataDestination } = useGetDestinations(filters);

  const initValue = useMemo(() => {
    return {
      name: data?.data.name ?? "",
      description: data?.data.description ?? "",
      transport: data?.data.transport ?? "",
      price: data?.data.price ?? 0,
      package: data?.data.package ?? "",
      numberOfPeople: data?.data.numberOfPeople ?? 0,
      numberOfHours: data?.data.numberOfHours ?? 0,
      startDate: data?.data.startDate ?? "",
      endDate: data?.data.endDate ?? "",
      isFeature: data?.data.isFeature ?? undefined,
      language: data?.data.language ?? "",
      cityId: data?.data.cityId ?? undefined,
      themeId: data?.data.themeId ?? undefined,
      destinationIds: data?.data.destinationIds ?? [],
      activity: data?.data.activity ?? "",
      included: data?.data.included ?? "",
      notIncluded: data?.data.notIncluded ?? "",
      safety: data?.data.safety ?? "",
      images: data?.data.images ?? [],
    };
  }, [data?.data]);

  const themeSelectOption = useMemo(() => {
    return dataTheme?.items.map((theme) => {
      return {
        key: theme.id?.toString(),
        label: theme.name,
        value: theme.id?.toString(),
      };
    });
  }, [dataTheme?.items]);

  const citiesSelectOption = useMemo(() => {
    return dataCities?.items.map((city) => {
      return {
        key: city.id?.toString(),
        label: city.name,
        value: city.id?.toString(),
      };
    });
  }, [dataCities?.items]);

  const destinationsOption = useMemo(() => {
    return dataDestination?.items.map((destination) => {
      return {
        key: destination.id?.toString(),
        label: destination.name,
        value: destination.id?.toString(),
      };
    });
  }, [dataDestination?.items]);
  const methods = useForm<FormValues>({
    defaultValues: initValue,
    resolver: yupResolver(schema),
  });

  const { reset, setValue, watch } = methods;
  useEffect(() => {
    // Reset form values when data is loaded
    reset({
      description: data?.data.description || "",
      name: data?.data.name || "",
      transport: data?.data.transport || "",
      price: data?.data.price || 0,
      package: data?.data.package || "",
      numberOfPeople: data?.data.numberOfPeople || 0,
      numberOfHours: data?.data.numberOfHours || 0,
      startDate: data?.data.startDate || "",
      endDate: data?.data.endDate || "",
      isFeature: data?.data.isFeature ?? undefined,
      language: data?.data.language || "",
      cityId: data?.data.cityId || undefined,
      themeId: data?.data.themeId || undefined,
      destinationIds:
        data?.data.TourDestination?.map(
          (destination) => destination.destinationId,
        ) || [],
      activity: data?.data.activity || "",
      included: data?.data.included || "",
      notIncluded: data?.data.notIncluded || "",
      safety: data?.data.safety || "",
      images: data?.data.TourImage?.map((image) => image.image) || [],
    });
  }, [data?.data, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      setLoadingPost(true);
      const body = {
        ...data,
        destinationIds: data.destinationIds.map((destination) =>
          Number(destination),
        ),
      };
      id
        ? await tourServices.updateTour({ id, ...body })
        : await tourServices.createTour(body);
      id? showSuccess(t("editSuccess")) : showSuccess(t("createSuccess"))
      await fetchTour();
    } catch (error) {
      showError(error);
    }finally{
      setLoadingPost(false);
      handleClose();
    }
  };
  const handleDeleteImage = (image: string) => {
      setValue(
        "images",
        id ? data?.data.TourImage?.filter((img) => img.image !== image).map(
          (img) => img.image,
        ) || [] : watch("images").filter((img) => img !== image).map(
          (img) => img,
        ) || [],
      );
  };

  const watchImages = useMemo(() => {
    const images =
      isArray(watch("images")) &&
      watch("images").map((image, index) => {
        return image;
      });
    return images || [];
  }, [watch("images")]);

  if (id && loading) {
    return <Loading />;
  }

  return (
    <CommonStyles.Box className="tw-w-[800px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editTour") : t("createNewTour")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-3">
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="name"
                control={methods.control}
                component={InputField}
                placeholder={t("placeholderName")}
                label={t("name")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="package"
                control={methods.control}
                component={SelectField}
                options={packageOption}
                placeholder={t("placeholderPackage")}
                label={t("package")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-2">
              <RHFField
                name="price"
                type="number"
                control={methods.control}
                placeholder={t("price")}
                component={InputField}
                label={t("price")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-3">
              <RHFField
                name="numberOfPeople"
                type="number"
                placeholder={t("numberOfPeople")}
                control={methods.control}
                component={InputField}
                label={t("numberOfPeople")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-3">
              <RHFField
                type="number"
                name="numberOfHours"
                control={methods.control}
                component={InputField}
                label={t("numberOfHours")}
                placeholder={t("numberOfHours")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-4">
              <RHFField
                name="transport"
                control={methods.control}
                component={SelectField}
                options={transportOption}
                label={t("transport")}
                placeholder={t("placeholderTransport")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="startDate"
                control={methods.control}
                component={CommonDatePicker}
                label={t("startDate")}
                placeholder={t("startDate")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="endDate"
                control={methods.control}
                component={CommonDatePicker}
                label={t("endDate")}
                placeholder={t("endDate")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="isFeature"
                control={methods.control}
                component={CheckboxField}
                label={t("feature")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
              id="language"
                name="language"
                height={200}
                control={methods.control}
                placeholder={t("placeholderLanguage")}
                component={TinyMCEEditorField}
                label={t("language")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="description"
                placeholder={t("placeholderDescription")}
                control={methods.control}
                component={InputField}
                label={t("description")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="activity"
                id="activity"
                control={methods.control}
                placeholder={t("placeholderActivity")}
                component={TinyMCEEditorField}
                label={t("activity")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
              id="included"
                name="included"
                control={methods.control}
                placeholder={t("placeholderIncluded")}
                component={TinyMCEEditorField}
                label={t("included")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
              id="notIncluded"
                name="notIncluded"
                placeholder={t("placeholderNotIncluded")}
                control={methods.control}
                component={TinyMCEEditorField}
                label={t("notIncluded")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="safety"
                id="safety"
                control={methods.control}
                component={TinyMCEEditorField}
                placeholder={t("placeholderSafety")}
                label={t("safety")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="cityId"
                control={methods.control}
                component={SelectField}
                placeholder={t("placeholderCity")}
                options={citiesSelectOption}
                label={t("city")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <RHFField
                name="themeId"
                control={methods.control}
                component={SelectField}
                options={themeSelectOption}
                placeholder={t("placeholderTheme")}
                label={t("theme")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="destinationIds"
                placeholder={t("placeholderDestination")}
                control={methods.control}
                component={SelectField}
                options={destinationsOption}
                multiple
                label={t("destination")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                multiple
                setValue={setValue}
                name="images"
                control={methods.control}
                component={UploadField}
                label={t("image")}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12 tw-flex tw-flex-wrap">
              {watchImages.map((image, index) => {
                return (
                  <CommonStyles.Box
                    className="tw-relative tw-w-fit"
                    key={index} // Thêm key để tránh cảnh báo của React
                  >
                    <img
                      className="tw-max-w-[100px] tw-h-auto tw-p-5"
                      src={`${apiUrls.IMG_URL}/${image}`}
                      alt="Uploaded Image"
                    />
                    <CommonStyles.Box
                      className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer"
                      onClick={() => handleDeleteImage(image)}
                    >
                      <CommonIcons.CancelOutlined className="tw-text-accent_gray_500" />
                    </CommonStyles.Box>
                  </CommonStyles.Box>
                );
              })}
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-around tw-mt-3">
            <CommonStyles.CommonButton loading={loadingPost} type="submit">
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

export default CreateEditTour;
