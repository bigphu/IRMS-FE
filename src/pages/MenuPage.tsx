import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../data/mockData';
import type { Product, CartItem } from '../types';
import { formatCurrency } from '../utils/formatter';
import Sidebar from '../components/layout/Sidebar';
import MenuItemCard from '../components/menu/MenuItemCard';
import ItemModal from '../components/modals/ItemModal';
import ScrollArea from '../components/ui/ScrollArea';
import Button from '../components/ui/Button';

export default function MenuPage() {
  const navigate = useNavigate();
  const { cart, addToCart, grandTotal } = useCartContext();
  const { logout } = useAuth();
  const [addingItem, setAddingItem] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 flex flex-col relative">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-4xl font-bold text-dark tracking-widest">D I N E R</h1>
          <Button variant="outline" onClick={logout}><LogOut size={18} /> Logout</Button>
        </div>

        <ScrollArea direction="horizontal" className="pb-10 flex-1">
          {MENU_ITEMS.map(item => <MenuItemCard key={item.id} item={item} onClick={setAddingItem} />)}
        </ScrollArea>

        {cart.length > 0 && (
          <div className="absolute bottom-8 right-8 bg-surface p-4 rounded-full shadow-2xl flex items-center gap-6 border-2 border-primary z-40">
             <div className="text-right"><p className="text-sm font-bold text-gray-500">TOTAL</p><p className="text-highlight font-bold text-xl">{formatCurrency(grandTotal)}</p></div>
             <Button variant="primary" onClick={() => navigate('/cart')}>VIEW CART <span className="bg-surface text-primary px-2 py-1 rounded-full text-sm">{cart.length}</span></Button>
          </div>
        )}
        {addingItem && <ItemModal item={addingItem} onAdd={(item) => { addToCart(item); setAddingItem(null); }} onClose={() => setAddingItem(null)} />}
      </div>
    </div>
  );
}