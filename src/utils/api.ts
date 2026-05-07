import axios from "axios";
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/",
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = globalThis.localStorage.getItem("irms_access_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, { token: token ? "✓ present" : "✗ missing" });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API] Error ${error.response?.status} from ${error.config?.url}:`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      globalThis.localStorage.removeItem("irms_access_token");
      globalThis.localStorage.removeItem("irms_user");
      if (globalThis.location.pathname !== "/login") {
        globalThis.history.pushState({}, "", "/login");
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
    return Promise.reject(error);
  },
);
