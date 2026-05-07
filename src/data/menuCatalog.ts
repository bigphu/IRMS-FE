/**
 * Maps backend MenuItemEntity to frontend MenuItem type
 */

import type { MenuItem } from "@/types";

export type DishCategory = "APPETIZER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE";

export interface BackendMenuItem {
  id?: number;
  name: string;
  price: number;
  dishCategory: DishCategory;
  description?: string;
  stations?: string[];
  estimatedPrepMinutes?: number;
  isAvailable?: boolean;
}

/**
 * Image URLs mapped by dish name for a more realistic presentation.
 * Using Unsplash API and free food image URLs.
 */
const DISH_IMAGES: Record<string, string> = {
  "Crabstick Cocktail Pizza":
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
  "Pepperoni Pizza":
    "https://images.unsplash.com/photo-1628840042765-356cda07f337?w=400&h=300&fit=crop",
  "Bacon Cheese Burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "Crispy Fries":
    "https://images.unsplash.com/photo-1573080496104-febf75cf11ff?w=400&h=300&fit=crop",
  "Caesar Salad":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  "Chocolate Lava Cake":
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  "Fresh Lemonade":
    "https://images.unsplash.com/photo-1578520494395-f4aa41d1d328?w=400&h=300&fit=crop",
};

/**
 * Category-based default images in case item-specific image not found
 */
const CATEGORY_DEFAULT_IMAGES: Record<DishCategory, string> = {
  APPETIZER:
    "https://images.unsplash.com/photo-1555939594-58d7cb561849?w=400&h=300&fit=crop",
  MAIN_COURSE:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  DESSERT:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  BEVERAGE:
    "https://images.unsplash.com/photo-1578520494395-f4aa41d1d328?w=400&h=300&fit=crop",
};

/**
 * Maps backend StationType to frontend KitchenStation
 */
const stationMap: Record<string, string> = {
  GRILL: "GRILL",
  FRYER: "FRYER",
  DESSERT: "DESSERT",
  BEVERAGE: "BEVERAGE",
  SALAD: "SALAD",
  GENERAL: "GENERAL",
};

export const mapBackendMenuItem = (item: BackendMenuItem): MenuItem => {
  const imageUrl =
    DISH_IMAGES[item.name] ||
    CATEGORY_DEFAULT_IMAGES[item.dishCategory] ||
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop";

  const stations = (item.stations || []).map(
    (s: string) => (stationMap[s] as any) || s,
  );

  return {
    menuItemId: item.id || 0,
    name: item.name,
    category: item.dishCategory as any,
    price: item.price,
    description: item.description || "",
    imageUrl,
    prepTime: item.estimatedPrepMinutes || 10,
    isAvailable: item.isAvailable !== false,
    kitchenStations: stations,
    customizationOptions: [],
  };
};
