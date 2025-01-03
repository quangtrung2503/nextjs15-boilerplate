"use client";

import { FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { default as CommonStyles } from "@/components/common";
import RHFField from "@/components/customReactFormField/ReactFormField";
import { useNotifications } from "@/helpers/toast";
import CommonIcons from "@/components/CommonIcons";
import { useTranslations } from "next-intl";
import CancelButton from "../../Component/buttonCancel";
import { CommonButtonAdmin } from "../../Component/customField/commonButton";
import { BookingStatus } from "@/helpers/common";
import useGetBooking from "@/services/modules/booking/hooks/useGetBooking";
import InputField from "../../Component/customField/inputField";
import bookingServices from "@/services/modules/booking/booking.services";
import apiUrls from "@/constants/apiUrls";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import pageUrls from "@/constants/pageUrls";

interface FormValues {
  status?: BookingStatus;
  amountPaid?: number;
  note?: string;
}

const ConfirmTour: FC = () => {
  //State & props
  const params = useParams();
  const { confirmTourId } = params;

  //Hook
  const { data } = useGetBooking(Number(confirmTourId), {
    isTrigger: !!confirmTourId,
  });
  const { showError, showSuccess } = useNotifications();
  const t = useTranslations("confirmTour");
  const router = useRouter();

  const initValue = useMemo(() => {
    return {
      status: data?.data.status ?? undefined,
      amountPaid: data?.data.amountPaid ?? 0,
      note: data?.data.note ?? "",
    };
  }, [data?.data]);

  //Hook form
  const methods = useForm<FormValues>({ defaultValues: initValue });
  const { reset } = methods;
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
        id: Number(confirmTourId),
        amountPaid: Number(data.amountPaid),
        note: data.note,
        status: BookingStatus.CONFIRMED,
      };
      await bookingServices.updateBooking(body);
      showSuccess(t("confirmSuccess"));
      router.push(pageUrls.Admin.Booking)
    } catch (error) {
      showError(error);
    }
  };
  return (
    <CommonStyles.Box className="tw-px-10 tw-text-black">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CommonStyles.Box className="tw-grid tw-grid-cols-12 tw-gap-3">
            <CommonStyles.Box className="tw-col-span-1">
              <img
                className="tw-rounded-xl"
                width={90}
                height={90}
                src={`${apiUrls.IMG_URL}/${(data?.data?.Tour?.TourImage as any)[0]?.image}`}
              />
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-11">
              <CommonStyles.Typography className="tw-bg-white tw-w-fit tw-p-2 tw-font-bold tw-rounded-md tw-text-primary">
                {t("code")}: {data?.data.bookingCode}
              </CommonStyles.Typography>
              <CommonStyles.Typography
                type="size23Weight600"
                className="tw-font-bold tw-my-1"
              >
                {data?.data.Tour.name}
              </CommonStyles.Typography>
              <CommonStyles.Box>
                <CommonStyles.Typography className="tw-font-bold tw-text-gray-500">
                  {moment(data?.data.startDate).format("MMM DD, YYYY")} -{" "}
                  {moment(data?.data.endDate).format("MMM DD, YYYY")}
                </CommonStyles.Typography>
              </CommonStyles.Box>
            </CommonStyles.Box>
            <CommonStyles.Divider className="tw-col-span-12" />
            <CommonStyles.Typography
              className="tw-col-span-12 tw-font-bold"
              type="size20Weight600"
            >
              {t("guestInformation")}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("guestName")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.User.name}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("phoneNumber")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.User.phone}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("email")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.User.email}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("address")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.User.address}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("numberOfAdults")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.numberOfAdults}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-6">
              <CommonStyles.Typography className="tw-text-gray-400 tw-font-bold">
                {t("numberOfChildren")}
              </CommonStyles.Typography>
              <CommonStyles.Typography>
                {data?.data.numberOfChildren}
              </CommonStyles.Typography>
            </CommonStyles.Box>
            <CommonStyles.Divider className="tw-col-span-12" />
            <CommonStyles.Typography
              className="tw-col-span-12 tw-font-bold"
              type="size20Weight600"
            >
              {t("tourDestination")}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-col-span-12">
            <CommonStyles.Box className="tw-grid tw-gap-3">
              {data?.data.Tour?.TourDestination?.map((des, index, array) => {
                return (
                  <CommonStyles.Box key={index} className="tw-flex">
                    <CommonStyles.Box className="tw-relative">
                      {index!== array.length - 1 && <div className="tw-absolute tw-left-1/2 tw-top-0 tw-bottom-0 tw-w-[1.5px] tw-bg-gray-300 tw-transform tw-translate-x-[-50%] tw-translate-y-5 tw-h-[70%]" />}
                      <CommonIcons.Circle className="tw-text-sm tw-text-primary" />
                    </CommonStyles.Box>
                    <CommonStyles.Box className="tw-ml-3">
                      <CommonStyles.Typography type="size16Weight400">
                        {des.Destination.name}
                      </CommonStyles.Typography>
                      {/* <CommonStyles.Typography className="tw-uppercase tw-font-bold tw-text-gray-400">
                        {"DD MMM h:mm A"}
                      </CommonStyles.Typography> */}
                    </CommonStyles.Box>
                  </CommonStyles.Box>
                );
              })}
            </CommonStyles.Box>
            </CommonStyles.Box>
            <CommonStyles.Typography
              className="tw-col-span-12 tw-font-bold"
              type="size20Weight600"
            >
              {t("paidInformation")}
            </CommonStyles.Typography>
            <CommonStyles.Box className="tw-col-span-12">
              {data?.data.PaymentProof.map((payment, index) => {
                return (
                  <img
                    key={index}
                    className="tw-rounded-lg"
                    width={200}
                    src={`${apiUrls.IMG_URL}/${payment.image}`}
                  />
                );
              })}
            </CommonStyles.Box>
            <CommonStyles.Box className="tw-col-span-12">
              <RHFField
                name="amountPaid"
                control={methods.control}
                component={InputField}
                type="number"
                placeholder={t("amountPaid")}
              />
            </CommonStyles.Box>
          </CommonStyles.Box>
          <CommonStyles.Box className="tw-flex tw-justify-center tw-gap-8 tw-mt-8 tw-mb-4">
            <CancelButton handleClose={()=>{}} />
            <CommonButtonAdmin
              variant="outlined"
              type="submit"
              className="active tw-min-w-28"
            >
              {t("confirm")}
            </CommonButtonAdmin>
          </CommonStyles.Box>
        </form>
      </FormProvider>
    </CommonStyles.Box>
  );
};

export default ConfirmTour;
