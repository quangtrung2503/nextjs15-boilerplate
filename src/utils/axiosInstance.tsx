// axiosInstance.js
import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 60000, // 60 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Add Authorization token if available
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Optional: Add custom headers
        config.headers['X-Custom-Header'] = 'CustomHeaderValue';

        console.log('Request:', config);
        return config;
    },
    (error) => {
        // Handle request error
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code within 2xx range
        console.log('Response:', response);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized error
        if (error.response && error.response.status === 401) {
            console.warn('401 Unauthorized:', error.response);

            // Optional: Refresh token logic
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Refresh token API call
                    const { data } = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                        { token: refreshToken }
                    );

                    // Save new token
                    localStorage.setItem('accessToken', data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    // Retry original request with new token
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh error:', refreshError);
                    localStorage.clear(); // Clear tokens if refresh fails
                    window.location.href = '/login';
                }
            } else {
                // Redirect to login if refresh token is not available
                window.location.href = '/login';
            }
        }

        // Handle other response errors
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;