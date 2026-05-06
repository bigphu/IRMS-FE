import { api } from "@/utils/api";
import type { User } from "@/types";
import type { AxiosResponse } from "axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const unwrap = <T>(response: AxiosResponse<ApiResponse<T> | T>) => {
  const data = response.data;
  if (data && typeof data === "object" && "data" in data) {
    return (data as ApiResponse<T>).data;
  }
  return data as T;
};

export interface LoginCredentials {
  email: string;
  password?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<ApiResponse<User> | User>("/auth/login", credentials);
    return unwrap(response);
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  verify: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User> | User>("/auth/me");
      return unwrap(response);
    } catch {
      const response = await api.get<ApiResponse<User> | User>("/auth/verify");
      return unwrap(response);
    }
  },
};
