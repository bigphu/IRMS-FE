export type Role = "MANAGER" | "CHEF" | "SERVER" | "CASHIER";
export type KitchenStation =
  | "GRILL"
  | "FRYER"
  | "DESSERT"
  | "BEVERAGE"
  | "SALAD"
  | "GENERAL";
export type OrderStatus =
  | "UNPAID"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUED"
  | "CANCELED";
export type Category = "APPETIZER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE";

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
  category: Category | "ALL";
  label: string;
  icon: React.ReactNode;
}

export interface CustomizationOption {
  id: number;
  name: string;
  price: number;
}

export interface MenuItem {
  menuItemId: number;
  name: string;
  category: Category;
  price: number;
  description?: string;
  imageUrl?: string;
  prepTime: number;
  isAvailable: boolean;
  kitchenStations: KitchenStation[];
  customizationOptions?: CustomizationOption[];
}

export interface OrderItem {
  menuItemId: number;
  menuItem?: MenuItem;
  name?: string;
  orderItemId: number;
  quantity: number;
  specialInstructions?: string;
  selectedOptionIds?: number[];
  selectedOptions?: CustomizationOption[];
  totalPrice: number;
  status?: "PENDING" | "COOKING" | "READY" | "COMPLETED" | "CANCELED";
}

export interface Order {
  orderId: number;
  tableNumber: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

export interface ItemBase {
  id: string;
  name: string;
  price: number;
}

export interface LiveOrderItem {
  id: string;
  name: string;
  quantity: number;
  options: any[];
  stations: string[];
  status: string;
}

export interface LiveOrder {
  orderId: string;
  tableNumber: string;
  createdAt: Date;
  status: string;
  items: LiveOrderItem[];
}
