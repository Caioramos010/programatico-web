import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const apiBase = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiBase && String(apiBase).trim() !== "" ? apiBase : "",
});

// Attach bearer token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (except auth endpoints — evita loop silencioso no login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthRoute = url.includes("/api/auth/");
    if (error.response?.status === 401 && !isAuthRoute) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    if (error.response?.status === 403 && !isAuthRoute) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
