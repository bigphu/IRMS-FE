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

export const kdsService = {
  getQueue: async (sortBy = "ORDER_TIME", direction = "DESC"): Promise<Order[]> => {
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

  markOrderCooking: async (orderId: number): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order> | Order>(
      `/kds/orders/${orderId}/cooking`
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
};
