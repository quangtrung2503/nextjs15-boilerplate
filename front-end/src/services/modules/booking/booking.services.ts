import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Booking, BookingUpdate } from "./interfaces/booking";
import { BookingStatus } from "@/helpers/common";

export interface FiltersGetBookings extends CommonFilters {
  statuses?: BookingStatus
 }
export interface RequestGetBookings extends CommonFilters { }
export type ResponseBookingList = AxiosResponse<ResponseCommon<ResponseList<Booking[]>>>;
export type ResponseBooking = ResponseCommon<Booking>;


class BookingService {
  getBookings(filters: RequestGetBookings, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.BOOKING_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getBooking(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.BOOKING_URL}/${id}`,
      configs
    );
  }

  createBooking(payload: Booking, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.BOOKING_URL}`, payload, configs);
  }

  updateBooking(payload: BookingUpdate,configs?: AxiosRequestConfig){
    const {id,...data} = payload;
    return httpService.patch(`${apiUrls.BOOKING_URL}/update-booking/${id}`,data,configs);
  }

  deleteBooking(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.BOOKING_URL}/${id}`, configs)
  }
}

export default new BookingService();
