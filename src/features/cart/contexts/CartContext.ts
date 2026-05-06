import { createContext, useContext } from "react";
import type { OrderItem } from "@/types";

// 1. Define what the global PA system will broadcast
interface CartContextType {
  // State
  items: OrderItem[];
  
  // Derived State (Calculated on the fly)
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addToCart: (item: OrderItem) => void;
  removeFromCart: (orderItemId: number) => void;
  updateQuantity: (orderItemId: number, newQuantity: number) => void;
  clearCart: () => void;
}

// 2. Create the Context & Hook
export const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};