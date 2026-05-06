// src/components/ScrollArea.tsx
import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  scrollbar?: 'hidden' | 'custom';
}

const ScrollArea = ({ 
  children, 
  className = '', 
  direction = 'vertical',
  scrollbar = 'custom'
}: ScrollAreaProps) => {
  
  // FIX: Swapped overflow-y-hidden to overflow-y-auto
  const layoutClass = direction === 'horizontal' 
    ? 'flex overflow-x-auto gap-4' 
    : 'overflow-y-auto overflow-x-visible'; 

  const scrollbarClass = scrollbar === 'hidden' ? 'no-scrollbar' : 'custom-scrollbar';

  return (
    <div className={`${scrollbarClass} ${layoutClass} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollArea;