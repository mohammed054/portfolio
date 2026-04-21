# 14 — SHARED COMPONENTS
## Global UI, Navbar, Grain, Typography System

---

## OVERVIEW

This document specifies every **shared/global component** used across the site: the persistent navbar, the film grain overlay, the smooth scroll wrapper, the section anchor system, and the typography utility classes. These components appear on every section and must be built first, before any section work begins.

---

## 1. NAVBAR

**File**: `src/components/Navbar/Navbar.tsx`

### Visual Spec

The navbar is `position: fixed` and persists across all scroll positions. It must **adapt its text color** depending on which section is currently in view (dark sections = light text; light/cream sections = dark text).

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [SHADER LOGO]         Home  Selected Work  About Us  Contact    📞 Book a call │
└────────────────────────────────────────────────────────────────────────────┘
```

**Layout**:
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 9999;
  pointer-events: none; /* allow click-through to content */
}
.navbar > * { pointer-events: auto; } /* restore clicks on children */
```

**Background**: transparent always. The sections beneath show through.
**Separator**: `border-bottom: 1px solid rgba(255,255,255,0.06)` — barely visible divider. Switches to `rgba(0,0,0,0.08)` on cream sections.

### Logo (Left)
```tsx
<div className="navbar-logo">
  <ShaderLogoIcon />       {/* Rainbow striped icon, ~32px wide */}
  <span className="navbar-wordmark">SHADER</span>
</div>
```

- Icon + wordmark total width: ~160px
- `ShaderLogoIcon`: an SVG component with 7 horizontal stripes, each a different brand-rainbow color, tapering right (speed-lines / motion-lines aesthetic)
- Wordmark font: the custom condensed slab look — achieved with `font-family: 'Playfair Display'; font-weight: 900; letter-spacing: 0.05em; font-size: 1.2rem`
- The logo is a **clickable link** to `#home` (smooth-scrolls to top)

### Navigation Links (Center)
```tsx
<nav className="navbar-links">
  <a href="#home">Home</a>
  <a href="#work">Selected Work</a>
  <a href="#about-us">About Us</a>
  <a href="#contact">Contact</a>
</nav>
```

**Styling**:
```css
.navbar-links a {
  font-family: 'EB Garamond', serif;
  font-size: 1rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--navbar-text-color);   /* CSS var, switches per section */
  margin: 0 16px;
  transition: color 0.3s ease;
}
.navbar-links a:hover {
  color: var(--navbar-text-hover);
}
```

**Active state**: When user is within a section, the corresponding link gets `font-weight: 600` (EB Garamond bold). This is driven by the `SectionAnchor` system (which updates a `data-active-section` attribute on `<body>`).

### Book a Call (Right)
```tsx
<a href="https://cal.com/simon-hedlund-kglzne" className="navbar-cta" target="_blank">
  <TelephoneIcon />
  <span>Book a call</span>
</a>
```

- `TelephoneIcon`: SVG, classic retro telephone receiver silhouette (NOT emoji)
- Font: `EB Garamond`, italic, 1rem
- No border, no background — pure text + icon
- Icon size: ~18px, vertically aligned with text

### Color Switching Logic

The navbar text switches between light and dark depending on the active section:

```typescript
// Section to navbar theme mapping
const sectionThemes: Record<string, 'light' | 'dark'> = {
  'home':       'light',   // dark bg → light text
  'work':       'light',   // dark bg → light text
  'about-us':   'light',   // dark image bg → light text
  'about-copy': 'dark',    // cream bg → dark text
  'about-vintage': 'dark', // warm bg → dark text
  'shredder':   'dark',    // cream bg → dark text (then transitions to light)
  'contact':    'light',   // dark bg → light text
};

// CSS variables switched via class on <body>:
// body.theme-light: --navbar-text-color: #f0ece4; --navbar-text-hover: #ffffff
// body.theme-dark:  --navbar-text-color: #2c2416; --navbar-text-hover: #000000
```

**Transition**: The color switches with a `transition: color 0.5s ease` — no hard jump.

### Mobile Navbar

On mobile (< 768px):
- Logo remains left
- Navigation links collapse to a **hamburger menu button** (right side)
- "Book a call" is hidden from the top bar (it appears in the hamburger menu)
- Hamburger: 3 horizontal lines SVG, 24×18px
- Open state: full-screen overlay, dark background (`rgba(0,0,0,0.96)`), links centered and large (`2rem`, `EB Garamond`)
- Close: X button top-right, or tap anywhere outside

---

## 2. GRAIN OVERLAY

**File**: `src/components/shared/GrainOverlay.tsx`

A film-grain texture overlaid on the **entire site** at all times. This is a single fixed `<canvas>` element at `z-index: 9000` (below navbar at 9999, above everything else) with `pointer-events: none`.

```tsx
// GrainOverlay.tsx
import { useEffect, useRef } from 'react';

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animFrame: number;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawGrain() {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 30; // grain intensity: 0–30
        data[i] = data[i + 1] = data[i + 2] = value;
        data[i + 3] = 18; // alpha: 0–255 (18 ≈ 7% opacity)
      }

      ctx.putImageData(imageData, 0, 0);
      animFrame = requestAnimationFrame(drawGrain);
    }

    resize();
    window.addEventListener('resize', resize);
    drawGrain();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        pointerEvents: 'none',
        opacity: 1,
      }}
      aria-hidden="true"
    />
  );
}
```

**Performance note**: Regenerating grain every frame is intentional — static grain looks wrong. The canvas is full-resolution which is expensive. If performance is a concern:
- Option A: Reduce canvas resolution to 50% and CSS-scale it up (slight tiling pattern but cheaper)
- Option B: Pre-generate 10 grain frames and cycle through them at 12fps

**Intensity**: `alpha: 18` (7%) on the overlay. On the preloader section, do NOT render the grain canvas (the preloader has its own scanline effect; grain would compound and be too noisy).

---

## 3. SMOOTH SCROLL WRAPPER

**File**: `src/components/shared/SmoothScroll.tsx`

```tsx
// SmoothScroll.tsx
import { useEffect } from 'react';
import { initLenis, pauseLenis } from '../../hooks/useLenis';

interface Props {
  children: React.ReactNode;
  paused?: boolean;
}

export function SmoothScroll({ children, paused = false }: Props) {
  useEffect(() => {
    const lenis = initLenis();
    if (paused) pauseLenis();
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (paused) pauseLenis();
  }, [paused]);

  return <>{children}</>;
}
```

**Usage in App.tsx**:
```tsx
// The `paused` prop is true until preloader exits
<SmoothScroll paused={isLoading}>
  <Preloader />
  <Navbar />
  <GrainOverlay />
  <main>
    {/* All sections */}
  </main>
</SmoothScroll>
```

---

## 4. SECTION ANCHOR

**File**: `src/components/shared/SectionAnchor.tsx`

(Full code in doc 13. Usage recap:)

```tsx
// Place at the TOP of each section
<section className="section-hero">
  <SectionAnchor id="home" threshold={0.4} />
  {/* section content */}
</section>
```

The `threshold` value should be:
- `0.4` for most sections (40% visible = active)
- `0.2` for very tall sections (pinned carousel, shredder) so they activate quickly

---

## 5. TYPOGRAPHY UTILITY CLASSES

**File**: `src/index.css` (global)

These classes are available across all components. Use them consistently — never ad-hoc font styles.

```css
/* ─── DISPLAY / HEADLINES ─── */
.t-hero {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(52px, 9.5vw, 160px);
  line-height: 0.95;
  letter-spacing: -0.02em;
}

.t-h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(42px, 7.5vw, 130px);
  line-height: 1.0;
  letter-spacing: -0.02em;
}

.t-h2 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(32px, 5.5vw, 90px);
  line-height: 1.1;
  letter-spacing: -0.015em;
}

.t-h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(26px, 4vw, 60px);
  line-height: 1.15;
}

.t-section-label {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(18px, 2.5vw, 36px);
  line-height: 1.2;
}

/* ─── BODY ─── */
.t-body-large {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: clamp(16px, 1.2vw, 20px);
  line-height: 1.7;
}

.t-body {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: clamp(14px, 1.05vw, 18px);
  line-height: 1.65;
}

.t-body-small {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: clamp(12px, 0.85vw, 15px);
  line-height: 1.6;
}

/* ─── UI / NAV ─── */
.t-nav {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: 1rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.t-cta {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.1rem;
}

.t-caption {
  font-family: 'EB Garamond', serif;
  font-weight: 400;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ─── MONO / PRELOADER ─── */
.t-mono {
  font-family: 'Courier Prime', 'Courier New', monospace;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
}

.t-mono-small {
  font-family: 'Courier Prime', 'Courier New', monospace;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.4;
}
```

---

## 6. CSS CUSTOM PROPERTIES (Global)

**File**: `src/index.css` (`:root` block)

```css
:root {
  /* ─── DARK WORLD ─── */
  --color-bg-dark:         #0d0d0d;
  --color-bg-dark-2:       #111111;
  --color-bg-contact:      #0a0a14;
  --color-text-light:      #f0ece4;
  --color-text-muted:      #8a8680;
  --color-text-muted-2:    #c0b8a8;
  --color-accent-gold:     #c9a84c;
  --color-purple-mid:      #2a1f5e;
  --color-blue-deep:       #0e1b6e;

  /* ─── LIGHT WORLD ─── */
  --color-bg-cream:        #f0e8d8;
  --color-bg-cream-2:      #e8dfc8;
  --color-text-dark:       #2c2416;
  --color-text-headline:   #1a1208;

  /* ─── BRAND RAINBOW ─── */
  --color-r1:   #e63946;
  --color-r2:   #f4a261;
  --color-r3:   #e9c46a;
  --color-r4:   #2a9d8f;
  --color-r5:   #457b9d;
  --color-r6:   #6a0572;

  /* ─── CRT ─── */
  --color-crt-bg:     #1a1aff;
  --color-crt-text:   #e8e4d8;

  /* ─── SPACING ─── */
  --section-padding-x: clamp(24px, 8vw, 120px);
  --section-padding-y: clamp(60px, 10vh, 140px);
  --navbar-height: 72px;

  /* ─── TIMING ─── */
  --transition-fast:   0.15s ease;
  --transition-base:   0.3s ease;
  --transition-slow:   0.6s ease;
  --transition-enter:  0.8s cubic-bezier(0.16, 1, 0.3, 1);

  /* ─── Z-INDEX SCALE ─── */
  --z-base:       1;
  --z-content:    10;
  --z-overlay:    100;
  --z-grain:      9000;
  --z-navbar:     9999;
  --z-preloader:  10000;
}
```

---

## 7. GLOBAL RESETS & BASE STYLES

```css
/* src/index.css */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: auto; /* Lenis handles smooth scroll, not CSS */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--color-bg-dark);
  color: var(--color-text-light);
  overflow-x: hidden;
  /* Lenis needs this: */
  overscroll-behavior: none;
}

/* Prevent FOUC on serif fonts */
body { opacity: 0; }
body.fonts-loaded { opacity: 1; transition: opacity 0.3s; }

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

/* Accessibility: focus rings */
:focus-visible {
  outline: 2px solid var(--color-accent-gold);
  outline-offset: 4px;
}

/* Skip to content */
.skip-to-content {
  position: fixed;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent-gold);
  color: #000;
  padding: 12px 24px;
  font-family: 'EB Garamond', serif;
  font-size: 1rem;
  z-index: 99999;
  transition: top 0.2s;
}
.skip-to-content:focus { top: 16px; }
```

---

## 8. FONT LOADING STRATEGY

```html
<!-- index.html — preconnect + preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload the display font (biggest visual impact) -->
<link rel="preload" href="/fonts/playfair-display.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/eb-garamond.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/courier-prime.woff2" as="font" type="font/woff2" crossorigin />
```

```typescript
// Font load detection — set body.fonts-loaded when ready
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});
```

All fonts are **self-hosted** (in `/public/fonts/`) — no external Google Fonts request at runtime. This eliminates render-blocking and CORS issues.

---

## 9. THREE.JS / R3F CANVAS SETUP

The R3F canvas is **not a full-page overlay**. Each section that needs 3D renders its own `<Canvas>` scoped to that section's container. This avoids the complexity of a single shared canvas + camera teleportation.

**Hero**: `<Canvas>` inside `.section-hero`, `position: absolute, inset: 0`
**Golden Tie**: `<Canvas>` inside `.section-golden-tie`
**Good Buy**: `<Canvas>` inside `.section-good-buy`

```tsx
// Standard R3F Canvas config used across all sections
<Canvas
  dpr={[1, 2]}              // retina at max 2x
  gl={{
    antialias: true,
    alpha: true,              // transparent background
    powerPreference: 'high-performance',
  }}
  camera={{ fov: 45, near: 0.1, far: 100 }}
  style={{ position: 'absolute', inset: 0 }}
>
  <Suspense fallback={null}>
    {/* scene content */}
  </Suspense>
</Canvas>
```

**Performance**: On mobile, set `dpr={[1, 1.5]}` (cap at 1.5x to reduce GPU load).
