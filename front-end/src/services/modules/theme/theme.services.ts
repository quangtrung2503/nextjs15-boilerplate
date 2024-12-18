import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Theme } from "./intefaces/theme";
export interface FiltersGetThemes extends CommonFilters { }
export interface RequestGetThemes extends CommonFilters { }

export type ResponseThemeList = AxiosResponse<ResponseCommon<ResponseList<Theme[]>>>;
export type ResponseTheme = ResponseCommon<Theme>;


class ThemeService {
  getThemes(filters: RequestGetThemes, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.THEME_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getTheme(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.THEME_URL}/${id}`,
      configs
    );
  }

  createTheme(payload: Theme, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.THEME_URL}`, payload, configs);
  }

  updateTheme(payload: Theme,configs?: AxiosRequestConfig){
    const {id,...data} = payload;
    return httpService.patch(`${apiUrls.THEME_URL}/${id}`,data,configs);
  }

  deleteTheme(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.THEME_URL}/${id}`, configs)
  }
}

export default new ThemeService();
