import { MenuItems } from "@/data"; 
import { Clock } from "lucide-react";
import { Button, ScrollArea } from "@/components";
import { useTicketTimer } from "../hooks/useTicketTimer";
import type { Order, OrderItem } from "@/types"; 

interface KDSTicketProps {
  order: Order;
}

const TicketRow = ({ item, textColor }: { item: OrderItem; textColor: string }) => {
  const menuItem = MenuItems.find(m => m.menuItemId === item.menuItemId);
  const itemName = menuItem?.name || "Unknown Item";
  
  const selectedOptions = menuItem?.customizationOptions?.filter(o => 
    item.selectedOptionIds?.includes(o.id)
  ) || [];

  return (
    <div className="flex items-start gap-4">
      <span className={`${textColor} font-bold text-xl min-w-10`}>
        {item.quantity}x
      </span>
      <div className="flex flex-col">
        <span className="text-dark font-bold text-lg leading-tight">{itemName}</span>
        {selectedOptions.length > 0 && (
          <span className="text-dark/70 text-sm mt-1">
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
    return { color: "danger", bg: "bg-danger", text: "text-danger", actionLabel: "READY" };
  }
  if (elapsedMinutes >= 10) {
    // Maps to your "secondary" button variant, which uses the "highlight" tailwind color
    return { color: "secondary", bg: "bg-highlight", text: "text-highlight", actionLabel: "READY" }; 
  }
  return { color: "primary", bg: "bg-primary", text: "text-primary", actionLabel: "READY" };
};

export const KDSTicket = ({ order }: KDSTicketProps) => {
  const { elapsedTime, elapsedMinutes } = useTicketTimer(order.createdAt);
  const theme = getTicketTheme(elapsedMinutes);

  const uniqueStations = Array.from(
    new Set(order.items.flatMap((item) => {
      const menuItem = MenuItems.find(m => m.menuItemId === item.menuItemId);
      return menuItem?.kitchenStations || [];
    }))
  ).join(", ");

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
            <div className="flex flex-col gap-5">
              {order.items.map((item) => (
                <TicketRow key={item.orderItemId} item={item} textColor={theme.text} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* ACTIONS: Dramatically simplified using your Button variants! */}
        <div className="flex gap-3 mt-4 pt-4 border-t-2 border-gray-100">
          <Button 
            variant={`full-${theme.color}`} 
            className="flex-1 py-3 text-lg"
          >
            {theme.actionLabel}
          </Button>
          
          <Button 
            variant={`outline-${theme.color}`} 
            className="flex-1 py-3 text-lg bg-surface"
          >
            HOLD
          </Button>
        </div>
      </div>
    </div>
  );
};