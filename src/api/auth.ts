import { apiClient } from "./client";
import type { LoginPayload } from "../types/api";

export async function submitLogin(credentials: LoginPayload) {
  const { data, error } = await apiClient.POST("/auth/login", {
    body: credentials
  });

  if (error) {
    throw(error);
  }

  return data;
}

export async function submitLogout() {
  await apiClient.POST("/auth/logout");
}