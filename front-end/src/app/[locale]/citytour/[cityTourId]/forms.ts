import { useTranslations } from "next-intl";
import * as Yup from "yup";

export const defaultValue : InfoBooking = {
    rating: 0,
    startDate: '',
    endDate: '',
    noOfGuest: {
        adultQuantity: 0,
        childQuantity: 0,
    },
}

export interface NoOfGuest {
    adultQuantity: number;
    childQuantity: number;
}
export interface InfoBooking {
    rating: number;
    startDate: string | null;
    endDate: string | null;
    noOfGuest: NoOfGuest ;
}

export interface BookTour {
    tourId: number;
    startDate: string | null;
    endDate: string | null;
    numberOfAdults: number;
    numberOfChildren: number;
    totalPrice: number;
    status: string;
    paymentMethod: string;
}