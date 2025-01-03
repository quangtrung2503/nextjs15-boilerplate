import { User } from "../../user/interfaces/user.inteface";
import { Tour } from "../../tour/interfaces/tour";
import { BookingStatus, PaymentMethod } from "@/helpers/common";

export interface Booking{
  id?: number
  bookingCode: string,
  userId: number,
  tourId: number,
  startDate: string,
  endDate: string,
  numberOfAdults: number,
  numberOfChildren: number,
  totalPrice: number,
  amountPaid: number,
  status: BookingStatus,
  paymentMethod: string,
  PaymentProof: PaymentProof[],
  paymentProof: string,
  note?: null | string,
  cancelReason?: null|string,
  updatedBy: string,
  createdAt?: string,
  updatedAt?: string,
  User: User,
  Tour: Tour,  
}
export interface BookingUpdate{
  id?: number;
  startDate?: string;
  endDate?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  status?: BookingStatus;
  amountPaid?: number;
  note?: string;
}
export interface PaymentProof {
  id?: number,
  bookingId?: number,
  image: string,
  createdAt?: string,
  updatedAt?: string
}