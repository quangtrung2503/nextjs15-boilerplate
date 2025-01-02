import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Tag } from "./interfaces/tag";
export interface FiltersGetTags extends CommonFilters { }
export interface RequestGetTags extends CommonFilters { }

export type ResponseTagList = AxiosResponse<ResponseCommon<ResponseList<Tag[]>>>;
export type ResponseTag = ResponseCommon<Tag>;


class TagService {
  getTags(filters: RequestGetTags, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TAG_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getTag(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TAG_URL}/${id}`,
      configs
    );
  }

  createTag(payload: Tag, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.TAG_URL}`, payload, configs);
  }

  updateTag(payload: Tag,configs?: AxiosRequestConfig){
    const {id,...data} = payload;
    return httpService.patch(`${apiUrls.TAG_URL}/${id}`,data,configs);
  }

  deleteTag(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.TAG_URL}/${id}`, configs)
  }
}

export default new TagService();
