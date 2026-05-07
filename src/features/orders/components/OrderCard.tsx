import { Clock, Package, UtensilsCrossed } from "lucide-react";

import { ScrollArea } from "@/components";
import { useTicketTimer } from "@/features/kds/hooks/useTicketTimer";
import type { Order } from "@/types";
import { formatCurrency, formatDuration } from "@/utils/formatters";

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-primary text-light";
    case "COOKING":
      return "bg-highlight text-dark";
    case "READY":
      return "bg-success text-light";
    case "COMPLETED":
      return "bg-success text-light";
    case "CANCELED":
      return "bg-warning-400 text-dark";
    default:
      return "bg-gray-300 text-dark";
  }
};

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const { elapsedTime } = useTicketTimer(order.createdAt, order.status);
  const activeItems = order.items.filter((item) => item.status !== "COMPLETED" && item.status !== "CANCELED" && item.status !== "READY");
  const completedAt = order.completedAt || order.updatedAt || null;
  const completedDuration = completedAt ? formatDuration(order.createdAt, completedAt) : null;
  const displayTime = (order.status === "COMPLETED" || order.status === "CANCELED") && completedDuration ? completedDuration : elapsedTime;

  return (
    <button
      type="button"
      onClick={() => onClick?.(order)}
      className="flex flex-col w-[26rem] shrink-0 drop-shadow-md h-[34rem] text-left cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="bg-dark text-light rounded-tr-3xl rounded-tl-xl p-5 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-wide">ORDER #{order.orderId}</h2>
          <span className="text-sm font-semibold opacity-90">TABLE {order.tableNumber}</span>
        </div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyles(order.status)}`}>
          {order.status}
        </div>
      </div>

      <div className="bg-surface border-4 border-dashed border-gray-200 border-t-0 rounded-bl-3xl rounded-br-xl flex-1 flex flex-col p-5 -mt-2 pt-6 relative">
        <div className="flex items-center justify-between mb-4 text-dark/80 font-semibold">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{displayTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={18} />
            <span>{activeItems.length} active</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea direction="vertical" className="h-full pr-4 pb-2">
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.orderItemId} className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed size={16} className="text-primary" />
                        <h3 className="font-bold text-dark">{item.name || item.menuItem?.name || "Item"}</h3>
                      </div>
                      <p className="text-sm text-dark/60 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusStyles(item.status || "PENDING")}`}>
                      {item.status || "PENDING"}
                    </span>
                  </div>
                  {item.specialInstructions && (
                    <p className="text-sm text-dark/70 mt-3">{item.specialInstructions}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-gray-100 pt-4 text-dark">
          <span className="font-bold tracking-wide">TOTAL</span>
          <span className="text-2xl font-black text-highlight">{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>
    </button>
  );
};