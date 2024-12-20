export const BASE_URL = `${process.env.NEXT_PUBLIC_ROOT_URL}`;
export const PUBLIC_URL = `${process.env.NEXT_PUBLIC_URL}`;
export default {
    IMG_URL: `${PUBLIC_URL}`,
    AUTH: {
      SIGN_UP: `${BASE_URL}/auth/sign-up-customer`,
      SIGN_IN: `${BASE_URL}/auth/login`,
    },
    CITY_URL: `${BASE_URL}/city`,
    USER_URL: `${BASE_URL}/user`,
    THEME_URL: `${BASE_URL}/theme`,
    TOUR_URL: `${BASE_URL}/tour`,
    POST_URL: `${BASE_URL}/post`,
    UPLOAD_URL: `${BASE_URL}/upload`,
    DESTINATION_URL: `${BASE_URL}/destination`,

}