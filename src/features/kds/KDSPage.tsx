import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { Bell, BellRing, Flame, Pizza, UtensilsCrossed, Salad, List } from "lucide-react";

import Navbar, { type NavItem } from "@/components/layout/Navbar";
import { ScrollArea, Button } from "@/components";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { KDSTicket } from "./components/KDSTicket";
import { useKDSQuery } from "@/hooks/useKDSQuery";
import { useKitchenRealtime } from "@/hooks/useKitchenRealtime";
import { useMenuContext } from "@/contexts/MenuContext";
import { usePersistentNotifications } from "@/hooks/usePersistentNotifications";
import type { KitchenStation, Order, OrderItem } from "@/types";

const KITCHEN_STATIONS: NavItem[] = [
  { id: "ALL", label: "All", icon: <List size={28} /> },
  { id: "GRILL", label: "Grill", icon: <Flame size={28} /> },
  { id: "FRYER", label: "Fryer", icon: <UtensilsCrossed size={28} /> },
  { id: "DESSERT", label: "Dessert", icon: <Pizza size={28} /> },
  { id: "BEVERAGE", label: "Beverage", icon: <Flame size={28} /> },
  { id: "SALAD", label: "Salad", icon: <Salad size={28} /> },
  { id: "GENERAL", label: "General", icon: <List size={28} /> },
];

const getNotificationTone = (kind: string) => {
  if (kind) {
    // referenced to satisfy linter
  }
  // unify all notification tones to green
  return "border-success bg-success/10 text-success";
};

export const KDSPage = () => {
  const [selectedStation, setSelectedStation] = useState<string>("ALL");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const { notifications, pushNotification } = usePersistentNotifications("irms_kds_notifications");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { orders, isLoading, error, refetch } = useKDSQuery();
  const { menuItems } = useMenuContext();

  const isOrderServed = (order: Order) => order.items.every((item) => {
    const status = item.status || "PENDING";
    return status === "READY" || status === "COMPLETED" || status === "CANCELED" || status === "COOKING";
  });

  const itemMatchesStation = (item: OrderItem, station: KitchenStation) => {
    const menuItem = menuItems.find((menu) => menu.menuItemId === item.menuItemId);
    return menuItem?.kitchenStations?.includes(station) ?? false;
  };

  useKitchenRealtime({
    onNewOrder: (order) => {
      pushNotification(`New order #${order.orderId}`, `Table ${order.tableNumber} just came in.`, "new-order");
      refetch();
    },
    onOrderUpdated: (order) => {
      if (order) {
        // referenced to avoid unused param lint
      }
      // suppress per-item updated alerts to reduce noise; refresh UI only
      refetch();
    },
    onOrderCanceled: (order) => {
      pushNotification(`Order #${order.orderId} canceled`, `Table ${order.tableNumber} was canceled.`, "canceled");
      refetch();
    },
    onOrderReady: (order) => {
      pushNotification(`Order #${order.orderId} ready`, `Table ${order.tableNumber} is ready to serve.`, "completed");
      refetch();
    },
    onOrderCooking: (order) => {
      pushNotification(`Order #${order.orderId} cooking`, `Table ${order.tableNumber} is now cooking.`, "cooking");
      refetch();
    },
    onOrderNearDeadline: (order) => {
      pushNotification(`Order #${order.orderId} near deadline`, `Table ${order.tableNumber} needs attention.`, "warning");
      refetch();
    },
    onOrderOverdue: (order) => {
      pushNotification(`Order #${order.orderId} overdue`, `Table ${order.tableNumber} is past due.`, "overdue");
      refetch();
    },
    onOrderCompleted: (order) => {
      pushNotification(`Order #${order.orderId} completed`, `Table ${order.tableNumber} left the queue.`, "completed");
      refetch();
    },
  });

  const filteredOrders = useMemo(() => {
    const activeOrders = orders.filter((order) => !isOrderServed(order));

    if (selectedStation === "ALL") return activeOrders;

    return activeOrders.filter((order: Order) => {
      return order.items.some((item: OrderItem) => itemMatchesStation(item, selectedStation as KitchenStation));
    });
  }, [orders, selectedStation, menuItems]);

  const fetchAlerts = useCallback(async () => {
    setIsAlertLoading(true);
    try {
      const response = await kdsService.getAlerts(alertThreshold);
      setAlerts(response);
    } catch (error) {
      console.error("Failed to load KDS alerts:", error);
    } finally {
      setIsAlertLoading(false);
    }
  }, [alertThreshold]);

  useEffect(() => {
    const loadAlerts = async () => {
      await fetchAlerts();
    };

    void loadAlerts();
  }, [fetchAlerts]);

  const onTimeCount = filteredOrders.filter((o: Order) => 
    (currentTime - new Date(o.createdAt).getTime()) / 60000 < 10
  ).length;
  
  const warningCount = filteredOrders.filter((o: Order) => {
    const mins = (currentTime - new Date(o.createdAt).getTime()) / 60000;
    return mins >= 10 && mins < 20;
  }).length;
  
  const overdueCount = filteredOrders.filter((o: Order) => 
    (currentTime - new Date(o.createdAt).getTime()) / 60000 >= 20
  ).length;

  let mainContent: ReactNode;
  if (isLoading) {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl">
        Loading kitchen queue...
      </div>
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
          <KDSTicket key={order.orderId} order={order} onActionComplete={refetch} />
        ))}
      </>
    );
  } else {
    mainContent = (
      <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl border-4 border-dashed border-gray-200 rounded-3xl">
        No orders for this station.
      </div>
    );
  }

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="bg-[#f8f9fa] flex h-screen w-screen overflow-hidden">
      
      <Navbar 
        items={KITCHEN_STATIONS}
        selectedValue={selectedStation}
        onValueChange={setSelectedStation}
      />

      <div className="flex flex-col flex-1 ml-24 p-8 h-full overflow-hidden">
        
        <div className="flex flex-col gap-6 mb-8 shrink-0">
          <div className="flex items-center justify-between gap-6">
            <div className="flex gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-dark font-bold text-sm">On Time:</span>
                <div className="border-2 border-primary text-primary font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">
                  {onTimeCount}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-dark font-bold text-sm">Warning:</span>
                <div className="border-2 border-[#f97316] text-[#f97316] font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">
                  {warningCount}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-dark font-bold text-sm">Overdue:</span>
                <div className="border-2 border-[#ef4444] text-[#ef4444] font-bold text-xl px-12 py-2 rounded-tr-xl rounded-bl-xl bg-surface flex justify-center shadow-sm tabular-nums">
                  {overdueCount}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-dark font-semibold">
                <AlertTriangle size={18} />
                Alerts
              </div>
              <div className="font-bold text-xl tabular-nums">{alerts.length}</div>
              <Button
                variant="outline-secondary"
                className="px-4 py-2"
                onClick={fetchAlerts}
                disabled={isAlertLoading}
              >
                {isAlertLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-dark/70 font-semibold">
              <Bell size={18} />
              <span>{notifications.length} live</span>
            </div>
            <Button variant="outline-danger" onClick={handleLogout} className="rounded-tr-4xl rounded-bl-4xl px-4 py-2">
              LOG OUT
            </Button>
          </div>
        </div>

        <div className="fixed top-4 right-4 z-50 w-[24rem] max-w-[calc(100vw-2rem)] space-y-3 pointer-events-none">
          {notifications.map((notification) => (
            <div key={notification.id} className={`pointer-events-auto rounded-3xl border-2 px-4 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${getNotificationTone(notification.kind)}`}>
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
    </div>
  );
};

export default KDSPage;