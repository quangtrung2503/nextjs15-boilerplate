import Form from "next/form";
import { ChangeEvent, FC, useEffect, useMemo } from "react";
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
import { BookingStatus, getOptionEnum } from "@/helpers/common";
import useGetBooking from "@/services/modules/booking/hooks/useGetBooking";
import { CommonDatePicker } from "../../Component/customField/datePickerField";
import InputField from "../../Component/customField/inputField";
import bookingServices from "@/services/modules/booking/booking.services";

interface editBooking {
  id?: number;
  handleClose: () => void;
}
interface FormValues {
  status?: BookingStatus;
  amountPaid?: number;
  note?: string;
}
const BookingStatusOption = getOptionEnum(BookingStatus);
const EditBooking: FC<editBooking> = (props) => {
  //State & props
  const { id, handleClose } = props;

  //Hook
  const { data } = useGetBooking(Number(id), { isTrigger: !!id });
  const { filters } = useFiltersHandler({});
  const { showError, showSuccess } = useNotifications();
  const t = useTranslations("bookingAdmin");
  const fetchBookings = useGet(cachedKeys.fetchBookings);

  const initValue = useMemo(() => {
    return {
      status: data?.data.status ?? undefined,
      amountPaid: data?.data.amountPaid ?? 0,
      note: data?.data.note ?? "",
    };
  }, [data?.data]);

  //Hook form
  const methods = useForm<FormValues>({ defaultValues: initValue });
  const { reset, setValue, watch } = methods;
  useEffect(() => {
    // Reset form values when data is loaded
    reset({
      status: data?.data.status ?? undefined,
      amountPaid: data?.data.amountPaid ?? 0,
      note: data?.data.note ?? "",
    });
  }, [data?.data, reset]);

  //Function
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const body = {
        id: Number(id),
        amountPaid: Number(data.amountPaid),
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
          {t("editBooking")}
        </CommonStyles.Typography>
      </CommonStyles.Box>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-3">
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="amountPaid"
                control={methods.control}
                component={InputField}
                type="number"
                placeholder={t("amountPaid")}
                label={t("amountPaid")}
              />
            </CommonStyles.Box>
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

export default EditBooking;
