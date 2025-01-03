import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Destination } from "./interface/destination";
export interface FiltersGetThemes extends CommonFilters {}
export interface RequestGetThemes extends CommonFilters {}

export type ResponseDestinationList = AxiosResponse<
  ResponseCommon<ResponseList<Destination[]>>
>;

class ThemeService {
  getDestinations(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.DESTINATION_CUS_URL}`, configs);
  }
}

export default new ThemeService();
