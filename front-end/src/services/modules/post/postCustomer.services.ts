import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Post } from "./interface/post";
export interface FiltersGetPostsCustomer extends CommonFilters {}
export interface RequestGetPostsCustomer extends CommonFilters {}

export type ResponsePostListCustomer = AxiosResponse<
  ResponseCommon<ResponseList<Post[]>>
>;
// export type ResponsePost = ResponseCommon<Post>;

class PostService {
  getPostCustomer(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.POST_CUS_URL}`, configs);
  }
}

export default new PostService();
