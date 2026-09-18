/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Locked design tokens — see Section 3.1 of the reconstruction spec.
        // Always reference these names in components; never use raw hex/opacity
        // utilities (e.g. bg-slate-950) — that's how the About-hero background
        // and text-contrast bugs from Round 1 QA happened.
        primary: '#3646E4', // royal/indigo blue — About hero bg, ring accents, icon strokes
        accent: '#F85D40', // coral — all CTA buttons, stars, eyebrow accents
        ink: '#1B1F29', // near-black body/heading text on light backgrounds
        muted: '#6B7280', // gray body copy
        surface: '#F6F6F8', // light-gray alternating section background
        dark: '#12131C', // footer / dark CTA background
      },
      borderRadius: {
        pill: '999px',
      },
      fontFamily: {
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
