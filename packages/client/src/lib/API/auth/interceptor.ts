import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const api = axios.create();

const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return ''; // Prevent errors on SSR
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_URL is not set.');
    return '';
  }
  return apiUrl.startsWith('/') ? window.location.origin + apiUrl : apiUrl;
};

// ✅ Helper function to subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// ✅ Function to notify all subscribers
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = []; // Clear the queue
};

// ✅ Request interceptor (attaches token)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.baseURL = getApiBaseUrl();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (handles refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple refresh attempts at the same time
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('❌ No refresh token available');
        }

        const refreshUrl = `${getApiBaseUrl()}/auth/refresh-tokens`;
        console.log('🔄 Refreshing token at:', refreshUrl);

        const { data } = await axios.post(refreshUrl, { refreshToken });

        if (!data?.access?.token) {
          throw new Error('❌ Invalid refresh response');
        }

        console.log('✅ Token refreshed:', data.access.token);

        localStorage.setItem('authToken', data.access.token);
        localStorage.setItem('refreshToken', data.refresh.token);

        // Notify all queued requests to retry with the new token
        onTokenRefreshed(data.access.token);
        isRefreshing = false;

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed, logging out...', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;