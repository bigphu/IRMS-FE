import { createContext, useContext } from "react";
import type { MenuItem, CustomizationOption } from "@/types";

interface ItemContextType {
  item: MenuItem;
  orderItemId?: number;
  quantity: number;
  setQuantity: (newQuantity: number) => void;
  opts: CustomizationOption[]; // Keep hydrated for UI rendering
  handleToggleOption: (option: CustomizationOption) => void;
  totalPrice: number;
}

export const ItemContext = createContext<ItemContextType | null>(null);

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within an ItemContext.Provider");
  }
  return context;
};