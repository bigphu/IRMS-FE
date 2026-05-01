import React from 'react';
import type { ItemBase } from '../../types';
import { formatCurrency } from '../../utils/formatter';

export default function ToppingCheckbox({ item, isSelected, onToggle }: { item: ItemBase, isSelected: boolean, onToggle: (i: ItemBase)=>void }) {
  return (
    <div onClick={() => onToggle(item)} className={`min-w-[150px] border-2 rounded-xl p-3 cursor-pointer transition select-none flex justify-between items-center ${isSelected ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
      <div><p className="font-semibold text-dark">{item.name}</p><p className="text-primary text-sm">+ {formatCurrency(item.price)}</p></div>
      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>{isSelected && <span className="text-surface text-xs">✓</span>}</div>
    </div>
  );
}