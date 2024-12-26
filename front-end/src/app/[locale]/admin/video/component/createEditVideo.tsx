import { FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/customReactFormField/InputField";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import CheckboxField from "@/components/customReactFormField/CheckBoxField";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/helpers/toast";
import useGetVideo from "@/services/modules/video/hook/useGetVideo";
import { Video } from "@/services/modules/video/interfaces/video";
import videoServices from "@/services/modules/video/video.services";
import UploadField from "@/components/customReactFormField/UploadField";
import apiUrls from "@/constants/apiUrls";

interface createEditVideoProps {
  id?: number;
  handleClose: () => void;
}
interface FormValues {
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  isDisplay?: boolean;
}
const CreateEditVideo: FC<createEditVideoProps> = (props) => {
  const { id, handleClose } = props;
  const { data } = useGetVideo(Number(id), { isTrigger: !!id });
  const t = useTranslations("videoAdmin");
  const { showError, showSuccess } = useNotifications();

  const schema = yup
    .object({
      title: yup.string().required(t("titleRequire")),
      description: yup.string().required(t("descriptionRequire")),
      thumbnail: yup.string().required(t("thumbnailRequire"))
    .matches(/\.(jpg|jpeg|png)$/i, t("thumbnailFormat")),
      video: yup.string().required(t("videoRequire"))
      .matches(/\.(mp4|avi|mov)$/i, t("videoFormat")),
    })
    .required();
  const initValue = useMemo(() => {
    return {
      title: data?.data.title ?? "",
      description: data?.data.description ?? "",
      thumbnail: data?.data.thumbnail ?? "",
      video: data?.data.video ?? "",
      isDisplay: data?.data.isDisplay ?? false,
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
        title: data?.data.title ?? "",
        description: data?.data.description ?? "",
        thumbnail: data?.data.thumbnail ?? "",
        video: data?.data.video ?? "",
        isDisplay: data?.data.isDisplay ?? false,
      });
    }
  }, [data?.data, reset]);
  const fetchVideos = useGet(cachedKeys.fetchVideos);
  const onSubmit: SubmitHandler<FormValues> = async (data: Video) => {
    try {
      id ? (data = { ...data, id }) : { data };
      id
        ? await videoServices.updateVideo(data)
        : await videoServices.createVideo(data);
      await fetchVideos();
      showSuccess(id ? t("editSuccess") : t("createSuccess"));
      handleClose();
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteImage = () => {
    setValue("thumbnail", "");
  };

  const handleDeleteVideo = () => {
    setValue("video", "");
  };

  return (
    <CommonStyles.Box className="tw-w-[500px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center">
        <CommonStyles.Typography type="size20Weight600">
          {id ? t("editVideo") : t("createNewVideo")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <RHFField
            className="tw-mb-3"
            name="title"
            control={methods.control}
            component={InputField}
            label={t("title")}
            placeholder={t("placeholderTitle")}
          />
          <RHFField
            className="tw-mb-3"
            name="description"
            control={methods.control}
            component={InputField}
            label={t("description")}
            placeholder={t("placeholderDescription")}
          />
          <CommonStyles.Box className="tw-col-span-12">
            <RHFField
              setValue={setValue}
              className="tw-mb-3"
              name="thumbnail"
              control={methods.control}
              label={t("thumbnail")}
              component={UploadField}
            />
          </CommonStyles.Box>
          {watch("thumbnail") != "" && (
            <CommonStyles.Box className="tw-col-span-12 tw-flex tw-flex-wrap">
              <CommonStyles.Box className="tw-relative tw-w-fit">
                <img
                  className="tw-max-w-[100px] tw-h-auto tw-p-5"
                  src={`${apiUrls.IMG_URL}/${watch("thumbnail")}`}
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
          )}
          <CommonStyles.Box className="tw-col-span-12">
            <RHFField
              setValue={setValue}
              name="video"
              control={methods.control}
              label={t("video")}
              component={UploadField}
            />
          </CommonStyles.Box>
          {watch("video") != ""  && (
            <CommonStyles.Box className="tw-col-span-12 tw-justify-center tw-flex tw-flex-wrap">
              <CommonStyles.Box className="tw-relative tw-w-fit">
                <video
                    className="tw-max-w-[300px] tw-h-auto tw-p-5"
                    controls>
                  <source
                    src={`${apiUrls.IMG_URL}/${watch("video")}`}
                    type="video/mp4"
                  />
                  {t("notEnableVideo")}
                </video>
                <CommonStyles.Box
                  className="tw-absolute tw-top-0 tw-right-0 tw-cursor-pointer"
                  onClick={() => handleDeleteVideo()}
                >
                  <CommonIcons.CancelOutlined className="tw-text-accent_gray_500" />
                </CommonStyles.Box>
              </CommonStyles.Box>
            </CommonStyles.Box>
          )}
          <RHFField
            name="isDisplay"
            control={methods.control}
            component={CheckboxField}
            label={t("isDisplay")}
          />
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

export default CreateEditVideo;
