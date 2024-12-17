import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
export interface FiltersGetUsers extends CommonFilters { }
export interface RequestGetUsers extends CommonFilters { }

export type ResponseUserList = AxiosResponse<ResponseCommon<ResponseList<User[]>>>;
export type ResponseUser = ResponseCommon<User>;


class UserService {
  getUsers(filters: RequestGetUsers, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.USER_URL}?${queryString.stringify(filters)}`,
      configs
    );
  }

  getUser(id: number, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.USER_URL}/${id}`,
      configs
    );
  }

  createUser(payload: User, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.USER_URL}/create-user`, payload, configs);
  }

  deleteUser(id: number, configs?: AxiosRequestConfig) {
    return httpService.delete(`${apiUrls.USER_URL}/${id}`, configs)
  }
}

export default new UserService();
