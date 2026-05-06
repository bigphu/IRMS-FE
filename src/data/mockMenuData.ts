import { CrabstickCocktail, PepperoniPizza, BaconCheeseBurger } from '@/assets';
import type { MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  { 
    menuItemId: 1, 
    name: 'Crabstick Cocktail Pizza', 
    category: 'PIZZAS', // Updated to match Category type
    price: 179000, 
    description: 'An innovative pizza topped with crabstick cocktail, mozzarella, and a blend of herbs, offering a unique seafood twist on a classic favorite.',
    imageUrl: CrabstickCocktail,
    prepTime: 12,
    isAvailable: true,
    kitchenStations: ['PREP', 'PIZZA'],
    customizationOptions: [
      { id: 101, name: 'Extra Cheese', price: 20000 },
      { id: 102, name: 'No Onions', price: 0 },
      { id: 103, name: 'Add Olives', price: 15000 },
      { id: 104, name: 'Remove Mushrooms', price: 0 },
      { id: 105, name: 'Gluten-Free Crust', price: 25000 },
      { id: 106, name: 'Double Toppings', price: 30000 },
      { id: 107, name: 'Spicy Sauce', price: 5000 },
      { id: 108, name: 'Extra Crabstick', price: 40000 },
      { id: 109, name: 'Vegan Cheese', price: 25000 },
      { id: 110, name: 'Add Pineapple', price: 15000 },
      { id: 111, name: 'Remove Cheese', price: -20000 },
      { id: 112, name: 'Add Bacon', price: 35000 },
      { id: 113, name: 'No Sauce', price: -5000 },
      { id: 114, name: 'Add Jalapenos', price: 10000 },
      { id: 115, name: 'Extra Mozzarella', price: 20000 },
    ]
  },
  { 
    menuItemId: 2, 
    name: 'Pepperoni Pizza', 
    category: 'PIZZAS', // Updated to match Category type
    price: 179000, 
    description: 'A classic pepperoni pizza with a crispy crust and melted mozzarella.',
    imageUrl: PepperoniPizza,
    prepTime: 10,
    isAvailable: true,
    kitchenStations: ['PIZZA'],
    customizationOptions: [
      { id: 201, name: 'Extra Cheese', price: 20000 },
      { id: 203, name: 'Extra Pepperoni', price: 35000 }
    ]
  },
  {
    menuItemId: 3,
    name: 'Classic Cheeseburger',
    category: 'BURGERS', // Updated to match Category type
    price: 120000,
    description: 'A delicious classic cheeseburger with a juicy patty and fresh vegetables.',
    imageUrl: BaconCheeseBurger,
    prepTime: 8,
    isAvailable: true,
    kitchenStations: ['GRILL', 'PREP'],
    customizationOptions: [
      { id: 301, name: 'Extra Patty', price: 40000 },
      { id: 302, name: 'No Pickles', price: 0 }
    ]
  }
];