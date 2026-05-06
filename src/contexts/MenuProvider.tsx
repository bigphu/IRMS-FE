import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { MenuItem, CategoryDetails } from "@/types";
import { MenuContext } from "./MenuContext";
import { useAuthContext } from "./AuthContext";
import { menuService } from "@/services";
import { Categories } from "@/data";

interface MenuProviderProps {
  children: ReactNode;
}

const MenuProvider = ({ children }: MenuProviderProps) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories] = useState<CategoryDetails[]>(Categories);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const isLoading = isAuthLoading || (isAuthenticated && isMenuLoading);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let cancelled = false;

    const fetchMenu = async () => {
      setIsMenuLoading(true);
      try {
        const items = await menuService.getAllMenuItems();
        if (!cancelled) {
          setMenuItems(items);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch menu data", error);
        }
      } finally {
        if (!cancelled) {
          setIsMenuLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading]);

  const value = useMemo(
    () => ({ menuItems, categories, isLoading }),
    [menuItems, categories, isLoading],
  );

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
