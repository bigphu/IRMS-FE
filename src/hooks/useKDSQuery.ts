import { useState, useEffect, useCallback } from "react";
import { kdsService } from "@/services";
import type { Order } from "@/types";

export const useKDSQuery = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const queue = await kdsService.getQueue();
      console.log("KDS Queue fetched:", queue);
      setOrders(queue || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch KDS orders:", errorMsg);
      setError(errorMsg);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
};
