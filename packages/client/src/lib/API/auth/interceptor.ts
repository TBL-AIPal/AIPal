import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/v1', // Use env variables
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') { // Ensure we're in the browser
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
      originalRequest._retry = true; // Prevent endless retries

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-tokens`, {
          refreshToken,
        });

        // Save new tokens
        localStorage.setItem('authToken', data.access.token);
        localStorage.setItem('refreshToken', data.refresh.token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed, logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect user to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
