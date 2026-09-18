# SND Design — Minimal Skeleton

A working React skeleton matching the Home and About pages from the reference screenshots, built to the
stack and structure defined in `SND_Design_Website_Reconstruction_Spec.md` (Sections 2, 4, 5, 6), with the
Round 1 QA fixes (Section 11) already applied at the source.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

## What's included (minimal, on purpose)

- **Vite + React 18 + React Router v6**, one persistent layout (`src/layout/PersistentLayout.jsx`) so the
  header, sidebar, chat widget, go-to-top control, and footer mount once and never remount between routes.
- **Tailwind CSS** with the design tokens from spec Section 3.1 locked into `tailwind.config.js`
  (`primary`, `accent`, `ink`, `muted`, `surface`, `dark`) — components only ever reference these names.
- **Two real routes**: `/` (Home, spec Section 5) and `/about` (About, spec Section 6), each composed from
  small per-section components matching the spec's component structure (Section 2.2).
- **`/portfolio` and `/contact`** exist as intentional stub routes — their content was never captured in
  the reference screenshots (spec Section 1, `[UNKNOWN_PAGE]`). Don't design these from imagination.
- **`PlaceholderBox`** (`src/components/shared/PlaceholderBox.jsx`) — the single reusable placeholder
  component from spec Section 2.3. Every unresolved image/logo/illustration in the build uses it, with its
  `id` matching the placeholder registry in spec Section 7.
- **A working `useCountdown` hook** wired into the About page's CTA — ticks down live, same pattern
  already confirmed working in the earlier build round.

## What's deliberately NOT in this skeleton yet

This is the *structural* pass only — per spec Section 0, it should not be mistaken for the finished build:

- No Framer Motion / GSAP — no scroll reveals, no hover-state animation, no confirmed parallax.
- No custom cursor (`GLOBAL-DOT-MARKER`) — still unconfirmed live whether it's actually a cursor (spec 4.5).
- No rotating badge animation (`ABOUT-HERO-BADGE`) — static placeholder box only.
- No carousel library — the testimonial section shows one static slide, not the real prev/next carousel.
- No `react-countup` on the Fun Facts stats — numbers render statically, not animated on scroll.
- No real media anywhere — every photo/logo/illustration is a labeled `PlaceholderBox`, exactly per the
  "never fabricate real content" rule in spec Section 0.

## Fixes already applied from Round 1 QA (spec Section 11)

- About hero background is `bg-primary` (blue), not dark/black.
- About hero heading/eyebrow text is full-opacity white, not near-invisible.
- No fabricated stats row in the Home hero.
- No fabricated newsletter signup in the footer.
- About services strip keeps the blue background continuing from the hero.
- "Our Platforms" on the About page shows 3 logos, not 4.
- Portfolio grid uses the asymmetric 1-large + 2-stacked layout.
- Hero decorative rings are small, outline-only, and sit behind the photo — not opaque boxes over the
  subject's face.

## Next steps

Work through spec Section 2.4 (animation/interaction → tool mapping) and Section 9 (required live
investigation checklist) in order — start with sourcing real media for the highest-priority placeholders in
Section 7's registry, then layer in Framer Motion for the scroll/hover behavior once assets are in place.
