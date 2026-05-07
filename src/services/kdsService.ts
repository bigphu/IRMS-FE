import { api } from "@/utils/api";
import type { Order } from "@/types";
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

const buildPatchPath = (orderId: number, itemId: number, action: string) =>
  `/kds/orders/${orderId}/items/${itemId}/${action}`;

export const kdsService = {
  getQueue: async (sortBy = "ESTIMATED_PREP_TIME", direction = "ASC"): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]> | Order[]>(
      `/kds/queue?sortBy=${sortBy}&direction=${direction}`
    );
    return unwrap(response);
  },

  getAlerts: async (thresholdMinutes = 2): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]> | Order[]>(
      `/kds/alerts?thresholdMinutes=${thresholdMinutes}`
    );
    return unwrap(response);
  },

  startItem: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order> | Order>(
      `/kds/orders/${orderId}/items/${itemId}/start`
    );
    return unwrap(response);
  },

  markItemReady: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order> | Order>(
      `/kds/orders/${orderId}/items/${itemId}/ready`
    );
    return unwrap(response);
  },

  cancelItem: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order> | Order>(
      `/kds/orders/${orderId}/items/${itemId}/cancel`
    );
    return unwrap(response);
  },

  completeItem: async (orderId: number, itemId: number): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order> | Order>(
      `/kds/orders/${orderId}/items/${itemId}/complete`
    );
    return unwrap(response);
  },

  startItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.patch(buildPatchPath(orderId, itemId, "start"));
  },

  readyItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.patch(buildPatchPath(orderId, itemId, "ready"));
  },

  completeItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.patch(buildPatchPath(orderId, itemId, "complete"));
  },

  cancelItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.patch(buildPatchPath(orderId, itemId, "cancel"));
  },
};
