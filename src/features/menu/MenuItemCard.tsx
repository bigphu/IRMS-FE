import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TagIcon, ShoppingCart, Clock4Icon } from "lucide-react";
import type { MenuItem as MenuItemType } from "../../types/api";
import { formatCurrency, formatDuration } from "../../utils";

import DishImg from "../../assets/dish.png";

gsap.registerPlugin(useGSAP);

export interface MenuItemProps {
  item: MenuItemType;
  onClick: () => void;
  forceHover?: boolean;
}

const formatMinute = (minutes: number) => {
  const start = new Date(0).toISOString();
  const end = new Date(minutes * 60 * 1000).toISOString();
  return formatDuration(start, end);
};

export const MenuItemCard = ({
  item,
  onClick,
  forceHover = false,
}: MenuItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Raw animation logic defined safely inside useCallback
  const runEnter = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }

    hoverTimer.current = setTimeout(() => {
      gsap.to(cardRef.current, {
        y: -10,
        z: 60,
        rotationY: 10,
        duration: 0.3,
        overwrite: true,
        ease: "power2.out",
      });

      gsap.to(imgRef.current, {
        y: -60,
        scale: 1.7,
        duration: 0.3,
        overwrite: true,
        ease: "back.out(1.5)",
      });

      gsap.to(overlayRef.current, {
        y: -80,
        opacity: 1,
        duration: 0.4,
        overwrite: true,
        ease: "expo.inOut",
      });
    }, 100);
  }, []);

  const runLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }

    gsap.to(cardRef.current, {
      y: 0,
      z: 0,
      // rotationX: 0,
      rotationY: 0,
      duration: 0.3,
      overwrite: true,
      ease: "power2.out",
    });

    gsap.to(imgRef.current, {
      y: 0,
      scale: 1.6,
      duration: 0.3,
      overwrite: true,
      ease: "back.in(1.5)",
    });

    gsap.to(overlayRef.current, {
      y: 0,
      opacity: 0,
      duration: 0.4,
      overwrite: true,
      ease: "expo.inOut",
    });
  }, []);

  // 2. useGSAP effect correctly manages initial states and forceHover
  const { contextSafe } = useGSAP(() => {
    gsap.set(containerRef.current, { perspective: 1000 });
    gsap.set(cardRef.current, { transformStyle: "preserve-3d" });

    if (forceHover) {
      runEnter();
    } else {
      runLeave();
    }
  }, { scope: containerRef, dependencies: [forceHover, runEnter, runLeave] });

  // 3. contextSafe is invoked INSIDE the event handlers, bypassing ESLint warnings
  const onEnter = () => {
    if (forceHover) return;
    contextSafe(runEnter)();
  };

  const onLeave = () => {
    if (forceHover) return;
    contextSafe(runLeave)();
  };

  const cardShape = "rounded-tr-4xl rounded-bl-4xl";
  const cardDimensions = "h-100 w-55 relative";

  return (
    <div
      ref={containerRef}
      className={`${cardShape} ${cardDimensions}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
    >
      <div
        ref={cardRef}
        onClick={() => onClick()}
        className={`${cardShape} ${cardDimensions} border-4 border-primary/20 hover:shadow-primary/50 cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-xl`}
      >
        <div
          className={`${cardShape} px-4 py-6 bg-secondary absolute inset-0 flex flex-col justify-between overflow-hidden`}
        >
          <div className="flex flex-col gap-2 z-10">
            <h3 className="text-on-secondary text-2xl">
              {item.name}
            </h3>
            <p className="text-accent flex items-center gap-2 text-md font-bold font-mono">
              <TagIcon className="text-dark" fill="#f5a623" size={18} />
              {formatCurrency(item.price!)}
            </p>
            <p className="text-on-secondary flex items-center gap-2 text-sm font-bold font-mono">
              <Clock4Icon className="text-dark" size={18} />
              {formatMinute(item.estimatedPrepMinutes!)}
            </p>
          </div>

          <img
            src={DishImg}
            ref={imgRef}
            className="absolute top-1/2 scale-160 -rotate-10 rounded-full object-fill z-0"
          />

          <div
            ref={overlayRef}
            className="bg-primary absolute -bottom-20 left-0 flex h-32 w-full translate-y-5 items-center justify-center opacity-0 [clip-path:ellipse(120%_100%_at_50%_100%)]"
          >
            <ShoppingCart className="text-on-secondary mt-2" size={56} />
          </div>
        </div>
      </div>
    </div>
  );
};