import type { CustomizationOption as CustomizationOptionType } from "@/types";
import { formatCurrency } from "@/utils";
import { CheckCircle } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export interface CustomizationOptionProps {
  option: CustomizationOptionType;
  isSelected: boolean;
  onToggle: (option: CustomizationOptionType) => void;
}

const CustomizationOption = ({
  option,
  isSelected,
  onToggle,
}: CustomizationOptionProps) => {
  const selectedRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    // GSAP automatically handles context and cleanup inside this block!
    if (selectedRef.current) {
      gsap.to(selectedRef.current, {
        scale: isSelected ? 1 : 0,
        opacity: isSelected ? 1 : 0,
        duration: 0.2,
        ease: "back.out(1.7)",
      });
    }
  }, { dependencies: [isSelected] }); // 3. Pass the dependency array in the config object

  return (
    <div
      onClick={() => onToggle(option)}
      className={`box-border flex min-w-37.5 cursor-pointer items-center gap-4 justify-between rounded-tr-xl rounded-bl-xl border-2 p-3 pt-1 pb-1 shadow-md transition select-none border-background/20 ${
        isSelected ? "bg-emerald-100" : "bg-surface"
      }`}
    >
      <div>
        <p className="text-dark font-semibold">{option.name}</p>
        <p className="text-primary text-sm">
          {option.price > 0 ? '+' : ''}
          {formatCurrency(option.price)}
        </p>
      </div>
      <div className={`flex h-6 w-6 items-center justify-center`}>
        <CheckCircle 
          className="text-primary font-bold" 
          ref={selectedRef} 
          style={{ transform: 'scale(0)', opacity: 0 }} 
        />
      </div>
    </div>
  );
};

export default CustomizationOption;