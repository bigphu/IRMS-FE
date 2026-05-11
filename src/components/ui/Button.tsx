import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string; // e.g., "full-primary", "outline-danger"
}

// Safely map all Tailwind classes so the compiler can detect them
const colorStyles: Record<
  string,
  { base: string; full: string; outline: string }
> = {
  primary: {
    base: "hover:shadow-primary/50 hover:ring-primary",
    full: "bg-primary border-transparent text-on-primary hover:bg-primary/80",
    outline:
      "bg-neutral border-primary text-primary hover:text-primary/80 hover:border-primary/80",
  },
  accent: {
    base: "hover:shadow-accent/50 hover:ring-accent",
    full: "bg-accent border-transparent text-on-accent hover:bg-accent/80",
    outline:
      "bg-neutral border-accent text-accent hover:text-accent/80 hover:border-accent/80",
  },
  danger: {
    base: "hover:shadow-danger/50 hover:ring-danger",
    full: "bg-danger border-transparent text-on-danger hover:bg-danger/80",
    outline:
      "bg-light border-danger text-danger hover:text-danger/80 hover:border-danger/80",
  },
};

export const Button = ({
  children,
  onClick,
  variant,
  ...props
}: ButtonProps) => {
  // Split the variant prop into type and color, defaulting to "full-primary"
  const [variantClass, colorClass]: string[] = variant
    ? variant.split("-")
    : ["full", "primary"];

  const safeColor = colorStyles[colorClass!] ? colorClass : "primary";
  const safeVariant = variantClass === "outline" ? "outline" : "full";

  const activeStyles = colorStyles[safeColor!];

  const sharedBaseStyling =
    "rounded-tr-2xl box-border border-2 rounded-bl-2xl px-8 py-3 font-medium shadow-md active:scale-95 transition-all hover:ring-2 hover:ring-offset-2";

  const disabledStyles = props.disabled
    ? "cursor-not-allowed opacity-50 hover:ring-0 hover:shadow-none click-events-none"
    : "";

  return (
    <button
      onClick={onClick}
      className={`${sharedBaseStyling} ${activeStyles!.base} ${activeStyles![safeVariant]} ${disabledStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};