import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { MenuItem } from "../../types/api";

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions: string;
  allergyNotes: string;
  customization: string;
}

interface CartState {
  items: CartItem[];
  tableId: number | null;
};

const loadCartFromStorage = (): CartState => {
  try {
    const serializedCart = localStorage.getItem("irms_cart");
    if (serializedCart === null) {
      return { items: [], tableId: null }; // Default empty state
    }
    return JSON.parse(serializedCart) as CartState;
  } catch (error) {
    console.warn("Failed to load cart from storage", error);
    return { items: [], tableId: null };
  }
};

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTableId: (state, action: PayloadAction<number>) => {
      state.tableId = action.payload;
    },
    addToCart: {
      prepare: (payload: Omit<CartItem, "cartItemId">) => {
        return {
          payload: {
            ...payload,
            cartItemId: nanoid(),
          },
        };
      },
      reducer: (state, action: PayloadAction<CartItem>) => {
        state.items.push(action.payload);
      },
    },
    updateCartItem: (state, action: PayloadAction<{ cartItemId: string; update: CartItem}>) => {
      const index = state.items.findIndex(item => item.cartItemId === action.payload.cartItemId);
      if (index !== -1) {
        state.items[index] = action.payload.update;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.cartItemId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.tableId = null;
    }
  }
})

export const { setTableId, addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;