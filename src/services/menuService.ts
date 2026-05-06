import { api } from "@/utils/api";
import type { MenuItem } from "@/types";
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

export const menuService = {
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]> | MenuItem[]>("/menu/all");
    return unwrap(response);
  },

  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]> | MenuItem[]>(
      `/menu/items-by-category/${encodeURIComponent(category)}`,
    );
    return unwrap(response);
  },

  getMenuItemById: async (id: number): Promise<MenuItem> => {
    const response = await api.get<ApiResponse<MenuItem> | MenuItem>(`/menu/item/${id}`);
    return unwrap(response);
  },
};
