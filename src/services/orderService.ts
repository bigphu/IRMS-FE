import { api } from "@/utils/api";
import type { Order, OrderItem } from "@/types";
import type { AxiosResponse } from "axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface CreateOrderRequest {
  tableNumber: number;
  items: Array<{
    menuItemId: number;
    quantity: number;
    selectedOptionIds?: number[];
    specialInstructions?: string;
  }>;
}

interface UpdateOrderRequest {
  tableNumber?: number;
  items?: Array<{
    menuItemId: number;
    quantity: number;
    selectedOptionIds?: number[];
    specialInstructions?: string;
  }>;
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

  createOrder: async (tableNumber: number, items: OrderItem[]): Promise<Order> => {
    const payload: CreateOrderRequest = {
      tableNumber,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        selectedOptionIds: item.selectedOptionIds,
        specialInstructions: item.specialInstructions,
      })),
    };
    const response = await api.post<ApiResponse<Order> | Order>("/orders/create", payload);
    return unwrap(response);
  },

  updateOrder: async (id: number, tableNumber?: number, items?: OrderItem[]): Promise<Order> => {
    const payload: UpdateOrderRequest = {};
    if (tableNumber !== undefined) payload.tableNumber = tableNumber;
    if (items) {
      payload.items = items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        selectedOptionIds: item.selectedOptionIds,
        specialInstructions: item.specialInstructions,
      }));
    }
    const response = await api.post<ApiResponse<Order> | Order>(`/orders/update/${id}`, payload);
    return unwrap(response);
  },

  cancelOrder: async (id: number): Promise<void> => {
    await api.post(`/orders/cancel/${id}`);
  },
};
