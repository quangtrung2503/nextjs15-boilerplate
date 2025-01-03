import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Theme } from "./interfaces/theme";
export interface FiltersGetThemes extends CommonFilters {}
export interface RequestGetThemes extends CommonFilters {}

export type ResponseThemeList = AxiosResponse<
  ResponseCommon<ResponseList<Theme[]>>
>;

class ThemeService {
  getThemes(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.THEME_CUS_URL}`, configs);
  }
}

export default new ThemeService();
