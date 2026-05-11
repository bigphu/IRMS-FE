import { type ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger outside the component lifecycle
gsap.registerPlugin(ScrollTrigger);

interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal";
}

export const ScrollArea = ({
  children,
  className = "",
  direction = "vertical",
}: ScrollAreaProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scrollContainerRef.current || !thumbRef.current) return;

      // 1. Initial resting state (Switched to standard CSS "left center")
      gsap.set(thumbRef.current, {
        scaleY: direction === "vertical" ? 0 : 1,
        scaleX: direction === "horizontal" ? 0 : 1,
        transformOrigin:
          direction === "vertical" ? "top center" : "left center",
      });

      // 2. Map precisely to the maximum scrollable distance
      gsap.to(thumbRef.current, {
        scaleY: direction === "vertical" ? 1 : undefined,
        scaleX: direction === "horizontal" ? 1 : undefined,
        ease: "none",
        scrollTrigger: {
          scroller: scrollContainerRef.current,
          horizontal: direction === "horizontal",

          // FIX: Start exactly at absolute scroll 0
          start: 0,

          // FIX: "max" forces GSAP to map 100% scale to the exact maximum scroll distance of the scroller
          end: "max",

          // FIX: 1:1 instantaneous mapping so it doesn't linger or fall behind fast scrolls
          scrub: true,
        },
      });

      // 3. Recalculate GSAP bounds if images load or layout shifts
      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      resizeObserver.observe(scrollContainerRef.current);
      if (contentRef.current) resizeObserver.observe(contentRef.current);

      // Cleanup observer on unmount
      return () => resizeObserver.disconnect();
    },
    { dependencies: [direction] },
  );

  const overflowClass =
    direction === "horizontal"
      ? "flex overflow-x-auto gap-4"
      : "overflow-y-auto overflow-x-visible";

  // CHANGED: Centered using translate, made thinner (3px), and shorter (1/3 of the container)
  const scrollbarClasses =
    direction === "vertical"
      ? "right-[2%] top-1/2 -translate-y-1/2 w-[4px] h-1/4"
      : "bottom-[2%] left-1/2 -translate-x-1/2 h-[4px] w-1/4";

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Scrollable Viewport Container */}
      <div
        ref={scrollContainerRef}
        className={`no-scrollbar scroll-smooth h-full w-full ${overflowClass}`}
      >
        <div
          ref={contentRef}
          className={direction === "horizontal" ? "h-fit pb-10 flex min-w-max" : "min-h-full pr-10 flex flex-col"}
        >
          {children}
        </div>
      </div>

      {/* Indicator Track */}
      <div
        className={`absolute z-50 overflow-hidden bg-secondary/10 rounded-tr-sm rounded-bl-sm ${scrollbarClasses}`}
      >
        {/* Indicator Thumb */}
        <div
          ref={thumbRef}
          className="w-full h-full bg-primary rounded-tr-sm rounded-bl-sm will-change-transform"
        />
      </div>
    </div>
  );
};
