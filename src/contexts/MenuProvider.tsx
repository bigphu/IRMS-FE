import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { MenuItem, CategoryDetails } from "@/types";
import { MenuContext } from "./MenuContext";
import { menuService } from "@/services";
import { Categories } from "@/data";

interface MenuProviderProps {
  children: ReactNode;
}

const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories] = useState<CategoryDetails[]>(Categories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const items = await menuService.getAllMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, categories, isLoading }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
