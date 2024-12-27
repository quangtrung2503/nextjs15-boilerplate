import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { City, CityDetail } from "./interfaces/city";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";

export interface FiltersGetCitiesCustomer extends CommonFilters {}
export interface RequestGetCitiesCustomer extends CommonFilters {}

export type ResponseCityList = AxiosResponse<
  ResponseCommon<ResponseList<City[]>>
>;

export interface FiltersGetDetailCitiesCustomer extends CommonFilters {}
export interface RequestGetDetailCitiesCustomer extends CommonFilters {}

export type ResponseCityDetail = AxiosResponse<
  ResponseCommon<ResponseList<CityDetail[]>>
>;
export type ResponseCityCustomerDetail = ResponseCommon<CityDetail>;

class CityService {
  getCityCustomer(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.CITY_CUS_URL}`, configs);
  }
  getDetailCityCustomer(slug: string, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.CITY_CUS_URL}/${slug}`, configs);
  }
}

export default new CityService();
