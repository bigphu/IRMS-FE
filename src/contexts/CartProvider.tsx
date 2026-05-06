// src/features/cart/contexts/CartProvider.tsx
import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContext"; 
import type { OrderItem } from "@/types";

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);

  // --- DERIVED STATE ---
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  // --- ACTIONS ---
  const addToCart = (newItem: OrderItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.orderItemId === newItem.orderItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = newItem;
        return updatedItems;
      }

      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (orderItemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.orderItemId !== orderItemId));
  };

  const updateQuantity = (orderItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(orderItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.orderItemId === orderItemId
          ? { 
              ...item, 
              quantity: newQuantity, 
              // Math works perfectly without needing the MenuItem object!
              totalPrice: (item.totalPrice / item.quantity) * newQuantity 
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;