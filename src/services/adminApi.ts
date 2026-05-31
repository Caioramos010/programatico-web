import axios from "axios";
import { useAdminAuthStore } from "../stores/adminAuthStore";

const apiBase = import.meta.env.VITE_API_URL;
const adminApi = axios.create({
  baseURL: apiBase && String(apiBase).trim() !== "" ? apiBase : "",
});

adminApi.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminAuthStore.getState().logout();
      const isAdminSubdomain = window.location.hostname.startsWith("admin.");
      window.location.href = isAdminSubdomain ? "/login" : "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default adminApi;
