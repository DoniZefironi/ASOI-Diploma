'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant =
  | 'primary'    // blue — main action
  | 'secondary'  // neutral — secondary action
  | 'danger'     // red — destructive
  | 'success'    // green — confirm / complete
  | 'ghost'      // transparent — subtle action
  | 'outline';   // bordered transparent

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#2f81f7',
    color: '#ffffff',
    border: '1px solid rgba(240,246,252,0.1)',
  },
  secondary: {
    background: '#21262d',
    color: '#e6edf3',
    border: '1px solid #30363d',
  },
  danger: {
    background: '#cf222e',
    color: '#ffffff',
    border: '1px solid rgba(240,246,252,0.1)',
  },
  success: {
    background: '#2da44e',
    color: '#ffffff',
    border: '1px solid rgba(240,246,252,0.1)',
  },
  ghost: {
    background: 'transparent',
    color: '#e6edf3',
    border: '1px solid transparent',
  },
  outline: {
    background: 'transparent',
    color: '#2f81f7',
    border: '1px solid #2f81f7',
  },
};

const variantHover: Record<ButtonVariant, Partial<React.CSSProperties>> = {
  primary:   { background: '#388bfd' },
  secondary: { background: '#30363d', borderColor: '#8b949e' },
  danger:    { background: '#b40d1c' },
  success:   { background: '#2c974b' },
  ghost:     { background: '#21262d' },
  outline:   { background: 'rgba(47,129,247,0.12)' },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: '12px', padding: '3px 12px', height: '28px', borderRadius: '6px' },
  md: { fontSize: '14px', padding: '5px 16px', height: '32px', borderRadius: '6px' },
  lg: { fontSize: '16px', padding: '9px 20px', height: '40px', borderRadius: '6px' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  className = '',
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'background 80ms, border-color 80ms, box-shadow 80ms',
    textDecoration: 'none',
    fontFamily: 'inherit',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      const hover = variantHover[variant];
      if (hover.background) e.currentTarget.style.background = hover.background as string;
      if (hover.borderColor) e.currentTarget.style.borderColor = hover.borderColor as string;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.background = variantStyles[variant].background as string;
      e.currentTarget.style.borderColor = (variantStyles[variant].border as string).split(' ')[2] ?? '';
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {loading ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M13 7a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : leadingIcon ? (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leadingIcon}</span>
      ) : null}
      {children}
      {trailingIcon && !loading && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{trailingIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
