import { MenuItems } from "@/data"; 
import { Clock } from "lucide-react";
import { Button, ScrollArea } from "@/components";
import { useTicketTimer } from "../hooks/useTicketTimer";
import { kdsService } from "@/services";
import { useState } from "react";
import type { Order, OrderItem } from "@/types"; 

interface KDSTicketProps {
  order: Order;
  onActionComplete?: () => void;
}

const TicketRow = ({ item, textColor }: { item: OrderItem; textColor: string }) => {
  const menuItem = MenuItems.find(m => m.menuItemId === item.menuItemId);
  const itemName = item.name || menuItem?.name || "Unknown Item";
  
  const selectedOptions = item.selectedOptions || (menuItem?.customizationOptions?.filter(o => 
    item.selectedOptionIds?.includes(o.id)
  ) || []);

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "READY":
        return "bg-primary text-light";
      case "COOKING":
        return "bg-highlight text-dark";
      case "COMPLETED":
        return "bg-success text-light";
      default:
        return "bg-gray-300 text-dark";
    }
  };

  const statusBadge = item.status && item.status !== "PENDING" ? (
    <span className={`text-xs font-bold px-2 py-1 rounded ml-auto ${getStatusStyles(item.status)}`}>
      {item.status}
    </span>
  ) : null;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm">
      <span className={`${textColor} font-bold text-xl min-w-10`}>
        {item.quantity}x
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-dark font-bold text-lg leading-tight truncate">{itemName}</span>
          {statusBadge}
        </div>
        {selectedOptions.length > 0 && (
          <span className="text-dark/70 text-sm mt-1 truncate">
            {selectedOptions.map(opt => opt.name).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
};

// Map the timer to your Button's supported colors and your Tailwind theme colors
const getTicketTheme = (elapsedMinutes: number) => {
  if (elapsedMinutes >= 20) {
    return { color: "danger", bg: "bg-danger", text: "text-danger" };
  }
  if (elapsedMinutes >= 10) {
    return { color: "secondary", bg: "bg-highlight", text: "text-highlight" }; 
  }
  return { color: "primary", bg: "bg-primary", text: "text-primary" };
};

export const KDSTicket = ({ order, onActionComplete }: KDSTicketProps) => {
  const { elapsedTime, elapsedMinutes } = useTicketTimer(order.createdAt, order.status);
  const theme = getTicketTheme(elapsedMinutes);
  const [isUpdating, setIsUpdating] = useState(false);

  // Safely handle missing items array
  const items = order.items || [];

  const uniqueStations = Array.from(
    new Set(items.flatMap((item) => {
      const menuItem = MenuItems.find(m => m.menuItemId === item.menuItemId);
      return menuItem?.kitchenStations || [];
    }))
  ).join(", ");

  const handleMarkReady = async (itemId: number) => {
    setIsUpdating(true);
    try {
      await kdsService.markItemReady(order.orderId, itemId);
      onActionComplete?.();
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  {/*const handleMarkCooking = async (orderId: number) => {
    setIsUpdating(true);
    try {
      await kdsService.markOrderCooking(orderId);
      onActionComplete?.();
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setIsUpdating(false);
    }
  }*/}

  return (
    <div className="flex flex-col w-80 shrink-0 drop-shadow-md h-128">
      {/* HEADER */}
      <div className={`${theme.bg} text-light rounded-tr-3xl rounded-tl-xl p-5 flex justify-between items-start z-10 transition-colors duration-500`}>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-wide">TABLE #{order.tableNumber}</h2>
          <span className="text-sm font-semibold opacity-90">{uniqueStations || "General"}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-lg mt-1 tabular-nums tracking-wider">
          <Clock size={20} />
          <span>{elapsedTime}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="bg-surface border-4 border-dashed border-gray-200 border-t-0 rounded-bl-3xl rounded-br-xl flex-1 flex flex-col p-5 -mt-2 pt-6 relative">
        <div className="flex-1 overflow-hidden -mr-2">
          <ScrollArea direction="vertical" className="h-full pr-4 pb-2">
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.orderItemId} className="flex flex-col gap-2">
                  <TicketRow item={item} textColor={theme.text} />
                  <Button
                    variant="full-primary"
                    onClick={() => handleMarkReady(item.orderItemId)}
                    disabled={isUpdating || item.status === "READY" || item.status === "COMPLETED" || item.status === "CANCELED"}
                    className="w-full py-3 text-lg"
                  >
                    SERVE
                  </Button>
                </div>
              ))}
              {/*Start cooking button for pending items*/}
              {/*{items.some(item => item.status === "PENDING") && (
                <Button
                  variant="outline-primary"
                  onClick={() => handleMarkCooking(order.orderId)}
                  disabled={isUpdating}
                  className="w-full py-3 text-lg"
                >
                  START COOKING
                </Button>
              )}
              */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};