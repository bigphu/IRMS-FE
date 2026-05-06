import { useState, useEffect } from "react";
import { kdsService } from "@/services";
import type { Order } from "@/types";

export const useKDSQuery = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const queue = await kdsService.getQueue();
        setOrders(queue);
      } catch (err) {
        console.error("Failed to fetch KDS orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  return { orders, isLoading };
};
