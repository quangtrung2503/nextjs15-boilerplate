import apiUrls from "@/constants/apiUrls";
import { ResponseCommon } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig } from "axios";
import { Profile, SetPassword, UpdateProfile } from "./interface/profile";

export type ResponseProfile = ResponseCommon<Profile>;

class ProfileService {
  getProfileUser(id: number, configs: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.PROFILE_URL}/${id}`, configs);
  }
  updatePersonalProfile(payload: UpdateProfile, configs?: AxiosRequestConfig) {
    const {id,...dataUpdateUser} = payload;
    return httpService.patch(`${apiUrls.USER_URL}/${id}`, dataUpdateUser, configs)
  }
  setPasswordUser(payload: SetPassword, configs?: AxiosRequestConfig) {
    const {...dataSetPassword} = payload;
    return httpService.post(`${apiUrls.AUTH.CHANGE_PASSWORD}`, dataSetPassword, configs)
  }
}

export default new ProfileService();