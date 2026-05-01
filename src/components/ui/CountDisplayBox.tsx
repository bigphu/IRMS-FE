import React from 'react';
import { Plus, Minus } from 'lucide-react';
export default function CountDisplayBox({ count, onIncrement, onDecrement, min = 1 }: { count: number, onIncrement: ()=>void, onDecrement: ()=>void, min?: number }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={onDecrement} disabled={count <= min} className="bg-primary text-surface p-2 rounded-full disabled:opacity-50"><Minus size={20} /></button>
      <span className="text-xl font-bold w-12 text-center border-2 border-gray-200 rounded-full px-4 py-1 text-dark">{count}</span>
      <button onClick={onIncrement} className="bg-primary text-surface p-2 rounded-full"><Plus size={20} /></button>
    </div>
  );
}