import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { RefundDataAdmin, Tour } from "./interfaces/tour";

export interface FiltersGetTours extends CommonFilters { }
export interface RequestGetTours extends CommonFilters { }
export type ResponseTourList = AxiosResponse<ResponseCommon<ResponseList<Tour[]>>>;
export type ResponseTour = ResponseCommon<Tour>;


class TourService {
  getTours(filters: RequestGetTours, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getTour(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_URL}/${id}`,
      configs
    );
  }

  createTour(payload: Tour, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.TOUR_URL}`, payload, configs);
  }

  updateTour(payload: Tour,configs?: AxiosRequestConfig){
    const {id,...data} = payload;
    return httpService.patch(`${apiUrls.TOUR_URL}/${id}`,data,configs);
  }

  deleteTour(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.TOUR_URL}/${id}`, configs)
  }
  feedbackRefundBooking(id: number, refundData: RefundDataAdmin) {
    return httpService.patch(`${apiUrls.FEEDBACK_REFUND_ADMIN}/${id}`, refundData)
  }
}

export default new TourService();
