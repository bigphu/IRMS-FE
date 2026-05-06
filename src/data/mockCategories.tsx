import {
  MenuSquareIcon,
  AppleIcon,
  UtensilsCrossedIcon,
  IceCreamIcon,
  GlassWaterIcon,
} from "lucide-react";
import type { CategoryDetails } from "@/types";

// Exported array for the Navbar to map over
const CATEGORY_DETAILS: CategoryDetails[] = [
  { category: "ALL", label: "All", icon: <MenuSquareIcon size={24} /> },
  { category: "APPETIZER", label: "Appetizers", icon: <AppleIcon size={24} /> },
  { category: "MAIN_COURSE", label: "Main Course", icon: <UtensilsCrossedIcon size={24} /> },
  { category: "DESSERT", label: "Desserts", icon: <IceCreamIcon size={24} /> },
  { category: "BEVERAGE", label: "Beverages", icon: <GlassWaterIcon size={24} /> },
];

export default CATEGORY_DETAILS;