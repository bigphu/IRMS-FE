import { type ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export interface DisplayBoxProps {
  variant?: string;
  icon?: ReactNode;
  value?: string | number;
  multiline?: boolean;
  label?: string;
}

const variantStyling: Record<string, string> = {
  primary: "text-on-primary font-medium bg-primary border-primary",
  secondary: "text-on-secondary font-medium bg-secondary border-secondary",
  accent: "text-on-accent font-medium bg-accent border-accent",
  danger: "text-on-danger font-medium bg-danger border-danger",
};

export const DisplayBox = ({ variant = "primary", icon, value = "", multiline = false, label }: DisplayBoxProps) => {
  const layoutStyling = multiline 
    ? "items-start break-words whitespace-normal" 
    : "items-center whitespace-nowrap overflow-x-auto no-scrollbar";

  const borderStyling = `rounded-tl-4xl rounded-br-4xl border-2 shadow-md flex ${layoutStyling}`;

  const isLoading = variant.startsWith("loading-");
  const baseVariant = variant.replace("loading-", ""); 
  const safeVariant = variantStyling[baseVariant] ? baseVariant : "primary";
  const colorStyling = variantStyling[safeVariant];

  const labelColor = colorStyling!.split(" ")[0]; 

  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!iconRef.current) return;

    if (isLoading) {
      gsap.to(iconRef.current, { rotate: 360, duration: 2, ease: "none", repeat: -1 });
    } else {
      // Safely kill the infinite tween and reset rotation
      gsap.killTweensOf(iconRef.current);
      gsap.set(iconRef.current, { rotate: 0 });
    }
  }, { dependencies: [isLoading] }); 

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className={`text-sm ${labelColor}`}>
          {label}
        </label>
      )}

      <div className={`w-full px-8 py-3 box-border gap-4 ${colorStyling} ${borderStyling}`}>
        {icon && (
          <div ref={iconRef} className={`shrink-0 ${multiline ? 'mt-1' : ''}`}>
            {icon}
          </div>
        )}
        <span className="w-full">{value}</span>
      </div>
    </div>
  );
};