import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { ApiResponse, CustomerReview, ReviewData, Stats, Tour, TourImage } from "./interfaces/tour";

export interface FiltersGetTours extends CommonFilters {}
export interface RequestGetTours extends CommonFilters {}

export interface FiltersGetReviewCustomer extends CommonFilters { }
export interface RequestGetReviewCustomer extends CommonFilters { }

export type ResponseTourCustomerList = AxiosResponse<ResponseCommon<ResponseList<Tour[]>>>;
export type ResponseTourCustomer = ResponseCommon<ApiResponse>;
export type ResponseTourCustomerReview = ResponseCommon<ReviewData>;

export interface ExtraData<T> extends ResponseList<T>{
  stats: Stats,
}
export interface ExtraReview<T>  {
  data: ExtraData<T>
}

export type ResponseReviewCustomer = AxiosResponse<ExtraReview<CustomerReview[]>>

export interface FiltersGetGallery extends CommonFilters {}
export interface RequestGetGallery extends CommonFilters {}

export type ResponseTourGalleryList = AxiosResponse<
  ResponseCommon<ResponseList<TourImage[]>>
>;

class TourService {
  getTours(filters: RequestGetTours, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}?${queryString.stringify(filters)}`,
      configs,
    );
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
}

export default new TourService();
