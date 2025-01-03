import { useTranslations } from "next-intl";
import * as Yup from "yup";

export const defaultValue : InfoBooking = {
    rating: 0,
    startDate: '',
    endDate: '',
    noOfGuest: {
        adultQuantity: '',
        childQuantity: '',
    },
}

export interface NoOfGuest {
    adultQuantity: string | null;
    childQuantity: string | null;
}
export interface InfoBooking {
    rating: number;
    startDate: string | null;
    endDate: string | null;
    noOfGuest: NoOfGuest ;
}