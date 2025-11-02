import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: 'http://localhost:3636',
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

// Gắn token tự động nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
