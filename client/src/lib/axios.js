import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Let axios auto-detect Content-Type for FormData (multipart boundary)
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default axiosInstance;
