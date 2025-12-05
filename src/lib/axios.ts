import axios from "axios";
import { API_BASE_URL } from "../config/api";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "authToken";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – يضيف Authorization لو فيه توكن
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – مثال بسيط للتعامل مع 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // هنا ممكن تعمل logout أو redirect للـ login
      // مثلا:
      // localStorage.removeItem(TOKEN_KEY);
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
