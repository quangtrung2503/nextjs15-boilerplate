export const BASE_URL = `${process.env.NEXT_PUBLIC_ROOT_URL}`;
export const PUBLIC_URL = `${process.env.NEXT_PUBLIC_URL}`;

export default {
  IMG_URL: `${PUBLIC_URL}`,
  AUTH: {
    SIGN_UP: `${BASE_URL}/auth/sign-up-customer`,
    SIGN_IN: `${BASE_URL}/auth/login`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  },
  VIDEO_URL: `${BASE_URL}/video`,
  VIDEO_CUS_URL: `${BASE_URL}/video-customer`,
  CITY_URL: `${BASE_URL}/city`,
  CITY_CUS_URL: `${BASE_URL}/city-customer`,
  USER_URL: `${BASE_URL}/user`,
  THEME_URL: `${BASE_URL}/theme`,
  THEME_CUS_URL: `${BASE_URL}/theme-customer`,
  TOUR_URL: `${BASE_URL}/tour`,
  TOUR_CUS_URL: `${BASE_URL}/tour-customer`,
  POST_URL: `${BASE_URL}/post`,
  POST_CUS_URL: `${BASE_URL}/post-customer`,
  UPLOAD_URL: `${BASE_URL}/upload`,
  DESTINATION_URL: `${BASE_URL}/destination`,
  DESTINATION_CUS_URL: `${BASE_URL}/destination-customer`,
  PROFILE_URL: `${BASE_URL}/user/profile`,
  TAG_URL: `${BASE_URL}/tag`,
  BOOKING_URL: `${BASE_URL}/booking`,
  TRANSACTION_URL: `${BASE_URL}/transaction`,
  STATS_URL: `${BASE_URL}/stats`,
  BOOKING_TOUR_URL: `${BASE_URL}/booking-customer`,
  PENDING_PAYMENT_URL: `${BASE_URL}/booking-customer/get-payment-url`,
  VNPAY_RETURN_URL: `${BASE_URL}/booking-customer/payment-return/vnpay-return`
};
