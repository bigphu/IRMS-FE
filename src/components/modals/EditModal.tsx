import React, { useState } from 'react';
import CustomizeModalBase from './BaseModal';
import type { CartItem, ItemBase } from '../../types';
import { TOPPINGS, SAUCES } from '../../data/mockData';

export default function EditModal({ cartItem, onUpdate, onClose }: { cartItem: CartItem, onUpdate: (item: CartItem) => void, onClose: () => void }) {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [selectedOptions, setSelectedOptions] = useState<ItemBase[]>(cartItem.options);
  const toggleOption = (opt: ItemBase) => setSelectedOptions(prev => prev.find(o => o.id === opt.id) ? prev.filter(o => o.id !== opt.id) : [...prev, opt]);
  const totalPrice = (cartItem.price + selectedOptions.reduce((acc, curr) => acc + curr.price, 0)) * quantity;

  return <CustomizeModalBase item={cartItem} quantity={quantity} setQuantity={setQuantity} selectedOptions={selectedOptions} toggleOption={toggleOption} totalPrice={totalPrice} toppings={TOPPINGS} sauces={SAUCES} actionLabel="UPDATE CART" onAction={() => onUpdate({ ...cartItem, quantity, options: selectedOptions, total: totalPrice })} onBack={onClose} />;
}