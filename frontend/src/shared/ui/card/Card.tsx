// shared/ui/card.tsx
'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = ({ 
  children, 
  className = '',
  ...props 
}: CardProps) => {
  return (
    <div 
      className={`bg-gray-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ 
  children, 
  className = '',
  ...props 
}: CardHeaderProps) => {
  return (
    <div 
      className={`flex flex-col space-y-1.5 pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ 
  children, 
  className = '',
  ...props 
}: CardTitleProps) => {
  return (
    <h3 
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ 
  children, 
  className = '',
  ...props 
}: CardContentProps) => {
  return (
    <div 
      className={`pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};