import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { useGet } from "@/stores/useStore";
import cachedKeys from "@/constants/cachedKeys";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import useFiltersHandler from "@/hooks/useFiltersHandler";
import CancelButton from "../../Component/buttonCancel";
import { CommonButtonAdmin } from "../../Component/customField/commonButton";
import SelectField from "../../Component/customField/selectField";
import { BookingStatus, getOptionEnum, RequestRefundStatus } from "@/helpers/common";
import InputField from "../../Component/customField/inputField";
import bookingServices from "@/services/modules/booking/booking.services";
import uploadField from "../../Component/customField/uploadField";
import apiUrls from "@/constants/apiUrls";
import { Box, CardMedia } from "@mui/material";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import tourServices from "@/services/modules/tourAdmin/tour.services";

interface refundBooking {
  id: number;
  handleClose: () => void;
}
interface FormValues {
  status: BookingStatus;
  imageProof: string;
  note: string;
}
const BookingStatusOption = getOptionEnum(RequestRefundStatus);
const RefundBooking: FC<refundBooking> = (props) => {
  //State & props
  const { id, handleClose } = props;

  //Hook
  const { filters } = useFiltersHandler({});
  const { showError, showSuccess } = useNotifications();
  const t = useTranslations("bookingAdmin");
  const fetchBookings = useGet(cachedKeys.fetchBookings);

  const methods = useForm<FormValues>({
    defaultValues: {
      status: BookingStatus.PENDING,
      imageProof: "",
      note: "",
    },
    mode: "onTouched",
  });

  const { reset, setValue, watch } = methods;
  useEffect(() => {
    // Reset form values when data is loaded
    reset({
      status: undefined,
      imageProof: "",
      note: "",
    });
  }, [reset]);

  //Function  
  const handleDeleteImage = () => {
    setValue("imageProof", "");
  };

  const imageProof = watch("imageProof");

  const onSubmitRequestRefund: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await tourServices.feedbackRefundBooking(id, values);
      console.log(res);
      showSuccess(t('refundSuccess'));
     } catch (error: any) {
      showError(error?.response?.data?.messages[0] || t('anErrorOccurred'));
    }
  };
  const onSubmitFeedBackRefund: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const body = {
        id: Number(id),
        imageProof: Number(data.imageProof),
        note: data.note,
        status: data.status
      }
      await bookingServices.updateBooking(body);
      await fetchBookings();
      showSuccess(t("editSuccess"));
      handleClose();
    } catch (error) {
      showError(error);
    }
  };
  return (
    <CommonStyles.Box className="tw-w-[800px] tw-relative">
      <CommonStyles.Box className="tw-flex tw-justify-center tw-mb-8">
        <CommonStyles.Typography type="size20Weight600">
          {t("refundBooking")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitRequestRefund)}>
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-3">
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="status"
                control={methods.control}
                component={SelectField}
                options={BookingStatusOption}
                label={t("status")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="note"
                control={methods.control}
                multiline
                component={InputField}
                placeholder={t("note")}
                label={t("note")}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                component={uploadField}
                setValue={setValue}
                control={methods.control}
                name="imageProof"
                label={t('imageProof')}
              />
            </CommonStyles.Box>

            <CommonStyles.Box className="tw-col-span-12">
              {imageProof && (
                <CommonStyles.Box className="tw-flex tw-gap-4 tw-items-center tw-mt-4">
                  <CardMedia
                    component="img"
                    className="tw-w-full tw-h-full tw-rounded-md tw-border tw-border-gray-300"
                    image={`${apiUrls.IMG_URL}/${imageProof}`}
                    alt={t('uploadedQRCode')}
                  />
                  <CommonIcons.Close
                    className="tw-cursor-pointer tw-text-gray-500 hover:tw-text-red-500"
                    onClick={handleDeleteImage}
                  />
                </CommonStyles.Box>
              )}
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-center tw-gap-8 tw-mt-8 tw-mb-4">
            <CancelButton handleClose={handleClose} />
            <CommonButtonAdmin
              variant="outlined"
              type="submit"
              className="active tw-min-w-28"
            >
              {t("confirm")}
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

export default RefundBooking;