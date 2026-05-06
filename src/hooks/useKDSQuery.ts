import { useState, useEffect, useCallback } from "react";
import { kdsService } from "@/services";
import type { Order } from "@/types";

export const useKDSQuery = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const queue = await kdsService.getQueue();
      setOrders(queue);
    } catch (err) {
      console.error("Failed to fetch KDS orders:", err);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      await fetchOrders();
      setIsLoading(false);
    };

    load();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, isLoading, refresh: fetchOrders };
};
