import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { ApiResponse, Tour, TourImage } from "./interfaces/tour";

export interface FiltersGetTours extends CommonFilters {}
export interface RequestGetTours extends CommonFilters {}

export type ResponseTourCustomerList = AxiosResponse<
  ResponseCommon<ResponseList<Tour[]>>
>;
export type ResponseTourCustomer = ResponseCommon<ApiResponse>;

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
  getTour(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.TOUR_CUS_URL}/${id}`, configs);
  }
  getGalleryCustomer(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/gallery/get-images`,
      configs,
    );
  }
}

export default new TourService();
