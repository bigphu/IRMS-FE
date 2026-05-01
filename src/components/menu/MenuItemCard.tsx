import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatter';

export default function MenuItemCard({ item, onClick }: { item: Product, onClick: (item: Product) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const onEnter = () => { gsap.to(cardRef.current, { y: -10, duration: 0.3 }); gsap.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.3 }); };
  const onLeave = () => { gsap.to(cardRef.current, { y: 0, duration: 0.3 }); gsap.to(overlayRef.current, { y: 20, opacity: 0, duration: 0.3 }); };

  return (
    <div ref={cardRef} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => onClick(item)} className="relative min-w-[260px] h-[380px] bg-dark rounded-tr-card rounded-bl-card p-6 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg">
      <div><h3 className="text-surface text-xl font-bold mb-1">{item.name}</h3><p className="text-highlight font-semibold flex items-center gap-1">🏷️ {formatCurrency(item.price)}</p></div>
      <img src={item.img} className="w-full h-40 object-cover rounded-full mt-4" />
      <div ref={overlayRef} className="absolute bottom-0 left-0 w-full h-24 bg-primary flex items-center justify-center opacity-0 translate-y-5 rounded-bl-card"><ShoppingCart className="text-surface w-10 h-10" /></div>
    </div>
  );
}