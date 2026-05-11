import { apiClient } from "./client";
import type { CreateOrderPayload } from "../types/api";

export async function submitOrder(orderPayload: CreateOrderPayload) {
  const { data, error } = await apiClient.POST("/orders/create", {
    body: orderPayload
  });

  if (error) {
    throw(error);
  }

  return data?.data;
}

export async function fetchOrder(orderId: number) {
  const { data, error } = await apiClient.GET("/orders/get/{id}", {
    params: {
      path: {
        id: orderId
      }
    }
  });

  if (error) {
    throw(error);
  }

  return data?.data;
}