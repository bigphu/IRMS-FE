import { useCallback, useEffect, useState } from "react";

import { orderService } from "@/services";
import type { Order } from "@/types";

export const useOrdersQuery = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
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