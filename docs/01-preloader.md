# 01 — PRELOADER
## CRT Boot Sequence Screen

---

## OVERVIEW

The first thing a visitor sees is a full-screen **CRT computer boot sequence** — a simulation of booting an old Commodore/PET-era computer. This is not a generic loading spinner. It is a fully themed, pixel-faithful recreation of a 1980s operating system startup screen, complete with screen curvature, phosphor glow, scanlines, and a chunky progress bar.

This screen serves as:
1. A **loading gate** — it blocks content until all assets (3D models, images, fonts) are ready
2. A **tone-setter** — visitors instantly understand this site is playful, retro-aware, technically ambitious
3. A **brand statement** — "Shader Development Studio, Website, Version 1.02" reframes the site as software

The preloader disappears with a **white flash / CRT power-off collapse** animation once loading completes.

---

## VISUAL BREAKDOWN (pixel-accurate)

### Screen Wrapper
- **Takes full viewport** `100vw × 100vh`
- **Background**: `#1a1aff` — bright Commodore 64-blue, slightly warm
- **Shape**: Rectangular with very subtle **rounded corners** (~8px) to suggest a physical CRT bezel
- The entire screen has a soft **outer shadow** / vignette inward from the edges — like a real CRT
- **CRT Barrel Distortion**: the entire content is rendered through a CSS/GLSL barrel-distortion effect that makes the rectangle look physically curved (convex outward)
- The curvature is subtle — approximately 2–3% barrel warp

### Scanlines Overlay
- A repeating horizontal-stripe overlay, `rgba(0,0,0,0.12)` lines every 2–3px
- Applied as a CSS `::before` pseudo-element or a fixed `<canvas>` on top
- Very light — should not obscure text, just add texture

### Phosphor Glow / Noise
- A CSS `filter: brightness(1.05) contrast(1.1)` on the text container
- A subtle animated noise texture (grain) — same grain used elsewhere on the site
- The screen content has a very faint **green/yellow tint** on the text (phosphor simulation): achieved by giving text a warm `#e8e4d8` color against the blue bg

### Content Layout (vertically centered)
```
[vertical center of screen]

  ┌─────────────────────────────────────────┐
  │  [LOGO ICON]  S H A D E R               │
  │               (large wordmark)           │
  │                                          │
  │  Shader Development Studio, Website     │
  │              Version 1.02               │
  │                                          │
  │                                          │
  │   ┌─────────────────────────────────┐   │
  │   │████████████████░░░░░░░░░░░░░░░░│   │
  │   └─────────────────────────────────┘   │
  └─────────────────────────────────────────┘

  Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.
  [bottom of screen]
```

### Logo (inside preloader)
- The full SHADER logo: rainbow-striped icon (left) + "SHADER" wordmark (right)
- Size: approximately 60% of screen width
- The icon and wordmark are both rendered large (~200px tall)
- Font: the striped logo icon is SVG; the "SHADER" text is in the condensed slab/display weight
- Colors: same rainbow stripe palette as everywhere else — the color is the only color on the blue screen

### Subtitle Text
- `"Shader Development Studio, Website"`
- `"Version 1.02"`
- Font: **Courier Prime** (monospace)
- Size: ~1.1rem
- Color: `#e8e4d8`
- Centered below the logo
- Both lines centered on separate lines

### Progress Bar
- **Position**: below the subtitle text, centered, ~50% screen width
- **Outer border**: 2px solid `#e8e4d8`, sharp rectangle (no border-radius)
- **Inner fill**: Solid `#e8e4d8` rectangles, chunky pixel-style — NOT a smooth gradient bar
- **Style**: The fill is made of **discrete blocks** (like old-school DOS loaders) — approximately 20–25 equal-width segments with tiny 1px gaps between them, filling left to right
- **Animation**: Fills from 0% to 100% over the actual asset loading duration (tied to `useProgress` from drei)
- **Height**: ~32px (chunky, not thin)
- **Width**: ~500px max, centered

### Copyright Line
- `"Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved."`
- Font: **Courier Prime**
- Size: ~0.75rem
- **Position**: fixed to the very bottom of the screen, centered
- Color: `#e8e4d8`

---

## ANIMATION SEQUENCE

### Phase 1: Appear (0ms)
- Preloader renders immediately, no fade-in — it's just there
- Progress bar begins filling based on `useProgress` hook data

### Phase 2: Loading (0ms → complete)
- Progress bar fills in discrete block increments
- Each block fills with a slight stutter/flicker (2–3 frames of "almost there" jitter)
- Optionally: the screen flickers once or twice during loading (CRT power instability sim)
  - `opacity: 0.85` for 80ms, then back to `1.0` — random 1–2 times
- The logo has a very subtle **horizontal scanline drag** artifact on the colored stripes — like a demagnetized CRT

### Phase 3: Complete → Exit (loading hits 100%)
- **Hold**: bar stays full for 400ms
- **CRT Power-Off**: the screen "collapses"
  - First: horizontal compression — the screen squishes vertically to a thin 1–2px horizontal line over ~200ms (CSS scale: `scaleY(0.02)`) while staying full-width
  - Then: the horizontal line shrinks to a single point (center) over ~150ms (`scaleX(0.0)`)
  - Then: brief white flash fills the screen (`opacity 0→1→0` over 200ms on a white overlay)
  - Then: preloader `display: none` and the hero section is revealed

### Total preloader duration: 2–5 seconds depending on connection speed

---

## IMPLEMENTATION NOTES

### Component: `Preloader.tsx`
```tsx
// Key state: progress (0-100), phase ('loading' | 'complete' | 'exit')
// useProgress() from @react-three/drei
// GSAP timeline for exit animation
// Renders as a portal over everything else (z-index: 10000)
```

### CSS Key Rules
```css
.preloader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #1a1aff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.crt-effect {
  /* CSS perspective + scale for barrel distortion approximation */
  perspective: 800px;
  transform: scale(1.02); /* slight scale to hide barrel edge artifacts */
}

/* Scanlines */
.preloader::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0,0,0,0.12) 2px,
    rgba(0,0,0,0.12) 3px
  );
  pointer-events: none;
}

.progress-bar-inner {
  display: flex;
  gap: 2px;
  height: 100%;
}
.progress-segment {
  width: calc((100% - 40px) / 20); /* 20 segments with 2px gaps */
  background: #e8e4d8;
  transition: opacity 0.05s;
}
.progress-segment.empty { opacity: 0; }
```

### GLSL Barrel Distortion (optional enhancement)
If using a canvas overlay or R3F for the preloader, apply a barrel distortion shader:
```glsl
// Simple barrel distortion
vec2 uv = vUv - 0.5;
float dist = dot(uv, uv);
uv *= 1.0 + dist * 0.15; // 0.15 = distortion strength
uv += 0.5;
```

---

## ASSETS REQUIRED
- [ ] SHADER logo SVG (rainbow-striped icon + wordmark)
- [ ] Courier Prime font loaded and ready before preloader renders

---

## COPY (exact strings)
```
Line 1: "Shader Development Studio, Website"
Line 2: "Version 1.02"
Footer:  "Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved."
```

---

## MOBILE BEHAVIOR
- Same design, scaled down
- Progress bar width: 80vw
- Logo: 70vw
- Subtitle font: 0.85rem
- CRT power-off animation remains identical
