export type Role = "MANAGER" | "CHEF" | "SERVER" | "CASHIER";
export type KitchenStation =
  | "GRILL"
  | "FRYER"
  | "SALAD"
  | "DESSERT"
  | "BEVERAGE"
  | "PREP"
  | "EXPEDITING"
  | "COLD"
  | "HOT"
  | "PIZZA"
  | "SUSHI"
  | "BBQ"
  | "PASTA"
  | "VEGAN";
export type OrderStatus =
  | "UNPAID"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUED"
  | "CANCELED";
export type Category = "BURGERS" | "PIZZAS" | "DRINKS" | "DESSERTS" | "SALADS";

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CategoryDetails {
  category: Category | "ALL"; // Included "ALL" for the Navbar default state
  label: string;
  icon: React.ReactNode; 
}

export interface MenuItem {
  menuItemId: number;
  name: string;
  category: Category;
  price: number;
  description?: string;
  imageUrl?: string;
  prepTime: number; // in minutes
  isAvailable: boolean;

  kitchenStations: KitchenStation[];
  customizationOptions?: CustomizationOption[]; // Possible customizations for this menu item
}

export interface CustomizationOption {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  menuItem: MenuItem; // Reference to the MenuItem
  orderItemId: number; // Unique identifier for this item in the order
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: CustomizationOption[]; // Customizations selected for this item
  totalPrice: number; // Calculated as (base price + options price) * quantity
}

export interface Order {
  orderId: number;
  tableNumber: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}