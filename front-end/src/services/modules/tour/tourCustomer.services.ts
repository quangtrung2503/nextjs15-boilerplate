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

export interface FiltersGetTourDestination extends CommonFilters {}
export interface RequestGetTourDestination extends CommonFilters {}

export type ResponseTourDestinationList = AxiosResponse<
  ResponseCommon<ResponseList<Tour[]>>
>;
export interface FiltersGetTourBestTrending extends CommonFilters {}
export interface RequestGetTourBestTrending extends CommonFilters {}

export type ResponseTourBestTrending = ResponseCommon<Tour>;

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
}

export default new TourService();
