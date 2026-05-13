import { apiClient } from "./client";

export async function getWsTicket() {
  const { data, error } = await apiClient.GET("/kds/ws-ticket");

  if (error) {
    throw(error);
  }

  return data?.data || ""; 
}

export async function getKdsQueue(isHistory: boolean = false) {
  const { data, error } = await apiClient.GET("/kds/queue", {
    params: {
      query: {
        sortBy: "ORDER_TIME",
        direction: "ASC",
        history: isHistory,
      }
    }
  });

  if (error) {
    throw(error);
  }

  return data?.data || [];
}

export async function getKdsAlerts() {
  const { data, error } = await apiClient.GET("/kds/alerts");

  if (error) {
    throw(error);
  }

  return data?.data || [];
}

export async function markOrderCooking(orderId: number) {
  await apiClient.PATCH("/kds/orders/{orderId}/mark-cooking", {
    params: { path: { orderId } }
  });
}

export async function startCookingItem(orderId: number, itemId: number) {
  await apiClient.PATCH("/kds/orders/{orderId}/items/{itemId}/start", {
    params: { path: { orderId, itemId } }
  });
}

export async function markItemReady(orderId: number, itemId: number) {
  await apiClient.PATCH("/kds/orders/{orderId}/items/{itemId}/ready", {
    params: { path: { orderId, itemId } }
  });
}

export async function completeItem(orderId: number, itemId: number) {
  await apiClient.PATCH("/kds/orders/{orderId}/items/{itemId}/complete", {
    params: { path: { orderId, itemId } }
  });
}