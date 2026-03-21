/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-void': '#000010',
        'surface-dark': '#0B0F1A',
        'border-subtle': '#1C1F2D',
        'accent-primary': '#7A3CFF',
        'accent-secondary': '#00D0FF',
      },
      fontFamily: {
        syne: ['var(--font-syne)'],
        dm: ['var(--font-dm)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
