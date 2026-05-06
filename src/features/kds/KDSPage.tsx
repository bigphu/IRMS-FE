import { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, Pizza, UtensilsCrossed, Salad, List, AlertTriangle } from "lucide-react";

import Navbar, { type NavItem } from "@/components/layout/Navbar";
import { ScrollArea, Button } from "@/components";
import { KDSTicket } from "./components/KDSTicket";
import { useKDSQuery } from "@/hooks/useKDSQuery";
import { useMenuContext } from "@/contexts/MenuContext";
import { kdsService } from "@/services";
import type { KitchenStation, Order, OrderItem } from "@/types";

const KITCHEN_STATIONS: NavItem[] = [
  { id: "ALL", label: "All", icon: <List size={28} /> },
  { id: "PIZZA", label: "Pizza", icon: <Pizza size={28} /> },
  { id: "GRILL", label: "Grill", icon: <Flame size={28} /> },
  { id: "FRY", label: "Fry", icon: <UtensilsCrossed size={28} /> },
  { id: "PREP", label: "Prep", icon: <Salad size={28} /> },
];

export const KDSPage = () => {
  const [selectedStation, setSelectedStation] = useState<string>("ALL");
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { orders, isLoading, refresh } = useKDSQuery();
  const { menuItems } = useMenuContext();

  const [alerts, setAlerts] = useState<Order[]>([]);
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    if (selectedStation === "ALL") return orders;

    return orders.filter((order: Order) => {
      return order.items.some((item: OrderItem) => {
        const menuItem = menuItems.find((m) => m.menuItemId === item.menuItemId);
        return menuItem?.kitchenStations?.includes(selectedStation as KitchenStation);
      });
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
          <div className="flex items-center gap-2 text-sm text-dark/70">
            <span>Alert threshold:</span>
            {[5, 10, 15].map((threshold) => (
              <Button
                key={threshold}
                variant={alertThreshold === threshold ? "full-secondary" : "outline-secondary"}
                className="text-xs px-3 py-2"
                onClick={() => setAlertThreshold(threshold)}
              >
                {threshold}m
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea direction="horizontal" className="h-full w-full pb-4">
            <div className="flex gap-8 h-full pl-2 pr-4 pt-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl">
                  Loading kitchen queue...
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order: Order) => (
                  <KDSTicket key={order.orderId} order={order} refreshOrders={refresh} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-128 text-dark/30 font-bold text-2xl border-4 border-dashed border-gray-200 rounded-3xl">
                  No orders for this station.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
};

export default KDSPage;