import type { components } from "./schema";

// ==========================================
// 1. AUTH & ROLE-BASED ACCESS
// ==========================================
export type LoginPayload = components["schemas"]["LoginRequestDTO"];
export type User = Omit<components["schemas"]["UserEntity"], "hashedPassword">;

export type UserRole = NonNullable<User["role"]>;


// ==========================================
// 2. MENU
// ==========================================
export type MenuItem = components["schemas"]["MenuItemEntity"];
export type MenuItemPayload = components["schemas"]["MenuItemRequest"];

export type DishCategory = NonNullable<MenuItem["dishCategory"]>;


// ==========================================
// 3. ORDERS (CREATION & STATUS)
// ==========================================
export type Order = Omit<components["schemas"]["OrderEntity"], "staff"> & {
  staff?: User; 
};
export type OrderItem = components["schemas"]["OrderItemEntity"];

export type CreateOrderPayload = components["schemas"]["CreateOrderRequest"];
export type CreateOrderItemPayload = components["schemas"]["CreateOrderItemRequest"];

export type OrderStatus = NonNullable<Order["status"]>;
export type ItemProgressStatus = NonNullable<OrderItem["progressStatus"]>;


// ==========================================
// 4. KITCHEN DISPLAY SYSTEM (KDS)
// ==========================================
export type KdsQueueOrder = components["schemas"]["OrderResponseDto"];
export type KdsQueueOrderItem = components["schemas"]["OrderItemResponseDto"];

export type KdsAlert = components["schemas"]["KdsAlertDto"];