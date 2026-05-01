import React from 'react';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'outline' | 'danger' | 'checkout'; }

export default function Button({ children, variant = 'primary', className = '', ...props }: Props) {
  const v = {
    primary: "bg-primary text-surface hover:bg-opacity-90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-surface",
    danger: "bg-red-500 text-surface hover:bg-opacity-90",
    checkout: "bg-primary text-surface px-10 py-4 rounded-tl-card rounded-br-card text-xl"
  };
  return <button className={`px-8 py-3 rounded-full font-bold transition flex justify-center items-center gap-2 disabled:opacity-50 ${v[variant]} ${className}`} {...props}>{children}</button>;
}