import type { ReactNode } from "react";
import type { DishCategory } from "../types/api"

import {
  CookieIcon,
  CookingPotIcon,
  GlassWaterIcon,
  IceCreamConeIcon,
} from "lucide-react";

export interface CategoryItem {
  id: DishCategory;
  label: string;
  icon: ReactNode;
}

export const categoryItems: CategoryItem[] = [
  {
    id: "APPETIZER",
    label: "Appetizer",
    icon: <CookieIcon size={24} />,
  },
  {
    id: "MAIN_COURSE",
    label: "Main course",
    icon: <CookingPotIcon size={24} />,
  },
  {
    id: "BEVERAGE",
    label: "Beverage",
    icon: <GlassWaterIcon size={24} />,
  },
  {
    id: "DESSERT",
    label: "Dessert",
    icon: <IceCreamConeIcon size={24} />,
  },
] as const;