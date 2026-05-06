// TODO

import React from 'react';
import { OrderItem } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { ScrollArea } from '../../../components/ui/ScrollArea';

export const BillCard = ({ cart, total }: { cart: OrderItem[], total: number }) => (
  <div className="w-1/3 bg-surface p-8 rounded-card border-2 border-dashed border-primary h-full flex flex-col">
    <h2 className="text-2xl font-bold mb-2 text-dark">Order Summary</h2>
    <ScrollArea className="flex-1">
      {cart.map((item) => (
        <div key={item.orderItemId} className="mb-4 pb-4 border-b border-gray-100">
          <p className="font-bold text-dark">{item.name} x {item.quantity}</p>
          {item.selectedOptions?.map(opt => <p key={opt.id} className="text-sm text-primary ml-4">+ {opt.name}</p>)}
        </div>
      ))}
    </ScrollArea>
    <div className="mt-4 pt-4 border-t-2 border-dark">
      <p className="font-bold text-gray-500 mb-2">GRAND TOTAL:</p>
      <p className="text-primary text-3xl font-bold break-words">{formatCurrency(total)}</p>
    </div>
  </div>
);