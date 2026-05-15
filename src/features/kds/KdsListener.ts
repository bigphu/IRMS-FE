import { useSubscription } from "react-stomp-hooks";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { KdsQueueOrder } from "../../types/api";
import { useAppSelector } from "../../store/hooks";

export const KdsListener = () => {
  const queryClient = useQueryClient();
  const isChef = useAppSelector((state) => state.auth.role) === "CHEF";

  // ==========================================
  // 1. ADDITIONS (New Orders)
  // ==========================================
  useSubscription("/topic/kds/new-order", (message) => {
    const newOrder: KdsQueueOrder = JSON.parse(message.body);

    queryClient.setQueryData(
      ["kdsQueue", isChef],
      (oldQueue: KdsQueueOrder[] | undefined) => {
        if (!oldQueue) return [newOrder];
        if (oldQueue.some((o) => o.orderId === newOrder.orderId)) return oldQueue;
        return [...oldQueue, newOrder];
      },
    );

    toast.success(`New Order #${newOrder.orderId} received!`, { duration: 5000 });
  });

  // ==========================================
  // 2. MODIFICATIONS (Status Changes)
  // ==========================================
  const updateOrderInCache = (updatedOrder: KdsQueueOrder) => {
    queryClient.setQueryData(
      ["kdsQueue", isChef],
      (oldQueue: KdsQueueOrder[] | undefined) => {
        if (!oldQueue) return undefined;
        return oldQueue.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order,
        );
      },
    );
  };

  useSubscription("/topic/kds/order-cooking", (message) => {
    const order = JSON.parse(message.body);
    updateOrderInCache(order);
    toast.success(`Order #${order.orderId} is now cooking`, { duration: 3000 });
  });

  useSubscription("/topic/kds/order-ready", (message) => {
    const order = JSON.parse(message.body);
    updateOrderInCache(order);
    toast.success(`Order #${order.orderId} is ready!`, { duration: 4000 });
  });

  useSubscription("/topic/kds/order-updated", (message) => {
    const order = JSON.parse(message.body);
    updateOrderInCache(order);
    toast.success(`Order #${order.orderId} was updated`, { duration: 3000 });
  });

  // ==========================================
  // 3. REMOVALS / HISTORY
  // ==========================================
  useSubscription("/topic/kds/order-completed", (message) => {
    const completedOrder: KdsQueueOrder = JSON.parse(message.body);

    if (isChef) {
      // 1. Chef: Delete it from the screen
      queryClient.setQueryData(
        ["kdsQueue", isChef],
        (oldQueue: KdsQueueOrder[] | undefined) => {
          if (!oldQueue) return undefined;
          return oldQueue.filter(
            (order) => order.orderId !== completedOrder.orderId,
          );
        },
      );
      toast.success(`Order #${completedOrder.orderId} was completed`, { duration: 3000 });
    } else {
      // 2. Server: Leave it on screen to turn gray
      updateOrderInCache(completedOrder);
      toast.success(`Order #${completedOrder.orderId} delivered!`, { duration: 3000 });
    }
  });

  // ==========================================
  // 4. ALERTS & URGENCY
  // ==========================================
  const handleAlert = () => {
    queryClient.invalidateQueries({ queryKey: ["kdsAlerts"] });
  };

  useSubscription("/topic/kds/order-near-deadline", (message) => {
    const data = JSON.parse(message.body);
    handleAlert();

    toast.error(`Order #${data.orderId} has items running late!`, { duration: 6000 });
  });

  useSubscription("/topic/kds/order-overdue", (message) => {
    const data = JSON.parse(message.body);
    handleAlert();

    toast.error(`Order #${data.orderId} is OVERDUE!`, { duration: 8000 });
  });

  return null;
};