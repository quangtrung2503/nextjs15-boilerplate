import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import { ApiResponse } from "../tour/interfaces/tour";
import { Video } from "./interfaces/video";

export interface FiltersGetVideoCustomer extends CommonFilters {}
export interface RequestGetVideoCustomer extends CommonFilters {}

export type ResponseVideoCustomer = ResponseCommon<Video>;

class VideoCustomerService {
  getVideoCustomer(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.VIDEO_CUS_URL}/display`, configs);
  }
}

export default new VideoCustomerService();
