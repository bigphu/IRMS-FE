// src/components/ui/InputBox.tsx
import React, { useState } from "react";

// 1. Extend standard input attributes (Omit value/onChange since we handle them custom)
export interface InputBoxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  type?: string;
  content?: string;
  label?: string; // 2. Add label support
  onChange?: (newValue: string) => void;
  className?: string;
  containerClassName?: string;
  min?: number;
}

const InputBox = ({
  type = "text",
  content = "",
  label,
  onChange,
  className = "",
  containerClassName = "",
  min,
  ...props
}: InputBoxProps) => {
  const [localValue, setLocalValue] = useState(content);
  const [fallbackValue, setFallbackValue] = useState(content);
  const [prevContent, setPrevContent] = useState(content);

  if (prevContent !== content) {
    setLocalValue(content);
    setFallbackValue(content);
    setPrevContent(content);
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (content.trim() !== "") {
      setFallbackValue(content);
    }
    props.onFocus?.(e); // Allow parent to still use onFocus
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (
      min !== undefined &&
      (type === "number" || type === "positive-integer")
    ) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue < min) {
        value = min.toString();
      }
    }
    setLocalValue(value);
    onChange?.(value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (localValue.trim() === "") {
      setLocalValue(fallbackValue);
      onChange?.(fallbackValue);
    }
    props.onBlur?.(e); // Allow parent to still use onBlur
  };

  return (
    // 3. Added a wrapper to stack the label and the input box
    <div className={`flex w-full flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={props.id} className="text-primary ml-1 text-sm font-bold">
          {label}
        </label>
      )}

      <div
        className={`bg-light border-primary focus-within:ring-primary box-border flex w-full items-center justify-center rounded-tr-xl rounded-bl-xl border-2 shadow-md ring-offset-2 transition-shadow focus-within:ring-2`}
      >
        <input
          type={type === "positive-integer" ? "number" : type}
          value={localValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          {...props} // 4. This now safely spreads id, placeholder, required, etc!
          className={`text-dark w-full h-full placeholder:text-primary/50 [appearance:textfield] border-0 bg-transparent font-medium outline-none placeholder:font-light focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className} ${label ? "text-left" : "text-center"}`}
        />
      </div>
    </div>
  );
};

export default InputBox;
