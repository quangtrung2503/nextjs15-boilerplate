import {
  CommonFilters,
  ResponseCommon,
  ResponseList,
} from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import apiUrls from "@/constants/apiUrls";
import queryString from "query-string";
import {
  ApiResponse,
  CustomerReview,
  HistoryBookingTour,
  IRefundData,
  ReviewData,
  Stats,
  ThemeTour,
  Tour,
  TourImage,
} from "./interfaces/tour";
import { BookTour } from "@/app/[locale]/citytour/[cityTourId]/forms";

export interface FiltersGetTours extends CommonFilters {
  themeIds?: string[] | number[] | symbol;
  destinationIds?: string[] | number[] | symbol;
  durations?: string[] | number[] | symbol;
}
export interface RequestGetTours extends CommonFilters {
  themeIds?: string[] | number[] | symbol;
  destinationIds?: string[] | number[] | symbol;
  durations?: string[] | number[] | symbol;
}

export interface FiltersGetReviewCustomer extends CommonFilters {
  ratings?: number;
}
export interface RequestGetReviewCustomer extends CommonFilters {
  ratings?: number[];
}

export interface ExtraData<T> extends ResponseList<T> {
  stats: Stats;
}
export interface ExtraReview<T> {
  data: ExtraData<T>;
}

export type ResponseTourCustomerList = AxiosResponse<
  ResponseCommon<ResponseList<Tour[]>>
>;
export type ResponseTourGalleryList = AxiosResponse<
  ResponseCommon<ResponseList<TourImage[]>>
>;
export type ResponseTourDestinationList = AxiosResponse<
  ResponseCommon<ResponseList<Tour[]>>
>;
export type ResponseReviewCustomer = AxiosResponse<
  ExtraReview<CustomerReview[]>
>;
export type ResponseBookingHistory = AxiosResponse<
  ResponseCommon<ResponseList<HistoryBookingTour[]>>
>;

export type ResponseBookingDetail = ResponseCommon<HistoryBookingTour>;
export type ResponseTourCustomer = ResponseCommon<ApiResponse>;
export type ResponseTourCustomerReview = ResponseCommon<ReviewData>;
export type ResponseTourBestTrending = ResponseCommon<Tour>;

export interface FiltersGetGallery extends CommonFilters {}
export interface RequestGetGallery extends CommonFilters {}

export interface FiltersGetTourDestination extends CommonFilters {}
export interface RequestGetTourDestination extends CommonFilters {}

export interface FiltersGetTourBestTrending extends CommonFilters {}
export interface RequestGetTourBestTrending extends CommonFilters {}

export type ResponseOutsideTourList = AxiosResponse<
  ResponseCommon<ThemeTour[]>
>;

class TourService {
  getTours(filters: RequestGetTours, configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}?${queryString.stringify(filters)}`,
      configs,
    );
  }
  getTour(slug: string, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.TOUR_CUS_URL}/${slug}`, configs);
  }
  getTourCustomerReview(
    filters: RequestGetReviewCustomer,
    slug: string,
    configs?: AxiosRequestConfig,
  ) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/get-review/${slug}?${queryString.stringify(filters)}`,
      configs,
    );
  }
  getTourDestination(configs?: AxiosRequestConfig) {
    const queryStringIsFeature = "isFeatureDestination=true";
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}?${queryStringIsFeature}`,
      configs,
    );
  }
  getTourBestTrending(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/trending/get-best-trending`,
      configs,
    );
  }
  bookTourCustomer(tour: BookTour, configs?: AxiosRequestConfig) {
    return httpService.post(`${apiUrls.BOOKING_TOUR_URL}`, tour);
  }
  
  reloadPayByVnpay(url: string, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.VNPAY_RETURN_URL}${url}`);
  }
  pendingBookingService(idTourBooking: number, configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.PENDING_PAYMENT_URL}/${idTourBooking}`)
  }
  getBookingHistory(configs?: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.BOOKING_TOUR_URL}`);
  }
  getOutsideTour(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/outside/three-themes-tours`,
      configs,
    );
  }
  getGalleryCustomer(configs?: AxiosRequestConfig) {
    return httpService.get(
      `${apiUrls.TOUR_CUS_URL}/gallery/get-images`,
      configs,
    );
  }
  getDetaiBookingHistory(idTourBooking: number, configs: AxiosRequestConfig) {
    return httpService.get(`${apiUrls.BOOKING_TOUR_URL}/${idTourBooking}`)
  }
  requestRefundOrder(idBooking: number, refundRequest: IRefundData) {
    return httpService.post(`${apiUrls.REQUEST_REFUND_CUSTOMER}/${idBooking}`, refundRequest)
  }
}

export default new TourService();
