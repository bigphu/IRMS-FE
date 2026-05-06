import {
  MenuSquareIcon,
  HamburgerIcon,
  PizzaIcon,
  GlassWaterIcon,
  IceCreamIcon,
  SaladIcon,
} from "lucide-react";
import type { CategoryDetails } from "@/types";

// Exported array for the Navbar to map over
const CATEGORY_DETAILS: CategoryDetails[] = [
  { category: "ALL", label: "All", icon: <MenuSquareIcon size={24} /> },
  { category: "BURGERS", label: "Burgers", icon: <HamburgerIcon size={24} /> },
  { category: "PIZZAS", label: "Pizzas", icon: <PizzaIcon size={24} /> },
  { category: "DRINKS", label: "Drinks", icon: <GlassWaterIcon size={24} /> },
  { category: "DESSERTS", label: "Desserts", icon: <IceCreamIcon size={24} /> },
  { category: "SALADS", label: "Salads", icon: <SaladIcon size={24} /> },
];

export default CATEGORY_DETAILS;