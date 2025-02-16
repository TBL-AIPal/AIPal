import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.startsWith('/')
    ? window.location.origin + process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshUrl = `${API_BASE_URL}/auth/refresh-tokens`;
        console.log('Attempting to refresh token at:', refreshUrl);

        const { data } = await axios.post(refreshUrl, { refreshToken });

        if (!data?.access?.token) {
          throw new Error('Invalid response format from refresh token API');
        }

        console.log('Token refreshed successfully:', data.access.token);

        localStorage.setItem('authToken', data.access.token);
        localStorage.setItem('refreshToken', data.refresh.token);

        originalRequest.headers.Authorization = `Bearer ${data.access.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed, logging out...', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = 'auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;