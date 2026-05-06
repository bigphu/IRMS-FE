import { createContext, useContext } from "react";
import type { MenuItem, CategoryDetails } from "@/types";

interface MenuContextType {
  menuItems: MenuItem[];
  categories: CategoryDetails[];
  isLoading: boolean;
}

export const MenuContext = createContext<MenuContextType | null>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenuContext must be used within a MenuProvider");
  return context;
};