import { useMemo, useState } from "react";
import { Bell, BellRing, CheckCircle2, Circle, Flame, List, PlusCircle, XCircle } from "lucide-react";

import Navbar, { type NavItem } from "@/components/layout/Navbar";
import { Button, ScrollArea } from "@/components";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useKitchenRealtime } from "@/hooks/useKitchenRealtime";
import { useOrdersQuery } from "@/hooks/useOrdersQuery";
import { usePersistentNotifications } from "@/hooks/usePersistentNotifications";
import type { Order } from "@/types";
import { OrderCard } from "./components/OrderCard";
import { formatDate, formatDuration } from "@/utils/formatters";
import { orderService } from "@/services";

type OrderFilter = "ALL" | "PENDING" | "COOKING" | "READY" | "COMPLETED" | "CANCELED";

const ORDER_FILTERS: NavItem[] = [
  { id: "ALL", label: "All", icon: <List size={28} /> },
  { id: "PENDING", label: "Pending", icon: <Circle size={28} /> },
  { id: "COOKING", label: "Cooking", icon: <Flame size={28} /> },
  { id: "READY", label: "Ready", icon: <CheckCircle2 size={28} /> },
  { id: "COMPLETED", label: "Done", icon: <PlusCircle size={28} /> },
  { id: "CANCELED", label: "Canceled", icon: <XCircle size={28} /> },
];

const getNotificationTone = (kind: string) => {
  // unify all notification tones to green
  return "border-success bg-success/10 text-success";
};

export const OrdersPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editableItems, setEditableItems] = useState<Order["items"]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const { notifications, pushNotification } = usePersistentNotifications("irms_orders_notifications");

  const { orders, isLoading, error, refetch } = useOrdersQuery();

  useKitchenRealtime({
    onNewOrder: (order) => {
      pushNotification(`New order #${order.orderId}`, `Table ${order.tableNumber} just placed an order.`, "new-order");
      refetch();
    },
    onOrderCooking: (order) => {
      pushNotification(`Order #${order.orderId} is cooking`, `Table ${order.tableNumber}'s order is now cooking.`, "cooking");
      refetch();
    },
    onOrderUpdated: (order) => {
      // suppress per-item updated alerts; refresh orders list only
      refetch();
    },
    onOrderReady: (order) => {
      pushNotification(`Order #${order.orderId} ready`, `Table ${order.tableNumber} is ready to serve.`, "completed");
      refetch();
    },
    onOrderCompleted: (order) => {
      pushNotification(`Order #${order.orderId} completed`, `Table ${order.tableNumber} is now done.`, "completed");
      refetch();
    },
    onOrderNearDeadline: (order) => {
      pushNotification(`Order #${order.orderId} near deadline`, `Table ${order.tableNumber} needs attention.`, "warning");
      refetch();
    },
    onOrderOverdue: (order) => {
      pushNotification(`Order #${order.orderId} overdue`, `Table ${order.tableNumber} is past the target time.`, "overdue");
      refetch();
    },
    onOrderCanceled: (order) => {
      pushNotification(`Order #${order.orderId} canceled`, `Table ${order.tableNumber} was canceled.`, "warning");
      refetch();
    },
  });

    const filteredOrders = useMemo(() => {
    let result = orders;

    if (selectedFilter !== "ALL") {
      result = result.filter((order) => order.status === selectedFilter);
    }

    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, selectedFilter]);

  const pendingCount = orders.filter((order) => order.status === "PENDING").length;
  const cookingCount = orders.filter((order) => order.status === "COOKING").length;
  const completedCount = orders.filter((order) => order.status === "COMPLETED").length;
  const canceledCount = orders.filter((order) => order.status === "CANCELED").length;

  const getOrderCompletedAt = (order: Order) => order.completedAt || order.updatedAt || null;
  const isFinalizedOrder = (order: Order) => order.status === "COMPLETED" || order.status === "CANCELED";
  const getOrderStatusLabel = (order: Order) => {
    if (order.status === "COMPLETED") {
      return "COMPLETED";
    }

    return order.status;
  };
  const getTimingLabel = (order: Order) => {
    const completedAt = getOrderCompletedAt(order);

    if (isFinalizedOrder(order) && completedAt) {
      return `${order.status === "CANCELED" ? "Canceled" : "Completed"}: ${formatDate(completedAt)}`;
    }

    return `Updated: ${order.updatedAt ? formatDate(order.updatedAt) : "In progress"}`;
  };

  const getDurationLabel = (order: Order) => {
    const completedAt = getOrderCompletedAt(order);

    if (isFinalizedOrder(order) && completedAt) {
      return `Duration: ${formatDuration(order.createdAt, completedAt)}`;
    }

    return "Duration: In progress";
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrder) return;
    setIsCompleting(true);
    try {
      await orderService.completeOrder(selectedOrder.orderId);
      await refetch();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to complete order:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const openEditOrder = () => {
    if (selectedOrder?.status !== "PENDING") return;
    setEditableItems(selectedOrder.items.map((item) => ({ ...item })));
    setEditingOrder(selectedOrder);
  };

  const closeEditOrder = () => {
    setEditingOrder(null);
    setEditableItems([]);
  };

  const updateItemQuantity = (orderItemId: number, delta: number) => {
    setEditableItems((current) =>
      current
        .map((item) =>
          item.orderItemId === orderItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeEditableItem = (orderItemId: number) => {
    setEditableItems((current) => current.filter((item) => item.orderItemId !== orderItemId));
  };

  const handleSaveOrderEdit = async () => {
    if (!editingOrder) return;

    setIsSavingEdit(true);
    try {
      await orderService.updateOrder(editingOrder.orderId, editingOrder.tableNumber, editableItems);
      await refetch();
      closeEditOrder();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder?.status !== "PENDING") return;

    setIsCanceling(true);
    try {
      await orderService.cancelOrder(selectedOrder.orderId);
      await refetch();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  let mainContent: JSX.Element;
  if (isLoading) {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl">Loading orders...</div>
    );
  } else if (error) {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl">
        <div className="text-red-500 mb-4">Error loading orders:</div>
        <div className="text-sm text-dark/50">{error}</div>
      </div>
    );
  } else if (filteredOrders.length > 0) {
    mainContent = (
      <>
        {filteredOrders.map((order: Order) => (
          <OrderCard key={order.orderId} order={order} onClick={setSelectedOrder} />
        ))}
      </>
    );
  } else {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl border-4 border-dashed border-gray-200 rounded-3xl">
        No orders match this filter.
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] flex h-screen w-screen overflow-hidden">
      <Navbar
        items={ORDER_FILTERS}
        selectedValue={selectedFilter}
        onValueChange={(value) => setSelectedFilter(value as OrderFilter)}
      />

      <div className="flex flex-col flex-1 ml-24 p-8 h-full overflow-hidden">
        <div className="flex items-end justify-between mb-8 shrink-0">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-dark font-bold text-sm">Pending:</span>
              <div className="border-2 border-primary text-primary font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">{pendingCount}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-dark font-bold text-sm">Cooking:</span>
              <div className="border-2 border-[#f97316] text-[#f97316] font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">{cookingCount}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-dark font-bold text-sm">Done:</span>
              <div className="border-2 border-success text-success font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">{completedCount}</div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-dark font-bold text-sm">Canceled:</span>
              <div className="border-2 border-warning-500 text-warning-500 font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">{canceledCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-dark/70 font-semibold">
              <Bell size={18} />
              <span>{notifications.length} live</span>
            </div>
            <Button variant="full-secondary" onClick={() => navigate("/menu")} className="rounded-tr-4xl rounded-bl-4xl px-4 py-2">
              MENU
            </Button>
            <Button variant="outline-danger" onClick={handleLogout} className="rounded-tr-4xl rounded-bl-4xl px-4 py-2">
              LOG OUT
            </Button>
          </div>
        </div>

        <div className="fixed top-4 right-4 z-50 w-[24rem] max-w-[calc(100vw-2rem)] space-y-3 pointer-events-none">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`pointer-events-auto rounded-3xl border-2 px-4 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${getNotificationTone(notification.kind)}`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white/20 p-2 shrink-0">
                  <BellRing size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.25em] opacity-80">Live alert</div>
                  <div className="font-black text-lg leading-tight mt-1">{notification.title}</div>
                  <p className="text-sm mt-2 opacity-90 leading-relaxed">{notification.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea direction="horizontal" className="h-full w-full pb-4">
            <div className="flex gap-8 h-full pl-2 pr-4 pt-2">
              {mainContent}
            </div>
          </ScrollArea>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close order details"
            className="absolute inset-0 bg-dark/80"
            onClick={() => setSelectedOrder(null)}
          />
          <dialog open className="relative z-10 bg-surface rounded-tr-card rounded-bl-card w-full max-w-4xl shadow-2xl p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-dark text-3xl font-black">Order #{selectedOrder.orderId}</h2>
                {/* Mockup Table Number */}
                <p className="text-dark/70 font-semibold">Table {selectedOrder.tableNumber}</p>
              </div>
              <Button variant="outline-danger" onClick={() => setSelectedOrder(null)}>
                CLOSE
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-dark/10 bg-white p-5">
                <p className="text-sm font-bold text-dark/60 mb-2">Status</p>
                <p className="text-2xl font-black text-primary">{getOrderStatusLabel(selectedOrder)}</p>
                <p className="mt-4 text-sm font-bold text-dark/60 mb-2">Total</p>
                <p className="text-2xl font-black text-highlight">{selectedOrder.totalPrice}</p>
              </div>

              <div className="rounded-2xl border-2 border-dark/10 bg-white p-5">
                <p className="text-sm font-bold text-dark/60 mb-2">Timing</p>
                <p className="text-lg font-semibold text-dark">Created: {formatDate(selectedOrder.createdAt)}</p>
                <p className="text-lg font-semibold text-dark">{getTimingLabel(selectedOrder)}</p>
                <p className="text-lg font-semibold text-dark">{getDurationLabel(selectedOrder)}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-dark font-black text-lg mb-3">Items</p>
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.orderItemId} className="rounded-2xl border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-dark text-lg">{item.name || item.menuItem?.name || "Item"}</p>
                        <p className="text-dark/60 text-sm">Qty: {item.quantity}</p>
                        {item.specialInstructions && <p className="text-dark/70 text-sm mt-2">{item.specialInstructions}</p>}
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-primary text-light">
                        {item.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.status === "PENDING" && (
              <div className="mt-6 flex gap-3">
                <Button variant="full-primary" onClick={openEditOrder} className="flex-1 rounded-tr-4xl rounded-bl-4xl px-6 py-4">
                  EDIT ORDER
                </Button>
                <Button variant="outline-danger" onClick={handleCancelOrder} disabled={isCanceling} className="flex-1 rounded-tr-4xl rounded-bl-4xl px-6 py-4">
                  {isCanceling ? "CANCELING..." : "CANCEL ORDER"}
                </Button>
              </div>
            )}

            {selectedOrder.status === "READY" && (
              <div className="mt-6">
                <Button 
                  variant="full-primary" 
                  onClick={handleCompleteOrder}
                  disabled={isCompleting}
                  className="w-full rounded-tr-4xl rounded-bl-4xl px-6 py-4"
                >
                  {isCompleting ? "COMPLETING..." : "COMPLETE ORDER"}
                </Button>
              </div>
            )}
          </dialog>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close edit order"
            className="absolute inset-0 bg-dark/80"
            onClick={closeEditOrder}
          />
          <dialog open className="relative z-10 bg-surface rounded-tr-card rounded-bl-card w-full max-w-4xl shadow-2xl p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-dark text-3xl font-black">Edit Order #{editingOrder.orderId}</h2>
                <p className="text-dark/70 font-semibold">Table {editingOrder.tableNumber}</p>
              </div>
              <Button variant="outline-danger" onClick={closeEditOrder}>CLOSE</Button>
            </div>

            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
              {editableItems.map((item) => (
                <div key={item.orderItemId} className="rounded-2xl border-2 border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-dark text-lg">{item.name || item.menuItem?.name || "Item"}</p>
                    <p className="text-dark/60 text-sm">{formatDate(editingOrder.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => updateItemQuantity(item.orderItemId, -1)}>-</Button>
                    <span className="w-10 text-center font-black text-dark">{item.quantity}</span>
                    <Button variant="outline" onClick={() => updateItemQuantity(item.orderItemId, 1)}>+</Button>
                    <Button variant="outline-danger" onClick={() => removeEditableItem(item.orderItemId)}>REMOVE</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-dark/70 font-semibold">
                Pending orders only. Save updates to keep the kitchen queue in sync.
              </div>
              <Button variant="full-primary" onClick={handleSaveOrderEdit} disabled={isSavingEdit} className="rounded-tr-4xl rounded-bl-4xl px-6 py-4">
                {isSavingEdit ? "SAVING..." : "SAVE CHANGES"}
              </Button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;