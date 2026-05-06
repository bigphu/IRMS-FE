import { api } from "@/utils/api";
import type { User } from "@/types";
import type { AxiosResponse } from "axios";

const ACCESS_TOKEN_KEY = "irms_access_token";
const USER_KEY = "irms_user";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const unwrap = <T>(response: AxiosResponse<ApiResponse<T> | T>) => {
  const data = response.data;
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }
  return data as T;
};

interface LoginApiResponse {
  accessToken?: string;
  userId?: string;
  email: string;
  role: string;
}

const normalizeRole = (role: string): User["role"] => {
  return role.replace(/^ROLE_/, "") as User["role"];
};

const mapLoginResponseToUser = (data: LoginApiResponse): User => ({
  id: data.userId ?? data.email,
  email: data.email,
  name: data.email,
  role: normalizeRole(data.role),
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<ApiResponse<LoginApiResponse> | LoginApiResponse>("/auth/login", credentials);
    const payload = unwrap(response);
    const user = mapLoginResponseToUser(payload);

    if (payload.accessToken) {
      globalThis.localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
    }
    globalThis.localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } finally {
      globalThis.localStorage.removeItem(ACCESS_TOKEN_KEY);
      globalThis.localStorage.removeItem(USER_KEY);
    }
  },

  verify: async (): Promise<User> => {
    const rawUser = globalThis.localStorage.getItem(USER_KEY);
    if (!rawUser) throw new Error("No active session");

    try {
      const parsed = JSON.parse(rawUser) as User;
      return parsed;
    } catch {
      globalThis.localStorage.removeItem(USER_KEY);
      throw new Error("Invalid session data");
    }
  },
};
