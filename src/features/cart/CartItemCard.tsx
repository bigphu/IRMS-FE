import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { CartItem } from "../../store/slices/cartSlice";
import {
  AlertTriangleIcon,
  CircleQuestionMark,
  NotebookTextIcon,
} from "lucide-react";
import { Button } from "../../components";
import { formatCurrency } from "../../utils";
import DishImg from "../../assets/dish.png";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

interface CartItemCardProps {
  cartItem: CartItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const CartItemCard = ({
  cartItem,
  onEdit,
  onDelete,
}: CartItemCardProps) => {
  const { menuItem, quantity, customization, allergyNotes, specialInstructions } = cartItem;
  const itemTotal = quantity * menuItem.price!;

  // 1. Setup Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Define Hover Logic
  const runEnter = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }

    hoverTimer.current = setTimeout(() => {
      gsap.to(cardRef.current, {
        x: -16,
        duration: 0.3,
        transformOrigin: "center center",
        overwrite: true,
        ease: "power2.out",
      });
    }, 50);
  }, []);

  const runLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }

    gsap.to(cardRef.current, {
      x: 0,
      duration: 0.3,
      overwrite: true,
      ease: "power2.out",
    });
  }, []);

  // 3. Define the Exit Animation for Deletion
  const animateOut = useCallback(() => {
    gsap.to(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      x: -1000, // Slide it slightly to the right while fading
      duration: 0.4,
      ease: "back.in(1.2)",
      onComplete: () => {
        onDelete(); // Unmount the component after animation finishes
      }
    });
  }, [onDelete]);

  // 4. Bind GSAP states
  const { contextSafe } = useGSAP(() => {
    gsap.set(containerRef.current, { perspective: 1000 });
    gsap.set(cardRef.current, { transformStyle: "preserve-3d" });
  }, { scope: containerRef });

  const onEnter = () => contextSafe(runEnter)();
  const onLeave = () => contextSafe(runLeave)();
  
  // 5. Wrap the deletion animation safely
  const triggerDelete = () => contextSafe(animateOut)();

  const borderStyling = "border-secondary border-2 hover:ring-primary hover:ring-2 hover:ring-offset-3 shadow-lg";

  return (
    <div
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
      className="w-full h-fit"
    >
      <div 
        ref={cardRef}
        className={`flex w-full h-fit ${borderStyling} justify-between items-stretch rounded-bl-4xl gap-6 rounded-tr-4xl bg-surface p-4`}
      >
        
        <div className="relative w-[30%] shrink-0 overflow-hidden rounded-bl-xl rounded-tr-xl bg-secondary">
          <img
            ref={imgRef}
            src={DishImg}
            className="absolute inset-0 h-full w-full object-cover"
            alt={menuItem.name}
          />
        </div>
        
        <div className="flex flex-1 min-w-0 flex-col justify-center gap-1 py-2">
          
          <div className="flex flex-col justify-center gap-0 flex-1 min-w-0 overflow-hidden">
            <h3 className="flex items-baseline gap-2 truncate text-3xl text-on-surface">
              <span>{menuItem.name}</span>
              <span className="text-lg text-on-surface/50">
                {`#${cartItem.cartItemId}`}
              </span>
            </h3>
            <p className="text-lg text-primary">
              {formatCurrency(menuItem.price!)}{" "}
              <span className="text-on-surface/50">x {quantity}</span>
            </p>
          </div>

          {(allergyNotes || customization || specialInstructions) && (
            <div className="flex w-full overflow-hidden gap-1.5 flex-col text-sm font-mono italic mt-1 border-t-2 border-secondary/10 pt-2">
              {allergyNotes && (
                <p className="truncate text-danger/80 flex gap-2 items-center">
                  <AlertTriangleIcon size={16} />
                  {allergyNotes}
                </p>
              )}
              {customization && (
                <p className="truncate text-primary/80 flex gap-2 items-center">
                  <NotebookTextIcon size={16} />
                  {customization}
                </p>
              )}
              {specialInstructions && (
                <p className="truncate text-primary/80 flex gap-2 items-center">
                  <CircleQuestionMark size={16} />
                  {specialInstructions}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end justify-center gap-3 border-l-2 border-secondary/10 pl-6 pr-2">
          <span className="font-display text-3xl text-primary">
            {formatCurrency(itemTotal)}
          </span>

          <div className="flex gap-2">
            <Button onClick={onEdit}>
              <PencilIcon size={18} />
            </Button>

            {/* 6. Change onClick to our new triggerDelete function */}
            <Button onClick={triggerDelete} variant="outline-danger">
              <Trash2Icon size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};