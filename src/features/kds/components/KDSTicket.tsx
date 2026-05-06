import { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { Button, ScrollArea } from "@/components";
import { useTicketTimer } from "../hooks/useTicketTimer";
import { useMenuContext } from "@/contexts/MenuContext";
import { kdsService } from "@/services";
import type { Order, OrderItem } from "@/types";

interface KDSTicketProps {
  order: Order;
  refreshOrders: () => Promise<void>;
}

const itemStatusLabel = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "IN_PROGRESS":
      return "Cooking";
    case "READY":
      return "Ready";
    case "COMPLETED":
      return "Completed";
    case "CANCELED":
      return "Canceled";
    case "PENDING":
    default:
      return "Pending";
  }
};

const getItemAction = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "IN_PROGRESS":
      return { label: "Mark Ready", action: "ready", color: "secondary" };
    case "READY":
      return { label: "Complete", action: "complete", color: "primary" };
    case "COMPLETED":
      return { label: "Completed", action: null, color: "primary" };
    case "CANCELED":
      return { label: "Canceled", action: null, color: "danger" };
    case "PENDING":
    default:
      return { label: "Start Cooking", action: "start", color: "primary" };
  }
};

const TicketRow = ({ item, textColor, onAction }: { item: OrderItem; textColor: string; onAction: (item: OrderItem, action: string) => Promise<void> }) => {
  const { menuItems } = useMenuContext();
  const menuItem = menuItems.find((m) => m.menuItemId === item.menuItemId);
  const itemName = menuItem?.name || item.name || "Unknown Item";

  const selectedOptions = menuItem?.customizationOptions?.filter((o) =>
    item.selectedOptionIds?.includes(o.id),
  ) || [];

  const action = getItemAction(item.status);

  return (
    <div className="rounded-3xl border border-gray-200 bg-light p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-dark/70">
            <span className={`${textColor}`}>{item.quantity}x</span>
            <span>{itemName}</span>
          </div>
          {selectedOptions.length > 0 && (
            <div className="text-dark/70 text-xs mt-2">
              {selectedOptions.map((opt) => opt.name).join(", ")}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-dark shadow-sm">
            {itemStatusLabel(item.status)}
          </span>
          {action.action ? (
            <Button
              variant={`full-${action.color}`}
              className="text-xs px-3 py-2"
              onClick={() => onAction(item, action.action!)}
            >
              {action.label}
            </Button>
          ) : (
            <span className="text-xs text-dark/60">No action</span>
          )}
        </div>
      </div>

      {item.status && item.status.toUpperCase() !== "COMPLETED" && item.status.toUpperCase() !== "CANCELED" && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline-danger"
            className="text-xs px-3 py-2"
            onClick={() => onAction(item, "cancel")}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export const KDSTicket = ({ order, refreshOrders }: KDSTicketProps) => {
  const [processingItemId, setProcessingItemId] = useState<number | null>(null);
  const { elapsedTime, elapsedMinutes } = useTicketTimer(order.createdAt);
  const theme = useMemo(() => {
    if (elapsedMinutes >= 20) {
      return { color: "danger", bg: "bg-danger", text: "text-danger" };
    }
    if (elapsedMinutes >= 10) {
      return { color: "secondary", bg: "bg-highlight", text: "text-highlight" };
    }
    return { color: "primary", bg: "bg-primary", text: "text-primary" };
  }, [elapsedMinutes]);

  const itemCount = order.items.length;

  const { menuItems } = useMenuContext();

  const uniqueStations = useMemo(
    () =>
      Array.from(
        new Set(
          order.items.flatMap((item) => {
            const menuItem = menuItems.find((menu) => menu.menuItemId === item.menuItemId);
            return menuItem?.kitchenStations ?? [];
          }),
        ),
      ).join(", "),
    [menuItems, order.items],
  );

  const handleAction = async (item: OrderItem, action: string) => {
    setProcessingItemId(item.orderItemId);
    try {
      switch (action) {
        case "start":
          await kdsService.startItem(order.orderId, item.orderItemId);
          break;
        case "ready":
          await kdsService.readyItem(order.orderId, item.orderItemId);
          break;
        case "complete":
          await kdsService.completeItem(order.orderId, item.orderItemId);
          break;
        case "cancel":
          await kdsService.cancelItem(order.orderId, item.orderItemId);
          break;
      }
      await refreshOrders();
    } catch (error) {
      console.error("Failed to update item status:", error);
    } finally {
      setProcessingItemId(null);
    }
  };

  return (
    <div className="flex flex-col w-80 shrink-0 drop-shadow-md h-128">
      <div className={`${theme.bg} text-light rounded-tr-3xl rounded-tl-xl p-5 flex justify-between items-start z-10 transition-colors duration-500`}>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold uppercase tracking-widest opacity-80">Table</div>
          <h2 className="text-2xl font-bold tracking-wide">#{order.tableNumber}</h2>
          <span className="text-sm font-semibold opacity-90">{uniqueStations || "General"}</span>
        </div>

        <div className="flex flex-col items-end gap-2 font-bold text-lg tabular-nums tracking-wider">
          <div className="flex items-center gap-1">
            <Clock size={20} />
            <span>{elapsedTime}</span>
          </div>
          <span className="text-sm uppercase tracking-wide opacity-80">{itemCount} Items</span>
        </div>
      </div>

      <div className="bg-surface border-4 border-dashed border-gray-200 border-t-0 rounded-bl-3xl rounded-br-xl flex-1 flex flex-col p-5 -mt-2 pt-6 relative">
        <div className="flex-1 overflow-hidden -mr-2">
          <ScrollArea direction="vertical" className="h-full pr-4 pb-2">
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <TicketRow
                  key={item.orderItemId}
                  item={item}
                  textColor={theme.text}
                  onAction={async (selectedItem, actionType) => {
                    if (processingItemId) return;
                    await handleAction(selectedItem, actionType);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {processingItemId && (
          <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-dark/95 p-3 text-center text-sm text-light shadow-lg">
            Updating item #{processingItemId}...
          </div>
        )}
      </div>
    </div>
  );
};
