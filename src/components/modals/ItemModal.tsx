import React, { useState } from 'react';
import CustomizeModalBase from './BaseModal';
import type { Product, ItemBase, CartItem } from '../../types';
import { TOPPINGS, SAUCES } from '../../data/mockData';

export default function ItemModal({ item, onAdd, onClose }: { item: Product, onAdd: (item: CartItem) => void, onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<ItemBase[]>([]);
  const toggleOption = (opt: ItemBase) => setSelectedOptions(prev => prev.find(o => o.id === opt.id) ? prev.filter(o => o.id !== opt.id) : [...prev, opt]);
  const totalPrice = (item.price + selectedOptions.reduce((acc, curr) => acc + curr.price, 0)) * quantity;

  return <CustomizeModalBase item={item} quantity={quantity} setQuantity={setQuantity} selectedOptions={selectedOptions} toggleOption={toggleOption} totalPrice={totalPrice} toppings={TOPPINGS} sauces={SAUCES} actionLabel="ADD TO CART" onAction={() => onAdd({ ...item, quantity, options: selectedOptions, cartId: Date.now(), total: totalPrice })} onBack={onClose} />;
}