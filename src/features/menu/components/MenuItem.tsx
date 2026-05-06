import { useRef } from "react";
import { gsap } from "gsap";
import { TagIcon, ShoppingCart } from "lucide-react";
import type { MenuItem as MenuItemType } from "@/types";
import { formatCurrency } from "@/utils";
import { DisplayBox } from "@/components";

export interface MenuItemProps {
  item: MenuItemType;
  cartCount?: number;
  onClick: (i: MenuItemType) => void;
}

export const MenuItem = ({ item, cartCount = 0, onClick }: MenuItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onEnter = () => {
    gsap.to(cardRef.current, { y: -10, duration: 0.3 });
    gsap.to(imgRef.current, { y: -35, duration: 0.3 });
    gsap.to(overlayRef.current, { y: -80, opacity: 1, duration: 0.3 });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3 });
    gsap.to(imgRef.current, { y: 0, duration: 0.3 });
    gsap.to(overlayRef.current, { y: 20, opacity: 0, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => onClick(item)}
      className="rounded-tr-card border-4 border-background/80 rounded-bl-card hover:shadow-primary/50 relative flex h-100 w-55 cursor-pointer flex-col justify-between p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="bg-dark rounded-tr-card rounded-bl-card absolute inset-0 flex flex-col justify-between overflow-hidden p-6 shadow-lg">
        <div>
          <h3 className="text-surface mb-1 text-xl font-bold">{item.name}</h3>
          <p className="text-highlight flex items-center gap-1 text-sm font-bold">
            <TagIcon className="text-dark" fill="#ff6b15" size={16} />
            {formatCurrency(item.price)}
          </p>
        </div>

        <img
          src={item.imageUrl}
          ref={imgRef}
          className="absolute bottom-0 scale-160 -rotate-10 rounded-full object-fill"
        />

        <div
          ref={overlayRef}
          className="bg-primary absolute -bottom-20 left-0 flex h-32 w-full translate-y-5 items-center justify-center opacity-0 [clip-path:ellipse(120%_100%_at_50%_100%)]"
        >
          {/* Added a slight margin-top so the icon sits better inside the curve */}
          <ShoppingCart className="text-light mt-2" size={56} />
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full">
        {
          cartCount > 0 && (
            <DisplayBox
              content={cartCount.toString()}
              className="pointer-events-auto absolute top-25 -right-3 px-6 py-1"
            />
          )
        }
      </div>
    </div>
  );
};
