import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { ApiResponse, Tour } from "./interfaces/tour";

export interface FiltersGetTours extends CommonFilters { }
export interface RequestGetTours extends CommonFilters { }

export type ResponseTourCustomerList = AxiosResponse<ResponseCommon<ResponseList<Tour[]>>>;
export type ResponseTourCustomer = ResponseCommon<ApiResponse>;

class TourService {
  getTours(filters: RequestGetTours, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }
  getTour(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/${id}`,
      configs
    );
  }
}

export default new TourService();
