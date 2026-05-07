import { useEffect, useRef, useState } from "react";

import { createKitchenRealtimeClient, type KitchenRealtimeHandlers } from "@/services/realtimeService";

const TOKEN_KEY = "irms_access_token";

export const useKitchenRealtime = (handlers: KitchenRealtimeHandlers) => {
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const token = globalThis.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    const client = createKitchenRealtimeClient(token, {
      onConnected: () => setIsConnected(true),
      onNewOrder: (order) => handlersRef.current.onNewOrder?.(order),
      onOrderCooking: (order) => handlersRef.current.onOrderCooking?.(order),
      onOrderUpdated: (order) => handlersRef.current.onOrderUpdated?.(order),
      onOrderReady: (order) => handlersRef.current.onOrderReady?.(order),
      onOrderCompleted: (order) => handlersRef.current.onOrderCompleted?.(order),
      onOrderNearDeadline: (order) => handlersRef.current.onOrderNearDeadline?.(order),
      onOrderOverdue: (order) => handlersRef.current.onOrderOverdue?.(order),
      onOrderCanceled: (order) => handlersRef.current.onOrderCanceled?.(order),
    });

    client.onWebSocketClose = () => setIsConnected(false);
    client.onStompError = () => setIsConnected(false);
    client.activate();

    return () => {
      setIsConnected(false);
      client.deactivate();
    };
  }, []);

  return { isConnected };
};