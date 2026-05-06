// src/features/cart/contexts/CartContext.ts
import { createContext, useContext } from "react";
import type { OrderItem } from "@/types";

interface CartContextType {
  items: OrderItem[]; // Now automatically uses the normalized ID structure
  totalItems: number;
  totalPrice: number;
  
  addToCart: (item: OrderItem) => void;
  removeFromCart: (orderItemId: number) => void;
  updateQuantity: (orderItemId: number, newQuantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};