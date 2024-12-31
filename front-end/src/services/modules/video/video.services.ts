import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Video } from "./interfaces/video";
export interface FiltersGetVideos extends CommonFilters { }
export interface RequestGetVideos extends CommonFilters { }

export type ResponseVideoList = AxiosResponse<ResponseCommon<ResponseList<Video[]>>>;
export type ResponseVideo = ResponseCommon<Video>;


class VideoService {
  getVideos(filters: RequestGetVideos, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.VIDEO_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getVideo(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.VIDEO_URL}/${id}`,
      configs
    );
  }

  createVideo(payload: Video, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.VIDEO_URL}`, payload, configs);
  }

  updateVideo(payload: Video,configs?: AxiosRequestConfig){
    const {id,...data} = payload;
    return httpService.patch(`${apiUrls.VIDEO_URL}/${id}`, data, configs);
  }

  deleteVideo(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.VIDEO_URL}/${id}`, configs)
  }
}

export default new VideoService();
