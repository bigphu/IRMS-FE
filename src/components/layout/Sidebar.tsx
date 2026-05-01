import React from 'react';
import { Menu, Hamburger, Pizza, Coffee, IceCream } from 'lucide-react';

export default function Sidebar() {
  const cats = [{ icon: Menu, label: 'All' }, { icon: Hamburger, label: 'Burgers' }, { icon: Pizza, label: 'Pizzas', active: true }, { icon: Coffee, label: 'Drinks' }, { icon: IceCream, label: 'Desserts' }];
  return (
    <div className="w-24 bg-surface flex flex-col items-center py-8 shadow-xl z-10 gap-6 h-screen">
      {cats.map((cat, i) => (
        <div key={i} className={`flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer transition ${cat.active ? 'bg-primary text-surface' : 'text-gray-500 hover:bg-gray-100'}`}>
          <cat.icon size={28} /><span className="text-xs font-bold">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}