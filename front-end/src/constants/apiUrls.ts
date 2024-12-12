export const BASE_URL = `${process.env.NEXT_PUBLIC_ROOT_URL}`;

export default {
    IMG_URL: `${BASE_URL}`,
    AUTH: {
        SIGN_UP: `${BASE_URL}/auth/sign-up-customer`,
        SIGN_IN: `${BASE_URL}/auth/login`,
    }
}