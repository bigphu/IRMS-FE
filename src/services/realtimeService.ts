import { Client, type IMessage } from "@stomp/stompjs";

import type { Order } from "@/types";

export interface KitchenRealtimeHandlers {
  onConnected?: () => void;
  onNewOrder?: (order: Order) => void;
  onOrderReady?: (order: Order) => void;
  onOrderCooking?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
  onOrderCompleted?: (order: Order) => void;
  onOrderNearDeadline?: (order: Order) => void;
  onOrderOverdue?: (order: Order) => void;
  onOrderCanceled?: (order: Order) => void;
}

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/";
  const baseUrl = apiUrl.replace(/\/$/, "");
  const socketBase = baseUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  return `${socketBase}/ws-native`;
};

const parseOrder = (message: IMessage): Order => JSON.parse(message.body) as Order;

export const createKitchenRealtimeClient = (token: string, handlers: KitchenRealtimeHandlers) => {
  const client = new Client({
    webSocketFactory: () => new WebSocket(getSocketUrl()),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    debug: () => undefined,
  });

  client.onConnect = () => {
    client.subscribe("/topic/kds/new-order", (message) => handlers.onNewOrder?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-ready", (message) => handlers.onOrderReady?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-cooking", (message) => handlers.onOrderCooking?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-updated", (message) => handlers.onOrderUpdated?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-completed", (message) => handlers.onOrderCompleted?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-near-deadline", (message) => handlers.onOrderNearDeadline?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-overdue", (message) => handlers.onOrderOverdue?.(parseOrder(message)));
    client.subscribe("/topic/kds/order-canceled", (message) => handlers.onOrderCanceled?.(parseOrder(message)));
    handlers.onConnected?.();
  };

  return client;
};