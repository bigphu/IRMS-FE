import { ClockIcon } from "lucide-react";
import type { KdsQueueOrder, KdsAlert } from "../../types/api";
import { formatTime } from "../../utils";
import { KdsCardItem } from "./KdsCardItem";

interface KdsCardProps {
  order: KdsQueueOrder;
  isChef: boolean;
  alerts?: KdsAlert[]; 
  onStart: (orderId: number, itemId: number) => void;
  onReady: (orderId: number, itemId: number) => void;
  onComplete: (orderId: number, itemId: number) => void;
}

export const KdsCard = ({ 
  order, 
  isChef, 
  alerts = [], 
  onStart, 
  onReady, 
  onComplete 
}: KdsCardProps) => {
  
  // Chefs only see active items. Servers see everything (history included)
  const activeItems = [...(order.items || [])]
    .filter(item => isChef ? (item.status !== "COMPLETED" && item.status !== "CANCELED") : true)
    .sort((a, b) => (a.orderItemId || 0) - (b.orderItemId || 0));

  if (!activeItems || activeItems.length === 0) return null;

  // Filter out stale alerts for items that are already cooked/ready
  const activeAlerts = alerts.filter(alert => {
    const matchedItem = order.items?.find(i => i.orderItemId === alert.orderItemId);
    return matchedItem && (matchedItem.status === "PENDING" || matchedItem.status === "COOKING");
  });

  const isOrderFinished = order.status === "COMPLETED" || order.status === "CANCELED";
  
  // Use activeAlerts instead of raw alerts
  const hasLateItems = !isOrderFinished && activeAlerts.length > 0;

  return (
    <div className={`flex h-fit w-full shrink-0 flex-col overflow-hidden rounded-tr-4xl rounded-bl-4xl border-2 transition-all 
      ${hasLateItems ? 'border-danger hover:shadow-danger/50 shadow-md' : 'border-secondary bg-surface hover:shadow-primary/50 shadow-md'}
      ${!isChef && isOrderFinished ? 'opacity-60 grayscale bg-neutral/30 border-secondary/30 shadow-none' : ''} 
    `}>
      
      {/* Header */}
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

      {/* Body */}
      <div className={`flex flex-col p-4 gap-4 ${!isChef && isOrderFinished ? 'bg-transparent' : 'bg-surface'}`}>
        {activeItems.map((item) => {
          const isUrgent = activeAlerts.some((alert) => alert.orderItemId === item.orderItemId);

          return (
            <KdsCardItem
              key={item.orderItemId}
              orderId={order.orderId!}
              item={item}
              isChef={isChef}
              isUrgent={isUrgent}
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