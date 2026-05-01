import type { LiveOrder } from '../types';

export const MOCK_LIVE_ORDERS: LiveOrder[] = [
  {
    orderId: "ORD-001", tableNumber: "T-12", createdAt: new Date(Date.now() - 1000 * 60 * 5), status: 'PREPARING',
    items: [{ id: "i1", name: "Pepperoni", quantity: 1, options: [{ id: 't1', name: 'Extra Cheese', price: 0 }], stations: ['PREP', 'OVEN'], status: 'IN_PROGRESS' }]
  }
];