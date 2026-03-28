'use client';

import { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------
// Card — GitHub-style panel with border + canvas-overlay bg
// ---------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** Remove padding from card body */
  noPadding?: boolean;
  /** Highlight border on hover */
  hoverable?: boolean;
}

export const Card = ({
  children,
  className = '',
  noPadding = false,
  hoverable = false,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CardProps) => {
  const baseStyle: React.CSSProperties = {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: noPadding ? '0' : '16px',
    ...style,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onMouseEnter={(e) => {
        if (hoverable) e.currentTarget.style.borderColor = '#8b949e';
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (hoverable) e.currentTarget.style.borderColor = '#30363d';
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '', style, ...props }: CardHeaderProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '16px',
      borderBottom: '1px solid #21262d',
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------
// CardTitle
// ---------------------------------------------------------------

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = '', style, ...props }: CardTitleProps) => (
  <h3
    style={{
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.25,
      color: '#e6edf3',
      margin: 0,
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </h3>
);

// ---------------------------------------------------------------
// CardContent
// ---------------------------------------------------------------

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '', style, ...props }: CardContentProps) => (
  <div
    style={{ padding: '16px', ...style }}
    className={className}
    {...props}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '', style, ...props }: CardFooterProps) => (
  <div
    style={{
      padding: '12px 16px',
      borderTop: '1px solid #21262d',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------
// StatCard — GitHub-style stat tile (used in dashboards)
// ---------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  /** 'accent' | 'success' | 'attention' | 'danger' | 'done' | 'career' */
  color?: 'accent' | 'success' | 'attention' | 'danger' | 'done' | 'career';
  className?: string;
}

const colorMap = {
  accent:    { fg: '#2f81f7', bg: '#1c2d3f', border: 'rgba(31,111,235,0.4)' },
  success:   { fg: '#3fb950', bg: '#1a2d1a', border: 'rgba(46,160,67,0.4)' },
  attention: { fg: '#f0883e', bg: '#2d1f0a', border: 'rgba(187,128,9,0.4)' },
  danger:    { fg: '#f85149', bg: '#2d0f0f', border: 'rgba(248,81,73,0.4)' },
  done:      { fg: '#a371f7', bg: '#1e1530', border: 'rgba(163,113,247,0.4)' },
  career:    { fg: '#39d353', bg: '#0f2d12', border: 'rgba(57,211,83,0.4)' },
};

export const StatCard = ({ label, value, icon, color = 'accent', className = '' }: StatCardProps) => {
  const c = colorMap[color];
  return (
    <div
      className={className}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '6px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {icon && (
        <div style={{ color: c.fg, fontSize: '20px', flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div>
        <p style={{ fontSize: '12px', color: '#8b949e', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '24px', fontWeight: 700, color: c.fg, margin: 0, lineHeight: 1.2 }}>
          {value}
        </p>
      </div>
    </div>
  );
};
