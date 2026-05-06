import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContext"; // Import the context from the TS file
import type { OrderItem } from "@/types";

interface CartProviderProps {
  children: ReactNode;
}

// 3. Create the Provider Component
export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);

  // --- DERIVED STATE ---
  // useMemo ensures we only recalculate these numbers when the 'items' array actually changes
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  // --- ACTIONS ---
  const addToCart = (newItem: OrderItem) => {
    setItems((prevItems) => {
      // Check if this item already exists in the cart (This happens during an Edit!)
      const existingItemIndex = prevItems.findIndex(
        (item) => item.orderItemId === newItem.orderItemId
      );

      if (existingItemIndex > -1) {
        // EDIT MODE: Replace the old version with the new customized version
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = newItem;
        return updatedItems;
      }

      // ADD MODE: It's a brand new item, so append it to the array
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
              // Don't forget to recalculate the row's total price based on the new quantity!
              totalPrice: (item.totalPrice / item.quantity) * newQuantity 
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // --- BUNDLE AND BROADCAST ---
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