import { AxiosResponse } from "axios";

export interface Result {
  accessToken: string;
  user: IUser;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: Result;
}

export interface IUser {
  id: number;
  name?: string;
  username: string;
  isVerifyOtp: boolean;
  phone: string;
  email: string;
  status: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  storeID: number;
  roleID?: number;
  lastName?: string;
  firstName?: string;
  phoneCode?: string;
  cid?: string;
  avatar?: string;
  permissionId?: number;
}

export type RequestLogin = {
  user?: string;
  password: string;
};

export type ResponseLogin = AxiosResponse<LoginResponse>;