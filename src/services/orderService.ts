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

export const orderService = {
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<ApiResponse<Order> | Order>(`/orders/get/${id}`);
    return unwrap(response);
  },

  createOrder: async (payload: Partial<Order>): Promise<Order> => {
    const response = await api.post<ApiResponse<Order> | Order>("/orders/create", payload);
    return unwrap(response);
  },

  updateOrder: async (id: number, payload: Partial<Order>): Promise<Order> => {
    const response = await api.post<ApiResponse<Order> | Order>(`/orders/update/${id}`, payload);
    return unwrap(response);
  },

  cancelOrder: async (id: number): Promise<void> => {
    await api.post(`/orders/cancel/${id}`);
  },
};
