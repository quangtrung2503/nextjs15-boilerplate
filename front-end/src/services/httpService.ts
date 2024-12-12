import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { cloneDeep, isArray, isObject, isString } from 'lodash';
import { localStorageFunc } from '@/helpers/common';
import { IUser } from './modules/auth/interfaces/signin.interface';

export const KEY_TOKEN = 'KEY_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const KEY_USER = 'KEY_USER';
export const KEY_USER_AGENT = 'KEY_USER_AGENT';
export const KEY_EMAIL = 'KEY_EMAIL';

const iterateNestObject = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key) => {
    if (isString(obj[key])) {
      obj[key] = obj[key].trim();
    }

    if (isObject(obj[key]) && obj[key] !== null) {
      iterateNestObject(obj[key]);
    }

    if (isArray(obj[key])) {
      obj[key].forEach((eachValue: any) => {
        if (isString(eachValue)) {
          eachValue.trim();
        }

        if (isObject(eachValue)) {
          iterateNestObject(eachValue);
        }
      });
    }
  });
};

const parseToken = (token: string) => {
  return token;
};

class HttpService {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create();
    this.axios.defaults.withCredentials = false;

    //! Interceptor request
    this.axios.interceptors.request.use(
      (config) => {
        const nextConfig = cloneDeep(config);
        const token = localStorageFunc?.getItem(KEY_TOKEN) || '';

        if (!!token) {
          config.headers['Authorization'] = 'Bearer ' + parseToken(token);
        }

        const body = nextConfig?.data;
        if (isObject(body)) {
          iterateNestObject(body);
        }
        return nextConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      function (config) {
        const statusCode = config.data?.data?.status;
        if (statusCode >= 400 && statusCode <= 499) {
          return Promise.reject(config?.data?.data?.message);
        }
        return config;
      },
      function (error) {
        const urlReq = error.response.config.url;
        // const isAdminLoginUrl = urlReq.includes(apiUrls.LOGIN_ADMIN);
        // if (error.response.status === 401 && !isLoginUrl) {
        //   localStorage.removeItem(KEY_TOKEN);
        //   localStorage.removeItem(KEY_USER);
        //   window.location.reload();
        //   return;
        // }

        return Promise.reject(error);
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.interceptors.request.use(
      function (config) {
        if (!!token) {
          config.headers['Authorization'] = 'Bearer ' + parseToken(token);
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  saveTokenToLocalStorage(token: string) {
    localStorageFunc?.setItem(KEY_TOKEN, token);
  }

  saveRefreshTokenToLocalStorage(refreshToken: string) {
    localStorageFunc?.setItem(REFRESH_TOKEN, refreshToken);
  }

  saveUserToStorage(user: IUser) {
    localStorageFunc?.setItem(KEY_USER, JSON.stringify(user));
  }

  getTokenFromLocalStorage() {
    const token = localStorageFunc?.getItem(KEY_TOKEN);

    return token;
  }

  getUserFromLocalStorage() {
    const user = localStorageFunc?.getItem(KEY_USER);
    return user ? JSON.parse(user) : undefined;
  }

  saveUserAgentToStorage(userAgent: string) {
    localStorageFunc?.setItem(KEY_USER_AGENT, userAgent);
  }

  getUserAgentLocalStorage() {
    const userAgent = localStorageFunc?.getItem(KEY_USER_AGENT);

    return userAgent ? JSON.parse(userAgent) : undefined;
  }

  saveEmailToStorage(email: string) {
    localStorageFunc?.setItem(KEY_EMAIL, email);
  }

  getEmailLocalStorage() {
    const email = localStorageFunc?.getItem(KEY_EMAIL);

    return email ? email : undefined;
  }

  clearEmailLocalStorage() {
    localStorageFunc?.removeItem(KEY_EMAIL);
  }

  clearUserInfo() {
    localStorageFunc?.removeItem(KEY_TOKEN);
    localStorageFunc?.removeItem(KEY_USER);
    localStorageFunc?.removeItem(KEY_EMAIL);
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.patch(url, data, config);
  }
}

const httpService = new HttpService();
export default httpService;
