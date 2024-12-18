import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Destination } from "./interface/destination";
export interface FiltersGetDestinations extends CommonFilters { }
export interface RequestGetDestinations extends CommonFilters { }

export type ResponseDestinationList = AxiosResponse<ResponseCommon<ResponseList<Destination[]>>>;
export type ResponseDestination = ResponseCommon<Destination>;


class DestinationService {
  getDestinations(filters: RequestGetDestinations, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.DESTINATION_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }
  getDestination(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.DESTINATION_URL}/${id}`,
      configs
    );
  }
  createDestination(payload: Destination, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.DESTINATION_URL}`, payload, configs);
  }

  updateDestination(payload: Destination,configs?: AxiosRequestConfig){
    const {id,...dataUpdate} = payload;
    return httpService.patch(`${apiUrls.DESTINATION_URL}/${id}`,dataUpdate,configs);
  }

  deleteDestination(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.DESTINATION_URL}/${id}`, configs)
  }
}

export default new DestinationService();
