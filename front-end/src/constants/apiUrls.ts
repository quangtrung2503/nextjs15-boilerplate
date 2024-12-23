export const BASE_URL = `${process.env.NEXT_PUBLIC_ROOT_URL}`;
export const PUBLIC_URL = `${process.env.NEXT_PUBLIC_URL}`;
export default {
    IMG_URL: `${PUBLIC_URL}`,
    AUTH: {
      SIGN_UP: `${BASE_URL}/`,
      SIGN_IN: `${BASE_URL}/auth/login`,
      CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`
    },
    CITY_URL: `${BASE_URL}/city`,
    USER_URL: `${BASE_URL}/user`,
    THEME_URL: `${BASE_URL}/theme`,
    TOUR_URL: `${BASE_URL}/tour`,
    TOUR_CUS_URL: `${BASE_URL}/tour-customer`,
    POST_URL: `${BASE_URL}/post`,
    UPLOAD_URL: `${BASE_URL}/upload`,
    DESTINATION_URL: `${BASE_URL}/destination`,
    PROFILE_URL: `${BASE_URL}/user/profile`
}