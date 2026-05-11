import React, { useState } from "react";
import { InputBox, type InputBoxProps } from "../../components"; 

export interface QuantityInputProps extends Omit<InputBoxProps, "value" | "onChange" | "type" | "min" | "max"> {
  value?: string | number;
  min: number; 
  max: number; 
  onChange?: (value: number) => void;
}

export const QuantityInput = ({
  value: externalValue = "",
  min,
  max,
  onChange,
  onBlur,
  ...props 
}: QuantityInputProps) => {
  
  const getValidInitialValue = (val: string | number) => {
    const num = parseInt(String(val), 10);

    if (isNaN(num) || num < min || num <= 0) {
      return String(Math.max(1, min));
    }

    if (num > max) {
      return String(max);
    }
    
    return String(num);
  };

  const [prevExternal, setPrevExternal] = useState(externalValue);
  const [localValue, setLocalValue] = useState(String(externalValue));
  const [lastValidValue, setLastValidValue] = useState(getValidInitialValue(externalValue || min));

  if (externalValue !== prevExternal) {
    setPrevExternal(externalValue);
    setLocalValue(String(externalValue));
    
    const num = parseInt(String(externalValue), 10);
    if (!isNaN(num) && num > 0 && num >= min && num <= max) {
      setLastValidValue(String(externalValue));
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    const numValue = parseInt(newValue, 10);
  
    if (!isNaN(numValue)) {
      if (numValue >= 0 && numValue >= min && numValue <= max) {
        setLastValidValue(newValue);
        onChange?.(numValue); // Valid update
      } else if (numValue > max) {
        // Clamp the parent state to 'max' to prevent massive prices, 
        // even if the user is typing an invalid long string.
        onChange?.(max); 
      } else if (numValue < min) {
        onChange?.(min);
      }
    } else {
      onChange?.(min); // Fallback if they clear the input
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let finalValue = localValue;
    const numValue = parseInt(finalValue, 10);

    if (finalValue.trim() === "" || isNaN(numValue)) {
      finalValue = lastValidValue; 
    } 
    else if (numValue < min || numValue < 0) {
      finalValue = String(Math.max(0, min)); 
    } 
    else if (numValue > max) {
      finalValue = String(max); 
    }

    if (finalValue !== localValue) {
      setLocalValue(finalValue);
      onChange?.(parseInt(finalValue));
    }
    
    onBlur?.(e); 
  };

  return (
    <InputBox
      {...props}
      type="number"
      min={min}
      max={max}
      placeholder={`Valid range: [${min}, ${max}]`}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};