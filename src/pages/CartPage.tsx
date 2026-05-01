import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import type { CartItem } from '../types';
import { formatCurrency } from '../utils/formatter';
import ScrollArea from '../components/ui/ScrollArea';
import Button from '../components/ui/Button';
import EditModal from '../components/modals/EditModal';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, grandTotal, removeFromCart, clearCart, addToCart } = useCartContext();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  return (
    <div className="min-h-screen bg-screen p-8">
      <button onClick={() => navigate('/menu')} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80"><ArrowLeft /> Back to Menu</button>
      <div className="flex gap-8 max-w-7xl mx-auto h-[80vh]">
        <div className="w-1/3 bg-surface p-8 rounded-card border-2 border-dashed border-primary h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-2 text-dark">Order Summary</h2>
          <ScrollArea className="flex-1">{cart.map((item, idx) => <div key={idx} className="mb-4 pb-4 border-b border-gray-100"><p className="font-bold text-dark">{item.name} x {item.quantity}</p>{item.options.map(opt => <p key={opt.id} className="text-sm text-primary ml-4">+ {opt.name}</p>)}</div>)}</ScrollArea>
          <div className="mt-4 pt-4 border-t-2 border-dark"><p className="font-bold text-gray-500 mb-2">GRAND TOTAL:</p><p className="text-primary text-3xl font-bold break-words">{formatCurrency(grandTotal)}</p></div>
        </div>

        <div className="w-2/3 bg-surface p-8 rounded-card shadow-lg flex flex-col h-full">
          <ScrollArea className="flex-1 space-y-4 pr-4">
            {cart.length === 0 ? <div className="h-full flex items-center justify-center text-gray-400 font-bold text-xl">Cart is empty</div> : 
              cart.map((item) => (
                <div key={item.cartId} className="flex items-center bg-gray-50 rounded-full p-2 pr-6 border border-gray-200">
                  <div className="bg-dark rounded-l-full rounded-r-[1.5rem] pr-6 pl-2 py-2 flex items-center gap-4 w-1/3"><img src={item.img} className="w-16 h-16 rounded-full object-cover" /></div>
                  <div className="flex-1 px-6"><h4 className="font-bold text-lg text-dark">{item.name}</h4><p className="text-sm text-primary">Base: {formatCurrency(item.price)}</p></div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-gray-600">Qty: {item.quantity}</span><span className="font-bold text-primary w-32 text-right">{formatCurrency(item.total)}</span>
                    <button onClick={() => setEditingItem(item)} className="p-2 bg-primary text-surface rounded hover:bg-opacity-80 transition"><Edit2 size={16}/></button>
                    <button onClick={() => removeFromCart(item.cartId)} className="p-2 bg-red-500 text-surface rounded hover:bg-opacity-80 transition"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))
            }
          </ScrollArea>

          <div className="mt-6 flex justify-between items-end border-t pt-6">
            <p className="font-bold text-gray-500 text-xl">TOTAL ITEMS: <span className="text-primary">{cart.length}</span></p>
            <div className="text-right flex items-center gap-6">
              <span className="text-highlight text-4xl font-bold">{formatCurrency(grandTotal)}</span>
              <Button variant="checkout" onClick={() => { alert('Checkout Success!'); clearCart(); navigate('/menu'); }} disabled={cart.length === 0}>CHECKOUT</Button>
            </div>
          </div>
        </div>
      </div>
      {editingItem && <EditModal cartItem={editingItem} onUpdate={(item) => { addToCart(item); setEditingItem(null); }} onClose={() => setEditingItem(null)} />}
    </div>
  );
}