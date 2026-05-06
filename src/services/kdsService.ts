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
};
