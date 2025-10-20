import axios from 'axios';

const LOCALHOST = window.APP_CONFIG?.API_BASE_URL;
const AI_LOCALHOST = window.APP_CONFIG?.AI_API_BASE_URL;

export const API_BASE_URL = LOCALHOST;
export const AI_API_BASE_URL = AI_LOCALHOST

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Đảm bảo header này luôn được gửi đi
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;