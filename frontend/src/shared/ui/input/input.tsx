import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show error styling */
  error?: boolean;
  /** Left icon/element inside the input */
  leadingAddon?: React.ReactNode;
  /** Right icon/element inside the input */
  trailingAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, leadingAddon, trailingAddon, style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    if (leadingAddon || trailingAddon) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-canvas-default)',
            border: `1px solid ${error ? '#f85149' : focused ? '#2f81f7' : '#30363d'}`,
            borderRadius: '6px',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(248,81,73,0.4)' : 'rgba(47,129,247,0.4)'}` : 'none',
            transition: 'border-color 80ms, box-shadow 80ms',
            overflow: 'hidden',
          }}
        >
          {leadingAddon && (
            <span style={{ padding: '0 8px', color: 'var(--color-fg-muted)', flexShrink: 0 }}>
              {leadingAddon}
            </span>
          )}
          <input
            ref={ref}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '5px 12px',
              fontSize: '14px',
              color: 'var(--color-fg-default)',
              lineHeight: 1.5,
              minWidth: 0,
              ...style,
            }}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className={className}
            {...props}
          />
          {trailingAddon && (
            <span style={{ padding: '0 8px', color: 'var(--color-fg-muted)', flexShrink: 0 }}>
              {trailingAddon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        style={{
          display: 'block',
          width: '100%',
          background: 'var(--color-canvas-default)',
          border: `1px solid ${error ? '#f85149' : focused ? '#2f81f7' : '#30363d'}`,
          borderRadius: '6px',
          padding: '5px 12px',
          fontSize: '14px',
          color: 'var(--color-fg-default)',
          lineHeight: 1.5,
          outline: 'none',
          boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(248,81,73,0.4)' : 'rgba(47,129,247,0.4)'}` : 'none',
          transition: 'border-color 80ms, box-shadow 80ms',
          ...style,
        }}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        className={className}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
