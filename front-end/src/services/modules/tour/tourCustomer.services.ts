import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { ApiResponse, CustomerReview, HistoryBookingTour, ReviewData, Stats, Tour, TourImage } from "./interfaces/tour";
import { BookTour } from "@/app/[locale]/citytour/[cityTourId]/forms";

export interface FiltersGetTours extends CommonFilters {}
export interface RequestGetTours extends CommonFilters {}

export interface FiltersGetReviewCustomer extends CommonFilters {
  ratings?: number
}
export interface RequestGetReviewCustomer extends CommonFilters {
  ratings?: number[]
}

export interface ExtraData<T> extends ResponseList<T>{
  stats: Stats,
}
export interface ExtraReview<T>  {
  data: ExtraData<T>
}

export type ResponseTourCustomerList = AxiosResponse<ResponseCommon<ResponseList<Tour[]>>>;
export type ResponseTourGalleryList = AxiosResponse<ResponseCommon<ResponseList<TourImage[]>>>;
export type ResponseTourDestinationList = AxiosResponse<ResponseCommon<ResponseList<Tour[]>>>;
export type ResponseReviewCustomer = AxiosResponse<ExtraReview<CustomerReview[]>>
export type ResponseBookingHistory = AxiosResponse<ResponseCommon<ResponseList<HistoryBookingTour[]>>>;

export type ResponseTourCustomer = ResponseCommon<ApiResponse>;
export type ResponseTourCustomerReview = ResponseCommon<ReviewData>;
export type ResponseTourBestTrending = ResponseCommon<Tour>;

export interface FiltersGetGallery extends CommonFilters {}
export interface RequestGetGallery extends CommonFilters {}

export interface FiltersGetTourDestination extends CommonFilters {}
export interface RequestGetTourDestination extends CommonFilters {}

export interface FiltersGetTourBestTrending extends CommonFilters {}
export interface RequestGetTourBestTrending extends CommonFilters {}



class TourService {
  getTours(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.TOUR_CUS_URL}`, configs);
  }
  getTour(slug: string, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/${slug}`,
      configs
    );
  }
  getTourCustomerReview( filters: RequestGetReviewCustomer, slug: string, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/get-review/${slug}?${queryString.stringify(filters)}`,
      configs
    );
  }
  getTourDestination(configs?: AxiosRequestConfig) {
    const queryString = "isFeatureDestination=true";
    return httpService.get(`${apiUrls.TOUR_CUS_URL}?${queryString}`, configs);
  }
  getTourBestTrending(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/trending/get-best-trending`,
      configs,
    );
  }
  bookTourCustomer(tour: BookTour, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.BOOKING_TOUR_URL}`, tour)
  }
  
  reloadPayByVnpay(url: string, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.VNPAY_RETURN_URL}${url}`)
  }
  getBookingHistory(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.BOOKING_TOUR_URL}`)
  }
}

export default new TourService();
