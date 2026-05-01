import type { Product, ItemBase, LiveOrder } from '../types';

export const MENU_ITEMS: Product[] = [
  { id: 1, name: 'Crabstick Cocktail', price: 179000, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Pepperoni', price: 179000, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Seafood Deluxe', price: 179000, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60' },
];
export const TOPPINGS: ItemBase[] = [{ id: 't1', name: 'Salami', price: 1000000 }, { id: 't2', name: 'Pineapple', price: 1000000 }];
export const SAUCES: ItemBase[] = [{ id: 's1', name: 'Yogurt', price: 1000000 }];

export const MOCK_LIVE_ORDERS: LiveOrder[] = [
  { orderId: "ORD-001", tableNumber: "T-12", createdAt: new Date(Date.now() - 300000), status: 'PREPARING', items: [{ id: "i1", name: "Pepperoni", quantity: 1, options: [], stations: ['PREP', 'OVEN'], status: 'IN_PROGRESS' }] }
];