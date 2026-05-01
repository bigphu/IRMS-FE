export type Role = 'MANAGER' | 'CHEF' | 'SERVER' | 'CASHIER';
export type KitchenStation = 'OVEN' | 'GRILL' | 'FRY' | 'PREP' | 'BEVERAGE' | 'DESSERT';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
export type ItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface User { 
  id: string; 
  email: string; 
  name: string; 
  role: Role; 
}

export interface AuthResponse { 
  user: User; 
  accessToken: string; 
  refreshToken: string; 
}

export interface ItemBase { 
  id: string | number; 
  name: string; 
  price: number; 
}

export interface Product extends ItemBase { 
  id: number; 
  img: string; 
}

export interface CartItem extends Product { 
  cartId: number; 
  quantity: number; 
  options: ItemBase[]; 
  total: number; 
}

export interface KDSOrderItem { 
  id: string; 
  name: string; 
  quantity: number; 
  options: ItemBase[]; 
  stations: KitchenStation[]; 
  status: ItemStatus; 
}

export interface LiveOrder { 
  orderId: string; 
  tableNumber: string; 
  createdAt: Date; 
  status: OrderStatus; 
  items: KDSOrderItem[]; 
}