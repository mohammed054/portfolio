import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Design tokens are defined in globals.css as CSS custom properties.
  // Tailwind is used only for utility classes (layout, flex, grid, etc.)
  // NOT for colors or typography — those come from CSS variables.
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
