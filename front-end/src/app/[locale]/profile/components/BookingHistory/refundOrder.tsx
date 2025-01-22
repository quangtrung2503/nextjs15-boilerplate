import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import RHFField from "../../../../../components/customReactFormField/ReactFormField";
import InputField from "../../../../../components/customReactFormField/InputField";
import { CommonButton } from "../../../../../components/common/Button";
import uploadField from "@/app/[locale]/admin/Component/customField/uploadField";
import CommonIcons from "../../../../../components/CommonIcons";
import { Box, CardMedia, Grid } from "@mui/material";
import apiUrls from "@/constants/apiUrls";
import { IRefundData } from "@/services/modules/tour/interfaces/tour";
import { useNotifications } from "@/helpers/toast";
import tourCustomerServices from "@/services/modules/tour/tourCustomer.services";
import { BookingCancellationReason, getOptionEnum } from "@/helpers/common";
import SelectField from "@/app/[locale]/admin/Component/customField/selectField";
import { useTranslations } from "next-intl";

interface IPropOrder {
  idBooking: number;
}

export default function RefundRequest({ idBooking }: IPropOrder) {
  //Const + state
  const t = useTranslations("bookingAdmin");
  const [open, setOpen] = React.useState(false);
  const { showError, showSuccess } = useNotifications();
  const BookingCancellationReasonOption = getOptionEnum(BookingCancellationReason);
  //Hook
  const methods = useForm<IRefundData>({
    defaultValues: {
      reason: "",
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      imageQRCode: "",
    },
    mode: "onTouched",
  });
  
  const { setValue, watch, handleSubmit } = methods;
  const imageQRCode = watch("imageQRCode");
  
  //Function
  const handleDeleteImage = () => {
    setValue("imageQRCode", "");
  };

  const onSubmitRequestRefund: SubmitHandler<IRefundData> = async (values) => {
    try {
      await tourCustomerServices.requestRefundOrder(idBooking, values);
      showSuccess();
      setOpen(false);
    } catch (error: any) {
      showError(error?.response?.data?.messages[0] || t('anErrorOccurred'));
    }
  };

  return (
    <React.Fragment>
      <CommonButton
        variant="contained"
        color="primary"
        size="small"
        className="tw-mt-8 tw-text-xs tw-rounded-lg tw-border-red-600 tw-text-red-700 tw-bg-red-100 hover:tw-bg-red-200"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        Refund
      </CommonButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        className="tw-rounded-lg"
      >
        <DialogTitle className="tw-text-lg tw-font-semibold">{t('refundRequest')}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitRequestRefund)}>
            <DialogContent className="tw-space-y-4">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <RHFField
                    name="reason"
                    label={t('reason')}
                    component={SelectField}
                    options={BookingCancellationReasonOption}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFField
                    component={InputField}
                    name="accountHolderName"
                    label={t('accountHolderName')}
                    rules={{
                      required: t('accountHolderNameRequired')
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFField
                    component={InputField}
                    name="accountNumber"
                    label={t('accountNumber')}
                    rules={{
                      required: t('accountNumberRequired'),
                      pattern: {
                        value: /^\d+$/,
                        message: t('accountNumberNumeric'),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFField
                    component={InputField}
                    name="bankName"
                    label={t('bankName')}
                    rules={{
                      required: t('bankNameRequired'),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFField
                    component={uploadField}
                    setValue={setValue}
                    name="imageQRCode"
                    label={t('qrCode')}
                  />
                </Grid>
              </Grid>

              {imageQRCode && (
                <Box className="tw-flex tw-gap-4 tw-items-center tw-mt-4">
                  <CardMedia
                    component="img"
                    className="tw-w-full tw-h-full tw-rounded-md tw-border tw-border-gray-300"
                    image={`${apiUrls.IMG_URL}/${imageQRCode}`}
                    alt={t('uploadedQRCode')}
                  />
                  <CommonIcons.Close
                    className="tw-cursor-pointer tw-text-gray-500 hover:tw-text-red-500"
                    onClick={handleDeleteImage}
                  />
                </Box>
              )}
            </DialogContent>

            <DialogActions className="tw-flex tw-justify-end tw-px-6 tw-pb-4">
              <Button
                onClick={() => setOpen(false)}
                className="tw-text-gray-600 hover:tw-bg-gray-100"
              >
                {t('cancel')}
              </Button>
              <Button type="submit" variant="contained" className="tw-bg-blue-600 hover:tw-bg-blue-700">
                {t('submit')}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </React.Fragment>
  );
}
