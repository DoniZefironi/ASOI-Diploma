'use client';

import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ 
  children, 
  className = '',
  ...props 
}: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};