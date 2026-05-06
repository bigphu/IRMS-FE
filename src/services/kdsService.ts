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
  getQueue: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]> | Order[]>("/kds/queue");
    return unwrap(response);
  },

  getAlerts: async (thresholdMinutes?: number): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]> | Order[]>("/kds/alerts", {
      params: thresholdMinutes ? { thresholdMinutes } : {},
    });
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
