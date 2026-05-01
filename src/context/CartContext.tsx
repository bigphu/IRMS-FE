import React, { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from './AuthContext';

const CartContext = createContext<ReturnType<typeof useCart> | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const cartData = useCart(currentUser); // Injects user for namespaced local storage
  
  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
}

// Suppress the Vite Fast Refresh warning for this specific hook export
// eslint-disable-next-line react-refresh/only-export-components
export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
};