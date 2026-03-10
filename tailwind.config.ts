import type { Config } from 'tailwindcss'

/**
 * Tailwind config mirrors the CSS design system tokens exactly.
 * Color names, spacing, font families, and durations all map 1:1.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── Colors ─ exact spec hex values ─────────── */
      colors: {
        background: '#080B14',
        surface:    '#0E1220',
        border:     '#1A2035',
        accent1:    '#4F8EF7',
        accent2:    '#8B5CF6',
        'text-primary':   '#F0F4FF',
        'text-secondary': '#7A89A8',
        'text-muted':     '#3D4A66',
      },

      /* ── Font families ───────────────────────────── */
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
        /* Aliases for Next.js font variables */
        syne:    ['var(--font-syne)',    'sans-serif'],
        dm:      ['var(--font-dm)',      'sans-serif'],
      },

      /* ── Font sizes — spec scale ─────────────────── */
      fontSize: {
        '12': ['0.75rem',  { lineHeight: '1.4' }],
        '14': ['0.875rem', { lineHeight: '1.6' }],
        '16': ['1rem',     { lineHeight: '1.6' }],
        '20': ['1.25rem',  { lineHeight: '1.2' }],
        '24': ['1.5rem',   { lineHeight: '1.2' }],
        '32': ['2rem',     { lineHeight: '1.2' }],
        '48': ['3rem',     { lineHeight: '1.1' }],
        '64': ['4rem',     { lineHeight: '1.1' }],
        '96': ['6rem',     { lineHeight: '1.1' }],
      },

      /* ── Spacing — 4px base, spec scale ─────────── */
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
        '32': '128px',
      },

      /* ── Border radius ───────────────────────────── */
      borderRadius: {
        none: '0',
        sm:   '6px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'20px',
        '3xl':'24px',
        full: '9999px',
      },

      /* ── Motion durations ────────────────────────── */
      transitionDuration: {
        fast:      '150',
        base:      '300',
        slow:      '600',
        cinematic: '1200',
      },

      /* ── Easing ──────────────────────────────────── */
      transitionTimingFunction: {
        enter:    'cubic-bezier(0.22, 1, 0.36, 1)',
        exit:     'cubic-bezier(0.55, 0, 1, 0.45)',
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ── Keyframes ───────────────────────────────── */
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '.5', transform: 'scale(1.5)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 600ms cubic-bezier(0.22,1,0.36,1) both',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
