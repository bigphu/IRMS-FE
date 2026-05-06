import { api } from "@/utils/api";
import type { MenuItem } from "@/types";
import type { AxiosResponse } from "axios";
import { mapBackendMenuItem, type BackendMenuItem } from "@/data/menuCatalog";

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

export const menuService = {
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<BackendMenuItem[]> | BackendMenuItem[]>("/menu/all");
    return unwrap(response).map(mapBackendMenuItem);
  },

  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<BackendMenuItem[]> | BackendMenuItem[]>(
      `/menu/items-by-category/${encodeURIComponent(category)}`,
    );
    return unwrap(response).map(mapBackendMenuItem);
  },

  getMenuItemById: async (id: number): Promise<MenuItem> => {
    const response = await api.get<ApiResponse<BackendMenuItem> | BackendMenuItem>(`/menu/item/${id}`);
    return mapBackendMenuItem(unwrap(response));
  },
};
