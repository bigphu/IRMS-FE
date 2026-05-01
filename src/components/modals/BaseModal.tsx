import React from 'react';
import type { Product, ItemBase } from '../../types';
import { formatCurrency } from '../../utils/formatter';
import Button from '../ui/Button';
import ToppingCheckbox from '../ui/ToppingCheckbox';
import CountDisplayBox from '../ui/CountDisplayBox';
import ScrollArea from '../ui/ScrollArea';

interface Props { item: Product; quantity: number; setQuantity: React.Dispatch<React.SetStateAction<number>>; selectedOptions: ItemBase[]; toggleOption: (opt: ItemBase) => void; totalPrice: number; onAction: () => void; actionLabel: string; onBack: () => void; toppings: ItemBase[]; sauces: ItemBase[]; }

export default function CustomizeModalBase({ item, quantity, setQuantity, selectedOptions, toggleOption, totalPrice, onAction, actionLabel, onBack, toppings, sauces }: Props) {
  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-card w-full max-w-5xl flex overflow-hidden shadow-2xl h-[600px]">
        <div className="w-1/3 bg-dark text-surface p-8 relative rounded-tr-card">
          <h2 className="text-3xl font-bold bg-primary inline-block px-4 py-1 rounded mb-2">TAILOR YOUR</h2><h2 className="text-3xl font-bold px-4">ORDER</h2>
          <img src={item.img} className="absolute bottom-10 -right-20 w-80 h-80 object-cover rounded-full" />
        </div>
        <div className="w-2/3 p-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div><h1 className="text-4xl font-bold text-dark">{item.name}</h1></div>
            <p className="text-2xl font-bold text-highlight">{formatCurrency(item.price)}</p>
          </div>
          <ScrollArea className="flex-1 pr-4">
            <h3 className="font-bold text-lg mb-4 text-dark">Toppings</h3>
            <ScrollArea direction="horizontal" className="pb-4">{toppings.map(t => <ToppingCheckbox key={t.id} item={t} isSelected={selectedOptions.some(o => o.id === t.id)} onToggle={toggleOption} />)}</ScrollArea>
            <h3 className="font-bold text-lg mb-4 mt-4 text-dark">Sauces</h3>
            <ScrollArea direction="horizontal" className="pb-4">{sauces.map(s => <ToppingCheckbox key={s.id} item={s} isSelected={selectedOptions.some(o => o.id === s.id)} onToggle={toggleOption} />)}</ScrollArea>
          </ScrollArea>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <CountDisplayBox count={quantity} onIncrement={() => setQuantity(q => q + 1)} onDecrement={() => setQuantity(q => Math.max(1, q - 1))} />
            <div className="flex items-center gap-6">
              <div className="text-right"><span className="text-gray-500 font-bold mr-2">TOTAL:</span><span className="text-highlight text-2xl font-bold">{formatCurrency(totalPrice)}</span></div>
              <Button variant="outline" onClick={onBack}>BACK</Button><Button variant="primary" onClick={onAction}>{actionLabel}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}