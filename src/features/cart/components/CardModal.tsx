// src/features/cart/CardModal.tsx
import { MenuItems } from "@/data";
import { useState } from "react";
import { Archive, AlertCircle } from "lucide-react";
import { useCartContext } from "../../../contexts/CartContext";
import { ScrollArea, Button } from "@/components";
import { default as ItemContainer } from "@/features/item/components/ItemContainer";
import { CartItem } from "./CartItem"; 
import { formatCurrency } from "@/utils/formatters";
import type { OrderItem } from "@/types";
import { orderService } from "@/services";
import { useNavigate } from "react-router-dom";

interface CartModalProps {
  onClose: () => void;
}

export const CartModal = ({ onClose }: CartModalProps) => {
  const { items, totalItems, totalPrice, removeFromCart, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("1");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!tableNumber || parseInt(tableNumber) < 1) {
      setError("Please enter a valid table number");
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setIsCheckingOut(true);
    setError(null);

    try {
      await orderService.createOrder(parseInt(tableNumber), items);
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (success) {
    return (
      <div className="bg-dark/80 fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="bg-surface rounded-tr-card rounded-bl-card flex flex-col items-center justify-center h-170 w-full max-w-2xl shadow-2xl p-8">
          <div className="text-6xl mb-6">✓</div>
          <h2 className="text-dark text-3xl font-bold mb-2">Order Created!</h2>
          <p className="text-dark/70 text-lg mb-6">Table {tableNumber}</p>
          <div className="mt-8 flex gap-3">
            <Button variant="full-primary" onClick={() => navigate("/orders")}>
              VIEW ALL ORDERS
            </Button>
            <Button variant="outline" onClick={onClose}>
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="flex flex-col gap-4 border-t-2 border-background p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 rounded-lg p-3">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-dark font-bold">Table #:</label>
              <input
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                disabled={isCheckingOut}
                className="bg-dark/10 border-2 border-dark/30 rounded-lg px-4 py-2 text-dark font-bold w-24 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-4 items-baseline ml-auto">
              <div className="flex gap-2 items-baseline">
                <p className="text-md font-bold">Total Qty:</p>
                <p className="text-2xl text-primary font-bold">{totalItems}</p>
              </div>

              <div className="flex gap-2 items-baseline">
                <p className="text-md font-bold tracking-widest">Order Total:</p>
                <p className="text-highlight text-2xl font-bold">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-3 justify-end">
            <Button 
              variant="full-primary" 
              className="px-8 py-3" 
              disabled={items.length === 0 || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? "CREATING ORDER..." : "CHECKOUT"}
            </Button>
            <Button variant="outline" className="px-3 py-2" onClick={onClose} disabled={isCheckingOut}>
              BACK
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL WORKSPACE */}
      {editingItem && (
        <div className="fixed inset-0 z-50">
          <ItemContainer 
            item={MenuItems.find(m => m.menuItemId === editingItem.menuItemId)!} 
            initialOrder={editingItem} 
            onClose={() => setEditingItem(null)} 
          />
        </div>
      )}
    </div>
  );
};