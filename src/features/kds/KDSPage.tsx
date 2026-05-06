// src/features/kds/KDSPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Flame, Pizza, UtensilsCrossed, Salad, List } from "lucide-react";

import Navbar, { type NavItem } from "@/components/layout/Navbar"; // <-- Added 'type' keyword
import { ScrollArea } from "@/components"; 
import { KDSTicket } from "./components/KDSTicket"; 
import { MOCK_KDS_ORDERS } from "@/data/mockKDSData"; // <-- Direct path to bypass the barrel file issue
import type { KitchenStation, Order, OrderItem } from "@/types"; // <-- Imported missing Order and OrderItem types

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

  const filteredOrders = useMemo(() => {
    if (selectedStation === "ALL") return MOCK_KDS_ORDERS;
    
    return MOCK_KDS_ORDERS.filter((order: Order) => {
      return order.items.some((item: OrderItem) => 
        // <-- Removed the dirty 'any' cast! We just use the clean menuItem path.
        item.menuItem?.kitchenStations?.includes(selectedStation as KitchenStation)
      );
    });
  }, [selectedStation]);

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
        
        <div className="flex items-end justify-between mb-8 shrink-0">
          
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

        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea direction="horizontal" className="h-full w-full pb-4">
            <div className="flex gap-8 h-full pl-2 pr-4 pt-2">
              {filteredOrders.map((order: Order) => (
                <KDSTicket key={order.orderId} order={order} />
              ))}
              
              {filteredOrders.length === 0 && (
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