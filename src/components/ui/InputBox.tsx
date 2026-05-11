import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon?: ReactNode;
  multiline?: boolean;
  rows?: number;
  cols?: number;
  label?: string;
  variant?: "primary" | "secondary" | "accent" | "danger"; // <-- Replaced labelColor with variant
}

// 1. Map the variants to their specific colors for the label, icon, and ring
const variantStyles = {
  primary: {
    label: "text-primary",
    icon: "text-primary",
    ring: "focus-within:ring-primary",
  },
  secondary: {
    label: "text-secondary",
    icon: "text-secondary",
    ring: "focus-within:ring-secondary",
  },
  accent: {
    label: "text-accent",
    icon: "text-accent",
    ring: "focus-within:ring-accent",
  },
  danger: {
    label: "text-danger",
    icon: "text-danger",
    ring: "focus-within:ring-danger",
  },
};

export const InputBox = ({ 
  icon, 
  multiline = false, 
  rows = 3, 
  cols = 3,
  label, 
  variant = "primary", 
  className = "", 
  ...props 
}: InputBoxProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 2. Extract the active variant styles
  const activeVariant = variantStyles[variant];

  const borderStyling = "border-2 rounded-md shadow-md border-secondary";
  // 3. Hardcoded text-secondary for the typed value!
  const colorStyling = "bg-neutral text-secondary"; 
  // 4. Injected the dynamic ring color
  const focusStyling = `focus-within:ring-2 ${activeVariant.ring} ring-offset-2 transition-all`; 
  
  const alignment = multiline ? "items-start" : "items-center";
  const textAlign = icon ? "text-left" : "text-center";
  const sharedInputStyling = `w-full bg-transparent outline-none font-mono font-light placeholder:text-secondary/50 ${textAlign}`;

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      
      {/* 5. Apply the variant label color */}
      {label && (
        <label className={`text-sm font-mono font-bold ${activeVariant.label}`}>
          {label}
        </label>
      )}

      <div className={`box-border flex w-full px-6 py-3 gap-4 ${alignment} ${colorStyling} ${borderStyling} ${focusStyling}`}>
        
        {/* 6. Apply the variant icon color (Lucide icons inherit the text color automatically) */}
        {icon && (
          <div className={`shrink-0 ${activeVariant.icon} ${multiline ? 'mt-1' : ''}`}>
            {icon}
          </div>
        )}

        {multiline ? (
          <textarea
            {...props}
            rows={rows}
            cols={cols}
            className={`${sharedInputStyling} resize-none`} 
          />
        ) : (
          <input
            {...props}
            type={showPassword ? "text" : props.type}
            className={`${sharedInputStyling} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          />
        )}

        {props.type === "password" && !multiline && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`cursor-pointer text-secondary/70 hover:${activeVariant.icon} transition-colors focus:outline-none`}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    </div>
  );
};