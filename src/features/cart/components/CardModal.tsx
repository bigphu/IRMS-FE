// src/features/cart/CartModal.tsx
import { useState } from "react";
import { Archive } from "lucide-react";
import { useCartContext } from "../contexts/CartContext";
import { ScrollArea, Button } from "@/components";
import { default as ItemContainer } from "@/features/item/components/ItemContainer";
import { CartItem } from "./CartItem"; 
import { formatCurrency } from "@/utils/formatters";
import type { OrderItem } from "@/types";

interface CartModalProps {
  onClose: () => void;
}

export const CartModal = ({ onClose }: CartModalProps) => {
  const { items, totalItems, totalPrice, removeFromCart } = useCartContext();
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);

  return (
    // BaseModal styled backdrop and container
    <div className="bg-dark/80 fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="bg-surface rounded-tr-card rounded-bl-card flex flex-col h-170 w-full max-w-7xl shadow-2xl p-8 pb-0">

        {/* RIGHT COLUMN: Cart Items */}
        {/* <div className="flex max-h- w-full flex-col"> */}
        {/* <div className="mb-4 flex items-end justify-between"> */}
          <h2 className="text-dark text-2xl font-bold">Review Order</h2>
        {/* </div> */}

        <ScrollArea className="h-full" direction="vertical">
          <div className="flex flex-col gap-4 pt-4 pb-4 pl-4 pr-1">
            {items.map((item: OrderItem) => (
              <CartItem 
                key={item.orderItemId} 
                item={item} 
                onEdit={setEditingItem} 
                onRemove={removeFromCart}
              />
            ))}

            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-75 text-dark/30">
                <Archive size={64} className="mb-4" />
                <p className="text-2xl font-bold">Your cart is empty.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        {/* </div> */}
        
        {/* <hr className="mb-6"/> */}

        <div className="flex items-baseline justify-end gap-8 border-t-2 border-background p-8">
          <div className="flex gap-4 text-dark">
            <div className="flex gap-2 items-baseline">
              <p className="text-md font-bold">Total Quantity:</p>
              <p className="text-2xl text-primary font-bold">{totalItems}</p>
            </div>

            <div className="flex gap-2 items-baseline">
              <p className="text-md font-bold tracking-widest">Order Total:</p>
              <p className="text-highlight text-2xl font-bold">{formatCurrency(totalPrice)}</p>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <Button variant="primary" className="px-6 py-2" disabled={items.length === 0}>
              CHECKOUT
            </Button>
            <Button variant="outline" className="px-3 py-2" onClick={onClose}>
              BACK
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL WORKSPACE */}
      {/* Needs a higher z-index (z-50) so it stacks on top of the CartModal (z-40) */}
      {editingItem && (
        <div className="fixed inset-0 z-50">
          <ItemContainer 
            item={editingItem.menuItem} 
            initialOrder={editingItem} 
            onClose={() => setEditingItem(null)} 
          />
        </div>
      )}
    </div>
  );
};