import { CommonFilters, ResponseCommon, ResponseList } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import { StatMonthly, StatsTotalBookingRevenue } from "./interfaces/stats";
import { Booking } from "../booking/interfaces/booking";
export interface FiltersGetStats extends CommonFilters {
  year?: number,
  dateApplied?: string | undefined;
}
export interface RequestGetStats extends CommonFilters {
  year?: number,
  dateApplied?: string | undefined
 }
 
export type ResponseGetStatTotalBookingRevenue = ResponseCommon<StatsTotalBookingRevenue>;
export type ResponseGetStatMonthly = ResponseCommon<StatMonthly>;
export type ResponseGetStatNewBookings = AxiosResponse<ResponseCommon<ResponseList<Booking[]>>>;

class StatService {
  getStatTotalBookingRevenue(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.STATS_URL}/total-bookings-revenue-by-month`,
      configs
    );
  }

  getStatMonthly(filters: RequestGetStats, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.STATS_URL}/get-monthly-stats?${queryString.stringify(filters)}`,
      configs
    );
  }

  getStatNewBookings(filters: RequestGetStats, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.STATS_URL}/get-new-bookings?${queryString.stringify(filters)}`,
      configs
    );
  }
}

export default new StatService();
