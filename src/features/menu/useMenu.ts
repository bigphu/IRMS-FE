import type { DishCategory } from "../../types/api";
import { fetchMenuByCategory } from "../../api/menu";
import { useQueries } from "@tanstack/react-query";

// export const categories: DishCategory[] = ["APPETIZER", "MAIN_COURSE", "BEVERAGE", "DESSERT"];

export const useMenu = (categories: DishCategory[]) => {
  return useQueries({
    queries: categories.map((cat) => ({
      queryKey: ["menu", cat],
      queryFn: () => fetchMenuByCategory(cat),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
    }))
  });
}