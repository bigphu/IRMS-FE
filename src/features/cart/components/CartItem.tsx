// src/features/cart/components/CartItem.tsx
import { Tag, Archive, Gem, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { OrderItem } from "@/types";
import { Button } from "@/components";

interface CartItemProps {
  item: OrderItem;
  onEdit: (item: OrderItem) => void;
  onRemove: (orderItemId: number) => void;
}

export const CartItem = ({ item, onEdit, onRemove }: CartItemProps) => {
  const optionsPrice =
    item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;

  return (
    <div className="bg-surface rounded-tr-card rounded-bl-card border-background/20 hover:shadow-primary/50 hover:ring-primary flex h-28 w-full border-2 shadow-md transition-all duration-300 hover:ring-2 hover:ring-offset-2">
      <div className="bg-dark rounded-bl-card rounded-tr-card relative flex h-full w-1/5 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={item.menuItem.imageUrl}
          alt={item.menuItem.name}
          className="absolute -right-8 -bottom-20 scale-80 -rotate-12 rounded-full object-fill"
        />
      </div>

      <div className="flex flex-1 items-center justify-between px-6 py-2">
        <div className="flex flex-col justify-center">
          <h3 className="text-dark mb-1 text-xl font-bold">
            {item.menuItem.name}
          </h3>
          <div className="text-dark/70 flex items-center gap-4 text-xs font-bold">
            <span className="text-primary flex items-center gap-1">
              <Tag size={12} fill="currentColor" />
              {formatCurrency(item.menuItem.price)}
            </span>
            <span className="text-primary flex items-center gap-1">
              <Archive size={12} fill="currentColor" />
              {item.quantity}
            </span>
            <span className="text-primary flex items-center gap-1">
              <Gem size={12} fill="currentColor" />
              {optionsPrice > 0 ? formatCurrency(optionsPrice) : "0"}
            </span>
          </div>
        </div>

        <div className="ml-4 flex items-end gap-2 font-bold">
          <span className="text-dark">Total:</span>
          <span className="text-primary text-xl tracking-wide">
            {formatCurrency(item.totalPrice)}
          </span>
        </div>

        {/* Action Buttons Stacked */}
        <div className="ml-6 flex gap-2">
          <Button
            onClick={() => onEdit(item)}
            className="p-2"
            variant="outline"
          >
            <Pencil size={14} fill="currentColor" />
          </Button>

          <Button
            onClick={() => onRemove(item.orderItemId!)}
            className="p-2"
            variant="outline-danger"
          >
            <Trash2 size={14} fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
};
