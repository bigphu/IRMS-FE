import { 
  AlertTriangleIcon, 
  CircleQuestionMark, 
  NotebookTextIcon, 
  ChefHatIcon,
  PlayIcon,
  CheckCircle2Icon,
  UtensilsCrossedIcon,
  ClockIcon
} from "lucide-react";
import { Button } from "../../components";
import type { KdsQueueOrderItem } from "../../types/api";

interface KdsCardItemProps {
  orderId: number;
  item: KdsQueueOrderItem;
  isChef: boolean;
  isUrgent?: boolean; // New prop!
  onStart: (orderId: number, itemId: number) => void;
  onReady: (orderId: number, itemId: number) => void;
  onComplete: (orderId: number, itemId: number) => void;
}

export const KdsCardItem = ({ 
  orderId, 
  item, 
  isChef, 
  isUrgent, 
  onStart, 
  onReady, 
  onComplete 
}: KdsCardItemProps) => {

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING": return "bg-neutral text-secondary";
      case "COOKING": return "bg-accent/20 text-accent border border-accent/30";
      case "READY": return "bg-primary/20 text-primary border border-primary/30";
      case "COMPLETED": return "bg-secondary/20 text-secondary border border-secondary/30";
      case "CANCELED": return "bg-danger/20 text-danger border border-danger/30";
      default: return "bg-neutral text-on-surface";
    }
  };

  if (item.status === "COMPLETED" || item.status === "CANCELED") return null;

  return (
    // Add a glowing danger background if this specific item is urgent!
    <div className={`flex w-full flex-col gap-2 border-b-2 border-secondary/10 pb-4 last:border-0 last:pb-0 ${isUrgent ? 'bg-danger/5 rounded-xl p-2 border-danger/30' : ''}`}>
      
      {/* Item Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl text-on-surface leading-tight">
          <span className="text-primary text-lg mr-2">
            {item.quantity} x 
          </span>
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
          
          {/* Display Estimated Prep Time */}
          {item.menuItem?.estimatedPrepMinutes && (
            <div className={`flex items-center gap-1 mt-0.5 ${isUrgent ? 'text-danger animate-pulse' : 'text-secondary/70'}`}>
               <ClockIcon size={14} />
               {/* Multiply by quantity so the chef sees total time! */}
               <span>{item.menuItem.estimatedPrepMinutes * (item.quantity || 1)}m</span>
            </div>
          )}

          {/* Stations */}
          {item.menuItem?.stations && item.menuItem.stations.length > 0 && (
            <div className="flex items-center gap-1 text-secondary">
              <span className="opacity-50">-</span>
              <span>
                <ChefHatIcon size={16} className="ml-1" />
              </span>
              <span>{item.menuItem.stations.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {(item.allergyNotes || item.customizations || item.specialInstructions) && (
        <div className={`flex flex-col gap-1 rounded-xl border-2 p-4 text-sm font-mono italic overflow-hidden ${isUrgent ? 'border-danger/20' : 'border-secondary/10'}`}>
          {item.allergyNotes && (
            <p className="flex items-start gap-2 text-danger/90 font-bold">
              <AlertTriangleIcon size={16} className="shrink-0 mt-0.5" />
              <span>{item.allergyNotes}</span>
            </p>
          )}
          {item.customizations && (
            <p className="flex items-start gap-2 text-primary/80">
              <NotebookTextIcon size={16} className="shrink-0 mt-0.5" />
              <span>{item.customizations}</span>
            </p>
          )}
          {item.specialInstructions && (
            <p className="flex items-start gap-2 text-secondary/80">
              <CircleQuestionMark size={16} className="shrink-0 mt-0.5" />
              <span>{item.specialInstructions}</span>
            </p>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-1">
        <span className={`rounded-lg px-3 py-1 text-sm shadow-sm ${getStatusColor(item.status)}`}>
          {item.status}
        </span>

        {isChef && item.orderItemId && (
          <div className="shrink-0">
            {item.status === "PENDING" && (
              <Button variant="outline-primary" onClick={() => onStart(orderId, item.orderItemId!)}>
                <div className="flex items-center gap-1.5 text-xs px-1 uppercase">
                  <PlayIcon size={14} /> Start
                </div>
              </Button>
            )}
            {item.status === "COOKING" && (
              <Button variant="full-primary" onClick={() => onReady(orderId, item.orderItemId!)}>
                <div className="flex items-center gap-1.5 text-xs px-1 uppercase">
                  <UtensilsCrossedIcon size={14} /> Ready
                </div>
              </Button>
            )}
            {item.status === "READY" && (
              <Button variant="full-accent" onClick={() => onComplete(orderId, item.orderItemId!)}>
                <div className="flex items-center gap-1.5 text-xs px-1 uppercase">
                  <CheckCircle2Icon size={14} /> Finish
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};