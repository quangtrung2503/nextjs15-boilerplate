import { CommonFilters, ResponseApi, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { City } from "./interfaces/city";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
export interface FiltersGetCities extends CommonFilters { }
export interface RequestGetCities extends CommonFilters { }

export type ResponseCityList = AxiosResponse<ResponseApi<ResponseList<City[]>>>;
export type ResponseCity = ResponseApi<City>;

class CityService {
  getCities(filters: RequestGetCities, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.CITY_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }
  createCity(payload: City, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.CITY_URL}/create-City`, payload, configs);
  }
  deleteCity(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.CITY_URL}/${id}`, configs)
  }
}

export default new CityService();
