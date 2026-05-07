// src/data/mockKDSData.ts
import type { Order } from "../types";

export const MOCK_KDS_ORDERS: Order[] = [
  {
    orderId: 1001,
    tableNumber: 12,
    totalPrice: 200000,
    status: "PENDING",
    createdAt: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
    updatedAt: new Date().toISOString(),
    items: [
      {
        orderItemId: 991,
        menuItemId: 2,
        quantity: 1,
        totalPrice: 210000,
        selectedOptions: [{ id: 201, name: "Extra Cheese", price: 30000 }],
        // THE FIX: Nest the food details inside the menuItem property!
          menuItem: {
          menuItemId: 2,
          name: "Pepperoni Pizza",
          category: "MAIN_COURSE",
          price: 180000,
          prepTime: 15,
          isAvailable: true,
          kitchenStations: ["GENERAL"],
          imageUrl: "",
          description: "",
        },
      },
    ],
  },
];
