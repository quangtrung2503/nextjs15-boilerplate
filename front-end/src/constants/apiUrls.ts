export const BASE_URL = `${process.env.NEXT_PUBLIC_ROOT_URL}`;
export default {
    IMG_URL: `${BASE_URL}`,
    AUTH: {
        SIGN_IN: `${BASE_URL}/auth/sign-up-customer`,
        SIGN_UP: `${BASE_URL}auth/login`,
    },
    CITY_URL: `${BASE_URL}/city`,
    UPLOAD_URL: `${BASE_URL}/upload`
}