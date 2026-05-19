// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // GitHub — Canvas (теперь через CSS-переменные → автоматически адаптируются к теме)
        'gh-canvas':         'var(--color-canvas-default)',
        'gh-canvas-overlay': 'var(--color-canvas-overlay)',
        'gh-canvas-subtle':  'var(--color-canvas-subtle)',
        'gh-canvas-inset':   'var(--color-canvas-inset)',

        // GitHub — Foreground
        'gh-fg':             'var(--color-fg-default)',
        'gh-fg-muted':       'var(--color-fg-muted)',
        'gh-fg-subtle':      'var(--color-fg-subtle)',
        'gh-fg-on-emphasis': 'var(--color-fg-on-emphasis)',

        // GitHub — Border
        'gh-border':         'var(--color-border-default)',
        'gh-border-muted':   'var(--color-border-muted)',

        // GitHub — Accent (blue)
        'gh-accent':          'var(--color-accent-fg)',
        'gh-accent-emphasis': 'var(--color-accent-emphasis)',
        'gh-accent-muted':    'var(--color-accent-muted)',
        'gh-accent-subtle':   'var(--color-accent-subtle)',

        // GitHub — Success (green)
        'gh-success':          'var(--color-success-fg)',
        'gh-success-emphasis': 'var(--color-success-emphasis)',
        'gh-success-muted':    'var(--color-success-muted)',
        'gh-success-subtle':   'var(--color-success-subtle)',

        // GitHub — Attention/Warning
        'gh-attention':          'var(--color-attention-fg)',
        'gh-attention-emphasis': 'var(--color-attention-emphasis)',
        'gh-attention-muted':    'var(--color-attention-muted)',
        'gh-attention-subtle':   'var(--color-attention-subtle)',

        // GitHub — Danger (red)
        'gh-danger':          'var(--color-danger-fg)',
        'gh-danger-emphasis': 'var(--color-danger-emphasis)',
        'gh-danger-muted':    'var(--color-danger-muted)',
        'gh-danger-subtle':   'var(--color-danger-subtle)',

        // GitHub — Done/IoT (purple)
        'gh-done':          'var(--color-done-fg)',
        'gh-done-emphasis': 'var(--color-done-emphasis)',
        'gh-done-muted':    'var(--color-done-muted)',
        'gh-done-subtle':   'var(--color-done-subtle)',

        // Career
        'gh-career':        'var(--color-career-fg)',
        'gh-career-subtle': 'var(--color-career-subtle)',

        // Neutral scale (CSS vars)
        'gh-neutral-1': 'var(--color-neutral-1)',
        'gh-neutral-2': 'var(--color-neutral-2)',
        'gh-neutral-3': 'var(--color-neutral-3)',
        'gh-neutral-4': 'var(--color-neutral-4)',
        'gh-neutral-5': 'var(--color-neutral-5)',
        'gh-neutral-6': 'var(--color-neutral-6)',
        'gh-neutral-7': 'var(--color-neutral-7)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        'gh-xs':   ['11px', { lineHeight: '16px' }],
        'gh-sm':   ['12px', { lineHeight: '20px' }],
        'gh-base': ['14px', { lineHeight: '21px' }],
        'gh-lg':   ['16px', { lineHeight: '24px' }],
        'gh-xl':   ['20px', { lineHeight: '30px' }],
        'gh-2xl':  ['24px', { lineHeight: '32px' }],
        'gh-3xl':  ['32px', { lineHeight: '40px' }],
      },
      borderRadius: {
        'gh':    '6px',
        'gh-lg': '12px',
        'gh-xl': '16px',
      },
      boxShadow: {
        'gh':       '0 0 0 1px var(--color-border-default)',
        'gh-md':    '0 3px 6px rgba(0,0,0,0.2), 0 0 0 1px var(--color-border-default)',
        'gh-lg':    'var(--shadow-lg)',
        'gh-focus': 'var(--shadow-focus)',
        'gh-inset': 'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
      spacing: {
        'gh-1': '4px',
        'gh-2': '8px',
        'gh-3': '12px',
        'gh-4': '16px',
        'gh-5': '24px',
        'gh-6': '32px',
      },
      transitionDuration: {
        'gh': '80ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
