import { useTranslations } from "next-intl";
import * as Yup from "yup";
export const defaultValue = {
    startDate: undefined,
    endDate: undefined,
    noOfGuest: {
        adultQuantity: undefined,
        childQuantity: undefined,
    },
}

export interface NoOfGuest {
    adultQuantity?: number | undefined;
    childQuantity?: number | undefined;
}
export interface InfoBooking {
    startDate: Date;
    endDate: Date;
    noOfGuest: NoOfGuest;
}