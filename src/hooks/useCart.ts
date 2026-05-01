import { useState, useEffect } from 'react';
import type { CartItem, User } from '../types';

export const useCart = (currentUser: User | null) => {
  const storageKey = currentUser ? `diner_cart_${currentUser.id}` : null;

  // Initialize state ONCE. 
  const [cartMap, setCartMap] = useState<Map<number, CartItem>>(() => {
    if (!storageKey) return new Map();
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch { return new Map(); }
  });

  // Sync to localStorage ONLY when the cart mutates
  useEffect(() => {
    if (storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(cartMap.entries())));
    }
  }, [cartMap, storageKey]);

  const addToCart = (item: CartItem) => {
    setCartMap(prev => {
      const newMap = new Map(prev);
      const id = item.cartId || Date.now();
      newMap.set(id, { ...item, cartId: id });
      return newMap;
    });
  };

  const removeFromCart = (id: number) => {
    setCartMap(prev => { const newMap = new Map(prev); newMap.delete(id); return newMap; });
  };

  const clearCart = () => setCartMap(new Map());
  const cartItems = Array.from(cartMap.values());
  const grandTotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  return { cart: cartItems, addToCart, removeFromCart, clearCart, grandTotal };
};