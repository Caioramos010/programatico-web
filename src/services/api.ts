import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
});

// Attach bearer token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 + 403 sem `mensagem` (Spring Security default = token rejeitado)
// → sessão quebrada, força logout e manda pro login. 403 com `mensagem`
// (vindo do GlobalExceptionHandler) preserva — significa "logado mas sem
// permissão pra essa ação".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const hasMensagem = data && typeof data === "object" && "mensagem" in data;
    const isAuthBreak = status === 401 || (status === 403 && !hasMensagem);
    if (isAuthBreak) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
