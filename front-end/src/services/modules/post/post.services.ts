import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { Post } from "./interface/post";
export interface FiltersGetPosts extends CommonFilters { }
export interface RequestGetPosts extends CommonFilters { }

export type ResponsePostList = AxiosResponse<ResponseCommon<ResponseList<Post[]>>>;
export type ResponsePost = ResponseCommon<Post>;


class PostService {
  getPosts(filters: RequestGetPosts, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.POST_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }
  getPost(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.POST_URL}/${id}`,
      configs
    );
  }
  createPost(payload: Post, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.POST_URL}`, payload, configs);
  }

  updatePost(payload: Post,configs?: AxiosRequestConfig){
    const {id,...dataUpdate} = payload;
    return httpService.patch(`${apiUrls.POST_URL}/${id}`,dataUpdate,configs);
  }

  deletePost(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.POST_URL}/${id}`, configs)
  }
}

export default new PostService();
