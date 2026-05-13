import { ClockIcon } from "lucide-react";
import type { KdsQueueOrder, KdsAlert } from "../../types/api";
import { formatTime } from "../../utils"
import { KdsCardItem } from "./KdsCardItem";

interface KdsCardProps {
  order: KdsQueueOrder;
  isChef: boolean;
  alerts?: KdsAlert[]; // Accept the alerts array
  onStart: (orderId: number, itemId: number) => void;
  onReady: (orderId: number, itemId: number) => void;
  onComplete: (orderId: number, itemId: number) => void;
}

export const KdsCard = ({ 
  order, 
  isChef, 
  alerts = [], // Default to empty array
  onStart, 
  onReady, 
  onComplete 
}: KdsCardProps) => {
  const activeItems = order.items?.filter(item => 
    item.status !== "COMPLETED" && item.status !== "CANCELED"
  );

  if (!activeItems || activeItems.length === 0) return null;

  // Determine if the whole order card should have a red header if ANY item is late
  const hasLateItems = alerts.length > 0;

  return (
    <div className={`flex h-fit w-full shrink-0 flex-col overflow-hidden rounded-tr-4xl rounded-bl-4xl border-2 bg-surface shadow-md transition-all hover:shadow-lg ${hasLateItems ? 'border-danger hover:shadow-danger/50' : 'border-secondary hover:shadow-primary/50'}`}>
      
      {/* Header - Change color if an item is late! */}
      <div className={`flex flex-col px-6 py-4 border-b-2 rounded-bl-4xl ${hasLateItems ? 'bg-danger/10 border-danger/20' : 'bg-secondary/5 border-secondary/10'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl ${hasLateItems ? 'text-danger' : 'text-primary'}`}>
            Order #{order.orderId}
          </h2>
          {order.tableNumber && (
            <span className={`rounded-lg px-3 py-1 text-md shadow-sm ${hasLateItems ? 'bg-danger text-on-danger' : 'bg-primary text-on-primary'}`}>
              Table {order.tableNumber}
            </span>
          )}
        </div>
        
        <div className={`mt-2 flex items-center gap-2 text-md font-bold font-mono tracking-wider ${hasLateItems ? 'text-danger/80' : 'text-secondary/50'}`}>
          <ClockIcon size={16} />
          <span>At: {formatTime(order.createdAt!)}</span>
        </div>
      </div>

      {/* Body: Mapped Items */}
      <div className="flex flex-col p-4 gap-4 bg-surface">
        {activeItems.map((item) => {
          // Check if THIS specific item is in the alerts array
          const isUrgent = alerts.some((alert) => alert.orderItemId === item.orderItemId);

          return (
            <KdsCardItem
              key={item.orderItemId}
              orderId={order.orderId!}
              item={item}
              isChef={isChef}
              isUrgent={isUrgent} // Pass urgency to the item!
              onStart={onStart}
              onReady={onReady}
              onComplete={onComplete}
            />
          );
        })}
      </div>
    </div>
  );
};