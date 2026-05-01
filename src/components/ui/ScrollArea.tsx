import React from 'react';
export default function ScrollArea({ children, className = '', direction = 'vertical' }: { children: React.ReactNode, className?: string, direction?: 'vertical'|'horizontal' }) {
  return <div className={`no-scrollbar ${direction === 'horizontal' ? 'flex overflow-x-auto gap-4' : 'overflow-y-auto'} ${className}`}>{children}</div>;
}