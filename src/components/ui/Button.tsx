import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string; // e.g., "full-primary", "outline-danger"
  className?: string;
}

// Safely map all Tailwind classes so the compiler can detect them
const colorStyles: Record<
  string,
  { base: string; full: string; outline: string }
> = {
  primary: {
    base: "hover:shadow-primary/50 hover:ring-primary",
    full: "bg-primary border-transparent text-light hover:bg-primary/80",
    outline:
      "bg-light border-primary text-primary hover:text-primary/80 hover:border-primary/80",
  },
  secondary: {
    base: "hover:shadow-highlight/50 hover:ring-highlight",
    full: "bg-highlight border-transparent text-light hover:bg-highlight/80",
    outline:
      "bg-light border-highlight text-highlight hover:text-highlight/80 hover:border-highlight/80",
  },
  danger: {
    base: "hover:shadow-danger/50 hover:ring-danger",
    full: "bg-danger border-transparent text-light hover:bg-danger/80",
    outline:
      "bg-light border-danger text-danger hover:text-danger/80 hover:border-danger/80",
  },
};

const Button = ({
  children,
  onClick,
  variant,
  className = "",
  ...props
}: ButtonProps) => {
  // Split the variant prop into type and color, defaulting to "full-primary"
  const [variantClass, colorClass] = variant
    ? variant.split("-")
    : ["full", "primary"];

  const safeColor = colorStyles[colorClass] ? colorClass : "primary";
  const safeVariant = variantClass === "outline" ? "outline" : "full";

  const activeStyles = colorStyles[safeColor];

  const sharedBaseStyling =
    "rounded-tr-2xl box-border border-2 rounded-bl-2xl font-medium shadow-md active:scale-95 transition-all hover:ring-2 hover:ring-offset-2";

  const disabledStyles = props.disabled
    ? "cursor-not-allowed opacity-50 hover:ring-0 hover:shadow-none click-events-none"
    : "";
  
  return (
    <button
      onClick={onClick}
      className={`${className} ${sharedBaseStyling} ${activeStyles.base} ${activeStyles[safeVariant]} ${disabledStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
