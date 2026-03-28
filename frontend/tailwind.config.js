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
        // GitHub Dark — Canvas
        'gh-canvas':        '#0d1117',
        'gh-canvas-overlay':'#161b22',
        'gh-canvas-subtle': '#161b22',
        'gh-canvas-inset':  '#010409',

        // GitHub Dark — Foreground
        'gh-fg':            '#e6edf3',
        'gh-fg-muted':      '#8b949e',
        'gh-fg-subtle':     '#6e7681',
        'gh-fg-on-emphasis':'#ffffff',

        // GitHub Dark — Border
        'gh-border':        '#30363d',
        'gh-border-muted':  '#21262d',

        // GitHub Dark — Accent (blue)
        'gh-accent':        '#2f81f7',
        'gh-accent-emphasis':'#1f6feb',
        'gh-accent-muted':  'rgba(31,111,235,0.4)',
        'gh-accent-subtle': '#1c2d3f',

        // GitHub Dark — Success (green)
        'gh-success':       '#3fb950',
        'gh-success-emphasis':'#2da44e',
        'gh-success-muted': 'rgba(46,160,67,0.4)',
        'gh-success-subtle':'#1a2d1a',

        // GitHub Dark — Attention/Warning (orange)
        'gh-attention':     '#f0883e',
        'gh-attention-emphasis':'#db6d28',
        'gh-attention-muted':'rgba(187,128,9,0.4)',
        'gh-attention-subtle':'#2d1f0a',

        // GitHub Dark — Danger (red)
        'gh-danger':        '#f85149',
        'gh-danger-emphasis':'#cf222e',
        'gh-danger-muted':  'rgba(248,81,73,0.4)',
        'gh-danger-subtle': '#2d0f0f',

        // GitHub Dark — Done/IoT (purple)
        'gh-done':          '#a371f7',
        'gh-done-emphasis': '#8250df',
        'gh-done-muted':    'rgba(163,113,247,0.4)',
        'gh-done-subtle':   '#1e1530',

        // Career track (mint green)
        'gh-career':        '#39d353',
        'gh-career-subtle': '#0f2d12',

        // Neutral scale (dark to light)
        'gh-neutral-1':     '#161b22',
        'gh-neutral-2':     '#21262d',
        'gh-neutral-3':     '#30363d',
        'gh-neutral-4':     '#484f58',
        'gh-neutral-5':     '#6e7681',
        'gh-neutral-6':     '#8b949e',
        'gh-neutral-7':     '#b1bac4',
        'gh-neutral-8':     '#cdd9e5',
        'gh-neutral-9':     '#e6edf3',
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
        'gh':       '0 0 0 1px #30363d',
        'gh-md':    '0 3px 6px rgba(0,0,0,0.4), 0 0 0 1px #30363d',
        'gh-lg':    '0 8px 24px rgba(0,0,0,0.6)',
        'gh-focus': '0 0 0 3px rgba(47,129,247,0.4)',
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
