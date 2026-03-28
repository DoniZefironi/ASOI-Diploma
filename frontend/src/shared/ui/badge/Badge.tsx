'use client';

import { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant =
  | 'default'    // neutral gray
  | 'accent'     // blue
  | 'success'    // green — completed, passed
  | 'attention'  // orange — deadline approaching
  | 'danger'     // red — missed, failed
  | 'done'       // purple — IoT / electronics
  | 'career'     // mint — internship, career
  | 'outline';   // transparent with border

type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Render a small status dot before the label */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default:    { background: '#21262d', color: '#8b949e', border: '1px solid #30363d' },
  accent:     { background: 'rgba(31,111,235,0.15)', color: '#2f81f7', border: '1px solid rgba(31,111,235,0.4)' },
  success:    { background: 'rgba(46,160,67,0.15)',  color: '#3fb950', border: '1px solid rgba(46,160,67,0.4)' },
  attention:  { background: 'rgba(187,128,9,0.15)',  color: '#f0883e', border: '1px solid rgba(187,128,9,0.4)' },
  danger:     { background: 'rgba(248,81,73,0.15)',  color: '#f85149', border: '1px solid rgba(248,81,73,0.4)' },
  done:       { background: 'rgba(163,113,247,0.15)',color: '#a371f7', border: '1px solid rgba(163,113,247,0.4)' },
  career:     { background: 'rgba(57,211,83,0.12)',  color: '#39d353', border: '1px solid rgba(57,211,83,0.4)' },
  outline:    { background: 'transparent',           color: '#8b949e', border: '1px solid #30363d' },
};

const dotColors: Record<BadgeVariant, string> = {
  default:   '#8b949e',
  accent:    '#2f81f7',
  success:   '#3fb950',
  attention: '#f0883e',
  danger:    '#f85149',
  done:      '#a371f7',
  career:    '#39d353',
  outline:   '#8b949e',
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: '11px', padding: '1px 6px', borderRadius: '20px', fontWeight: 500 },
  md: { fontSize: '12px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 },
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
  ...props
}: BadgeProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }}
    {...props}
  >
    {dot && (
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: dotColors[variant],
          flexShrink: 0,
        }}
      />
    )}
    {children}
  </span>
);
