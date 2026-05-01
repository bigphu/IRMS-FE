import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChefHat, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { LiveOrder, ItemStatus, OrderStatus } from '../types';
import { MOCK_LIVE_ORDERS } from '../data/mockKdsData';
import ScrollArea from '../components/ui/ScrollArea';

export default function KDSPage() {
  const [orders, setOrders] = useState<LiveOrder[]>(MOCK_LIVE_ORDERS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout } = useAuth();

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(timer); }, []);
  const getElapsedTime = (createdAt: Date) => `${Math.floor((currentTime.getTime() - createdAt.getTime()) / 60000)}m`;

  const cycleItemStatus = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.orderId !== orderId) return order;
      const updatedItems = order.items.map(item => {
        if (item.id !== itemId) return item;
        const next: Record<ItemStatus, ItemStatus> = { 'PENDING': 'IN_PROGRESS', 'IN_PROGRESS': 'COMPLETED', 'COMPLETED': 'PENDING' };
        return { ...item, status: next[item.status] };
      });
      const allCompleted = updatedItems.every(i => i.status === 'COMPLETED');
      const anyInProgress = updatedItems.some(i => i.status !== 'PENDING');
      return { ...order, items: updatedItems, status: allCompleted ? 'READY' : anyInProgress ? 'PREPARING' : 'PENDING' };
    }));
  };

  const markOrderReady = (orderId: string) => setOrders(orders.filter(order => order.orderId !== orderId));

  return (
    <div className="min-h-screen bg-screen flex flex-col">
      <header className="bg-dark text-surface p-6 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-4"><ChefHat size={32} className="text-highlight" /><div><h1 className="text-2xl font-bold">KITCHEN DISPLAY SYSTEM</h1><p className="text-gray-400 text-sm">Active Stations: OVEN, PREP</p></div></div>
        <div className="flex items-center gap-6">
           <div className="text-right"><p className="font-bold text-xl">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p><p className="text-primary font-bold">Active Tickets: {orders.filter(o => o.status !== 'READY').length}</p></div>
           <button onClick={logout} className="bg-red-500 p-3 rounded-xl hover:bg-opacity-80 transition"><LogOut size={24} /></button>
        </div>
      </header>
      <ScrollArea direction="horizontal" className="flex-1 p-8 gap-8 items-start">
        {orders.map(order => (
          <div key={order.orderId} className={`min-w-[400px] bg-surface rounded-card border-4 flex flex-col h-full max-h-[80vh] shadow-xl transition-colors ${order.status === 'READY' ? 'border-primary' : order.status === 'PREPARING' ? 'border-highlight' : 'border-gray-300'}`}>
            <div className={`p-4 rounded-t-[2.75rem] flex justify-between items-center text-surface ${order.status === 'READY' ? 'bg-primary' : order.status === 'PREPARING' ? 'bg-highlight' : 'bg-gray-800'}`}>
              <div><h2 className="text-2xl font-bold">#{order.orderId}</h2><p className="font-semibold text-surface/80">{order.tableNumber}</p></div>
              <div className="flex items-center gap-2 bg-dark/20 px-3 py-1 rounded-lg"><Clock size={20} /><span className="font-bold text-xl">{getElapsedTime(order.createdAt)}</span></div>
            </div>
            <ScrollArea className="flex-1 p-6 space-y-4">
              {order.items.map(item => (
                <div key={item.id} onClick={() => cycleItemStatus(order.orderId, item.id)} className={`border-b-2 border-dashed border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 transition rounded p-2 select-none ${item.status === 'COMPLETED' ? 'opacity-50 line-through' : ''}`}>
                  <div className="flex justify-between items-start mb-2 text-dark"><p className="font-bold text-xl"><span className="text-primary mr-2">{item.quantity}x</span> {item.name}</p><span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'PENDING' ? 'bg-gray-200 text-gray-600' : item.status === 'IN_PROGRESS' ? 'bg-highlight text-surface' : 'bg-primary text-surface'}`}>{item.status.replace('_', ' ')}</span></div>
                  {item.options.length > 0 && <div className="ml-8 mb-2">{item.options.map(opt => <p key={opt.id} className="text-highlight font-semibold text-sm">+ {opt.name}</p>)}</div>}
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-card">
              <button onClick={() => markOrderReady(order.orderId)} className={`w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition ${order.status === 'READY' ? 'bg-primary text-surface' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>{order.status === 'READY' ? <><CheckCircle2 /> ORDER READY</> : 'BUMP ORDER'}</button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}