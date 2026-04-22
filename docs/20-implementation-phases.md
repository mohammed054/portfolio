# 20 — IMPLEMENTATION PHASES
## Shader Rebuild — Phased Build Plan

---

## HOW TO USE THIS DOCUMENT

This is the master execution guide. When handing a phase to an AI agent (or developer), provide:

1. **All numbered `.md` docs in `/docs/`** (00 through 18, plus this file)
2. **The current project zip / repo** 
3. **This instruction**: *"Implement Phase [N] as specified in `20-implementation-phases.md`. Reference the spec docs for every detail. Do not modify files outside of this phase's scope."*

Each phase lists exactly which files to read, which files to touch, what the output should look like, and how to verify it's done.

---

## PROJECT STATE SNAPSHOT (as of April 22, 2026)

### ✅ Solid / Production-Ready
| Component | Files | Notes |
|-----------|-------|-------|
| Shared infrastructure | `GrainOverlay`, `SmoothScroll`, `SectionAnchor`, `Navbar`, CSS variables, hooks, constants | Complete per spec |
| Preloader | `Preloader.tsx`, `Preloader.module.css` | Full CRT boot sequence + exit animation |
| Hero layout + animation | `Hero.tsx`, `Hero.module.css`, `HeroScene.tsx`, `SuperPETModel.tsx` | 3D scene, fog, lights, bloom, entrance — scroll camera orbit missing |
| Selected Work architecture | `SelectedWork.tsx`, `FilmStrip.tsx`, and CSS | Horizontal scroll + pin + sprockets — missing enter-scale anim + real images |
| About Hero | `AboutHero.tsx`, `AboutHero.module.css` | Parallax + title — missing bg image |
| About Copy | `AboutCopy.tsx`, `AboutCopy.module.css` | 3-column layout + all copy correct — missing businessman image |
| About Vintage | `AboutVintage.tsx`, `AboutVintage.module.css` | Parallax + rainbow stripes — missing bg image |

### 🔶 Skeleton / Stub (structure exists, needs real implementation)
| Component | Files | State |
|-----------|-------|-------|
| Shredder | `Shredder.tsx`, `ShredderCanvas.tsx` | `ShredderCanvas` is a flat cream plane — GLSL exists in `src/utils/glsl/shredWarp.glsl` but NOT connected; no scroll trigger; no 3D model loaded; no businessman figure |
| Contact Tease | `ContactTease.tsx` | CSS-only star rotation, no GSAP lifecycle, no entrance animation |
| Golden Tie | `GoldenTie.tsx`, `TieScene.tsx` | Cone geometry placeholders; emoji audience; no GLB loaded; no entrance animations |
| Handshake | `Handshake.tsx` | Pure placeholder `<div>` — no image, no parallax, no animation |
| Good Buy | `GoodBuy.tsx`, `PhonesScene.tsx` | Box geometry placeholders; phones GLB available but not loaded; no camera orbit |
| Footer | `Footer.tsx`, `Footer.module.css` | Functional links but missing visual design (no dashed CEO card border, emoji icons, wrong layout) |

### 📦 3D Models Available in `/public/models/`
| File | Size | Assigned To |
|------|------|-------------|
| `70s_retro_computer_asset_-_old_commodore_pet.glb` | 2.8 MB | Hero ✓ already in use |
| `Meshy_AI_A_classic_men_s_busin_0421141231_texture.glb` | 7.2 MB | Golden Tie (the "businessman tie" model — load and assess for use as the tie) |
| `office_electronics_paper_shredder.glb` | 11.1 MB | Shredder section |
| `post_apocalyptic_style_retro_telephone.glb` | 5.9 MB | Good Buy phones |

### 🔴 Photo/Image Assets — NOT YET CREATED (see `18-photo-asset-specs.md`)
These must be sourced, rendered, or AI-generated separately. Every phase that depends on one will note it explicitly and provide a fallback strategy so development can proceed without the final asset.

| File | Used In |
|------|---------|
| `/public/images/about-office-cubicles.webp` | About Hero background |
| `/public/images/about-retro-computers.webp` | About Vintage background |
| `/public/images/businessman-about.png` | About Copy cutout |
| `/public/images/businessman-shrug.png` | Shredder cutout |
| `/public/images/ceo-phone-portrait.png` | Footer CEO card |
| `/public/images/handshake.webp` | Handshake background |
| `/public/images/carousel/project-*.webp` | Selected Work frames |
| `/public/images/applauding/clap-figure-*.png` | Golden Tie audience |

---

## PHASE OVERVIEW

| Phase | Name | Effort | Status |
|-------|------|--------|--------|
| 1 | Foundation & Wiring Audit | S | 🔶 Needs fixes |
| 2 | Preloader Finalization | S | ✅ Nearly done |
| 3 | Hero — Camera Scroll Orbit | M | 🔶 Needs addition |
| 4 | Selected Work — Enter Animation & Data | S | 🔶 Needs additions |
| 5 | About Sections (03, 04, 05) | S | 🔶 Image-dependent |
| 6 | Shredder — Full GLSL Pipeline | XL | 🔴 Major build |
| 7 | Contact Tease + Golden Tie | L | 🔴 Major build |
| 8 | Handshake + Good Buy | M | 🔴 Medium build |
| 9 | Footer Visual Polish | S | 🔶 Needs redesign |
| 10 | Cross-Cutting Polish | M | 🔴 Not started |
| 11 | QA & Launch | M | 🔴 Not started |

---

---

# PHASE 1 — Foundation & Wiring Audit

**Goal**: Ensure the project compiles cleanly, all shared systems are correctly wired, and the development environment works end-to-end before any section work begins.

**Spec docs**: `00-blueprint.md`, `13-scroll-animation-system.md`, `14-shared-components.md`, `16-dev-environment.md`

---

## What to Fix

### 1.1 — SectionAnchor: Update `body.dataset.activeSection`

**Current bug**: `SectionAnchor.tsx` only calls `history.replaceState()` when a section enters view. But `Navbar.tsx` reads `document.body.dataset.activeSection` to determine the active link. These are not connected — the navbar never knows which section is active.

**Fix**: In `SectionAnchor.tsx`, also set the body data attribute when the section becomes active:

```typescript
// Inside the IntersectionObserver callback, alongside history.replaceState:
document.body.dataset.activeSection = id;
```

**File to modify**: `src/components/shared/SectionAnchor.tsx`

---

### 1.2 — Navbar: Apply Light/Dark Theme Classes

**Current state**: `SECTION_THEMES` map exists in `constants.ts` but nothing in `Navbar.tsx` or `index.css` actually switches the navbar text color based on it.

**Fix**: In `Navbar.tsx`, derive the current theme from `SECTION_THEMES[activeSection]` and apply a `data-theme` attribute or a CSS class to the navbar element. In `Navbar.module.css`, add styles for `.navbar[data-theme="dark"]` (dark text for cream sections).

```typescript
// In Navbar.tsx render:
const theme = SECTION_THEMES[activeSection] ?? 'light';
// ...
<header className={styles.navbar} data-theme={theme}>
```

```css
/* Navbar.module.css */
.navbar[data-theme="light"] .link { color: var(--color-text-light); }
.navbar[data-theme="dark"]  .link { color: var(--color-text-dark); }
.navbar[data-theme="dark"]  .wordmark { color: var(--color-text-dark); }
/* etc. */
```

**Files to modify**: `src/components/Navbar/Navbar.tsx`, `src/components/Navbar/Navbar.module.css`

---

### 1.3 — ScrollTrigger Defaults & Lenis Bridge

**Verify** that `useLenis.ts` is correctly bridging Lenis to ScrollTrigger. Specifically confirm:
- `lenis.on('scroll', ScrollTrigger.update)` is present
- `ScrollTrigger.defaults({ scroller: document.body })` is called once at init
- `gsap.ticker.lagSmoothing(0)` is set

**File to check/fix**: `src/hooks/useLenis.ts`, `src/main.tsx`

---

### 1.4 — GSAP Plugin Registration

Verify the following plugins are registered in `src/main.tsx` before any component renders:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
```

`ScrollToPlugin` is required by `SelectedWork.tsx`'s arrow navigation (`gsap.to(window, { scrollTo: ... })`). Without it, arrow nav will silently fail.

**File to modify**: `src/main.tsx`

---

### 1.5 — TypeScript: Clean Build

Run `npm run type-check`. Fix all TypeScript errors before proceeding.

---

### 1.6 — Fonts

Verify `/public/fonts/` contains the three required `.woff2` files:
- `playfair-display-900.woff2`
- `eb-garamond-400.woff2`  
- `courier-prime-400.woff2`

If they are missing, add the `@font-face` declarations in `index.html` to load from Google Fonts as a temporary fallback, and flag this for the art director to provide self-hosted files per spec `16-dev-environment.md § Font Loading`.

---

## Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] `npm run type-check` passes cleanly
- [ ] Scrolling from top to footer updates the URL hash correctly
- [ ] Navbar text color switches to dark text when scrolling through About Copy and About Vintage sections
- [ ] The grain overlay is visible on all dark sections
- [ ] Smooth scroll feels correct (Lenis momentum)
- [ ] Arrow navigation in Selected Work scrolls correctly (ScrollToPlugin works)

---

---

# PHASE 2 — Preloader Finalization

**Goal**: Verify the preloader is pixel-accurate per spec and handles all edge cases correctly.

**Spec docs**: `01-preloader.md`, `14-shared-components.md`
**Files in scope**: `src/components/Preloader/Preloader.tsx`, `src/components/Preloader/Preloader.module.css`

---

## What to Verify / Fix

### 2.1 — Dev Mode Auto-Complete

The current code has a commented-out TODO in the dev-mode timer. If `VITE_ENABLE_PRELOADER=false`, the preloader should not render at all. Wire this up:

```typescript
// In Preloader.tsx, at the top:
import { FEATURES } from '../../utils/constants';

// If preloader is disabled, immediately call onComplete and return null
if (!FEATURES.enablePreloader) {
  onComplete?.();
  return null;
}
```

Also: when no 3D assets are in `<Suspense>` (e.g. dev with 3D disabled), `useProgress` will never reach 100. Add a 1.5s timeout fallback that fires `onComplete` if progress is still 0 after the timeout.

---

### 2.2 — CRT Barrel Distortion

The CSS approximation (`perspective: 800px; transform: scale(1.02)`) is in the module CSS — confirm it's applied to the `.content` container, not the outer wrapper (the outer wrapper is the one that gets GSAP `scaleY`/`scaleX` during the exit animation; if they're the same element, the transforms will conflict).

Structure should be:
```
.preloader (GSAP target — scaleY/scaleX exit animation)
  └── .crtScreen (CSS barrel distortion — perspective + scale)
       └── .content (logo, subtitle, progress)
  └── .scanlines (fixed overlay)
  └── .copyright
  └── .flash (GSAP target — opacity)
```

---

### 2.3 — Progress Bar Segment Jitter

Per spec, segments should have a slight stutter/flicker as they fill. Add this: when a segment fills for the first time, apply a CSS class `filledNew` that triggers a 2-frame opacity flicker (`opacity: 0.6 → 1`) via a short CSS animation.

---

### 2.4 — Mobile Scaling

Verify on viewport < 768px:
- Progress bar width is `80vw`
- Logo is `70vw`
- Subtitle font is `0.85rem`

---

## Acceptance Criteria

- [ ] Preloader renders on page load with Commodore-blue background
- [ ] SHADER logo (rainbow icon + wordmark) is centered and proportionally correct
- [ ] "Shader Development Studio, Website / Version 1.02" in Courier Prime
- [ ] Progress bar fills in chunky segments (not a smooth gradient)
- [ ] CRT power-off animation plays: vertical collapse → horizontal shrink → white flash
- [ ] After animation, hero is immediately visible (no blank frame)
- [ ] `VITE_ENABLE_PRELOADER=false` skips preloader entirely during dev
- [ ] Copyright text is fixed to bottom of screen

---

---

# PHASE 3 — Hero Section: Camera Scroll Orbit

**Goal**: Add the scroll-driven camera movement that pushes the camera toward the computer monitor as the user scrolls. This is the visual bridge from Hero to Selected Work.

**Spec docs**: `02-hero.md`, `13-scroll-animation-system.md`
**Files in scope**: `src/sections/01-Hero/HeroScene.tsx`, `src/hooks/useScrollProgress.ts`

---

## What to Build

### 3.1 — Wire `useScrollProgress` to the Hero Section

The hook exists at `src/hooks/useScrollProgress.ts` but is not yet used in `HeroScene.tsx`. Import and connect it:

```typescript
// HeroScene.tsx — inside SceneContent
import { useScrollProgress } from '../../hooks/useScrollProgress';

function SceneContent() {
  const progress = useScrollProgress('#home');
  // pass to camera animation below
}
```

---

### 3.2 — Camera Movement via `useFrame`

Add a `useFrame` hook to `SceneContent` (or a new `CameraController` child component) that moves the R3F camera toward the monitor screen as scroll progress increases:

Per `13-scroll-animation-system.md § HERO`:

```typescript
useFrame(({ camera }) => {
  const targetX = THREE.MathUtils.lerp(0,   0.8, progress);
  const targetY = THREE.MathUtils.lerp(0,   0.2, progress);
  const targetZ = THREE.MathUtils.lerp(7,   1.5, progress); // initial z=7 from camera config
  
  camera.position.lerp(
    new THREE.Vector3(targetX, targetY, targetZ),
    0.05
  );
  // Look toward the monitor screen position
  camera.lookAt(1.4, -0.4, 0); // approximate SuperPET screen world position
});
```

Use `THREE.MathUtils.lerp` — do NOT use GSAP inside `useFrame`.

---

### 3.3 — Fog Fade on Scroll

Per `13-scroll-animation-system.md`, the fog particles should fade as the user scrolls into the selected work section. The `FogCloud` component in `HeroScene.tsx` needs to receive `progress` and reduce its opacity:

```typescript
// In FogCloud, accept a progress prop:
<pointsMaterial opacity={0.35 * (1 - progress * 1.5)} ... />
```

---

## Acceptance Criteria

- [ ] At scroll position 0, hero looks exactly as before
- [ ] As user scrolls down, camera smoothly pushes toward the computer monitor
- [ ] At ~30% hero scroll, the camera is looking at the monitor face-on
- [ ] Fog particles fade out as camera zooms in
- [ ] No jitter or snapping in camera movement (`lerp` provides smooth easing)
- [ ] At `prefers-reduced-motion: reduce`: camera stays at start position (no orbit), fog stays static

---

---

# PHASE 4 — Selected Work: Enter Animation & Project Data

**Goal**: Add the film strip enter scale animation, populate real project data, and confirm the pinned horizontal scroll is working perfectly.

**Spec docs**: `03-selected-work.md`, `13-scroll-animation-system.md`
**Files in scope**: `src/sections/02-SelectedWork/SelectedWork.tsx`, `src/sections/02-SelectedWork/FilmStrip.tsx`, `src/sections/02-SelectedWork/FilmStrip.module.css`, `src/utils/constants.ts`

---

## What to Build

### 4.1 — Film Strip Enter Scale Animation

Per spec and `13-scroll-animation-system.md § SELECTED WORK`, the film strip should zoom from `scale: 0.6` to `scale: 1.0` as the section enters the viewport. Add this to `SelectedWork.tsx`'s `useGSAP` block:

```typescript
// In the init() function, after the main horizontal scroll tween:
gsap.fromTo(strip.parentElement, // the .perspective wrapper
  { scale: 0.6, opacity: 0 },
  {
    scale: 1, opacity: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
      end: 'top 20%',
      scrub: true,
    }
  }
);
```

---

### 4.2 — Project Data

Update `src/utils/constants.ts` with the known real project data. Populate at minimum these two confirmed projects (from spec `03-selected-work.md`), then add placeholder entries up to 11 total. For each missing image, keep the path but the `FilmStrip` component already has a gradient placeholder fallback:

```typescript
export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Design is Funny',
    category: 'Brand Identity',
    url: '#',
    images: { main: '/images/carousel/project-01-main.webp' },
  },
  {
    id: 2,
    name: 'eHealth Arena',
    category: '3D Showroom',
    url: '#',
    images: { main: '/images/carousel/project-02-main.webp' },
  },
  // Add 9 more placeholder entries with unique names/categories
  // e.g. 'Untitled 03' through 'Untitled 11'
  // The gradient placeholders will show in FilmStrip until real images arrive
];
```

---

### 4.3 — Dot Pagination Polish

The current dot pagination uses `<button>` elements with CSS for filled/outline state. Verify that:
- The active dot is visually distinct (filled white, ~8px)
- Inactive dots are outlined (~6px)
- The correct dot updates immediately on arrow button click (not just on scroll update)

---

### 4.4 — Section Header

Per `03-selected-work.md`, there is a header above the film strip that reads "Selected Work / Browse our project carousel...". This header should fade out once the scroll begins (scroll progress > 0). Add a GSAP tween for this.

---

## Acceptance Criteria

- [ ] Film strip zooms from small to full-size as the section pins (scale 0.6 → 1.0 scrub)
- [ ] 11 projects in the carousel (real or placeholder data)
- [ ] Active project name and category update as user scrolls through
- [ ] Left/right arrows jump to adjacent project
- [ ] Dot pagination reflects active project at all times
- [ ] At end of carousel, pin releases and next section scrolls in
- [ ] Sprocket holes are visible (CSS cutouts, bg gradient shows through)
- [ ] Film strip has 3D perspective tilt (edges curve away)

---

---

# PHASE 5 — About Sections (03, 04, 05)

**Goal**: Polish the three About sections. All animation logic already exists — this phase wires in final assets and applies any missing CSS details.

**Spec docs**: `04-about-hero.md`, `05-about-copy.md`, `06-about-vintage.md`, `18-photo-asset-specs.md`
**Files in scope**: All files in `src/sections/03-AboutHero/`, `src/sections/04-AboutCopy/`, `src/sections/05-AboutVintage/`

---

## What to Build

### 5.1 — About Hero: Background Image

**Asset dependency**: Needs `/public/images/about-office-cubicles.webp`. See `18-photo-asset-specs.md § P-01` for the exact spec.

**Fallback if asset not ready**: Use a CSS gradient that approximates the desaturated institutional feel:
```css
.bgImage {
  background: linear-gradient(160deg, #2a2a2a 0%, #1a1818 50%, #0d0d0d 100%);
}
```

Once the real image exists, the CSS background-image in `AboutHero.module.css` simply needs to be pointed at the file.

**Also add**: The CRT chromatic aberration on the section — per `04-about-hero.md`, the entire image has a CSS RGB channel split. Apply via `filter: url(#crt-glitch)` or using CSS `text-shadow`-style approach on the image:
```css
.bgImage {
  /* Chromatic aberration simulation */
  position: relative;
}
.bgImage::before, .bgImage::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  mix-blend-mode: screen;
}
.bgImage::before { transform: translateX(-2px); filter: url("data:image/svg+xml,..."); }
```
Or use a simpler approach: add a CSS `filter: saturate(0.15) contrast(1.2)` on the image, plus a very faint red overlay shifted 2px left and blue overlay shifted 2px right (using pseudo-elements with `mix-blend-mode: screen`).

---

### 5.2 — About Copy: Businessman Image

**Asset dependency**: Needs `/public/images/businessman-about.png`. See `18-photo-asset-specs.md § P-03`.

**Current state**: The `<img>` tag already exists in `AboutCopy.tsx` with the correct src path. There is also a `.businessmanFallback` div in the markup. Style the fallback to be a placeholder silhouette (a simple outlined rectangle with a person icon shape) so the layout looks intentional without the real asset.

**Also verify**: The businessman's `position: absolute; right: 0; bottom: 0` positioning is correct relative to the section container. The section container needs `position: relative`.

---

### 5.3 — About Vintage: Background Image

**Asset dependency**: Needs `/public/images/about-retro-computers.webp`. See `18-photo-asset-specs.md § P-02`.

**Fallback**: A warm catalog-photography CSS gradient:
```css
.bgImage {
  background: linear-gradient(135deg, #c8b89a 0%, #b0a080 40%, #8a7860 100%);
}
```

**Also verify**: Rainbow stripe separator colors match exactly: `#e63946, #f4a261, #e9c46a, #2a9d8f, #457b9d, #6a0572` — per `14-shared-components.md § CSS Custom Properties`. Check the RAINBOW array in the component against these values.

---

## Acceptance Criteria

- [ ] About Hero: Full-bleed background (image or fallback gradient), parallax works
- [ ] About Hero: "About Us" text is very large (~15vw), semi-transparent white, centered
- [ ] About Hero: CRT chromatic aberration effect is subtly visible on the image
- [ ] About Copy: Cream background (#f0e8d8) — full departure from dark mode
- [ ] About Copy: 3-column layout with correct copy text (verify verbatim against spec)
- [ ] About Copy: Businessman image or styled placeholder is positioned right side
- [ ] About Copy: All entrance animations trigger correctly (headline, columns, businessman)
- [ ] About Vintage: Rainbow stripes (top and bottom) use correct 6 colors
- [ ] About Vintage: Top rainbow stripes animate in left-to-right on enter
- [ ] About Vintage: Deep parallax on background image works

---

---

# PHASE 6 — Shredder: Full GLSL Pipeline

**Goal**: Build the complete interactive paper shredder effect — the site's most technically complex DOM section. Connect the existing `shredWarp.glsl` to `ShredderCanvas.tsx`, load the shredder 3D model, add scroll-triggered warp progression, and add the businessman shrug figure.

**Spec docs**: `07-shredder.md`, `13-scroll-animation-system.md § SHREDDER`
**Files in scope**: `src/sections/06-Shredder/Shredder.tsx`, `src/sections/06-Shredder/ShredderCanvas.tsx`, `src/sections/06-Shredder/Shredder.module.css`

---

## What to Build

### 6.1 — Complete Rebuild of `ShredderCanvas.tsx`

The current file creates an empty Three.js scene with a flat cream plane. This needs to be completely replaced.

**Architecture**: The shredder canvas captures a screenshot/texture of the DOM content above it and applies the `shredWarp.glsl` shader to it as scroll progresses. Since true DOM-to-texture (html2canvas) can be complex, use this simplified but visually convincing approach:

1. Create a **pre-rendered texture** that represents the "about copy" cream section (just a flat cream-colored plane with a paper texture)
2. Apply `shredWarp.glsl` to this plane via a `THREE.ShaderMaterial`
3. Pass `uProgress` (0→1 from ScrollTrigger) and `uShredderY` (0.5) as uniforms

```typescript
// ShredderCanvas.tsx — complete rebuild

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import shredWarpVert from '../../utils/glsl/shredWarp.vert'; // vertex shader
import shredWarpFrag from '../../utils/glsl/shredWarp.glsl'; // fragment shader
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// The fragment shader is in shredWarp.glsl.
// A vertex shader needs to be created: src/utils/glsl/shredWarp.vert
// (standard passthrough: outputs vUv and gl_Position)
```

**Create** `src/utils/glsl/shredWarp.vert`:
```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_FragPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```
(Note: use the correct `gl_Position`, not `gl_FragPosition` — this is a vertex shader)

The `uProgress` uniform is updated every frame via a `requestAnimationFrame` loop that reads from a `ref` that `Shredder.tsx` updates via ScrollTrigger's `onUpdate`.

See the full GLSL shader logic in `src/utils/glsl/shredWarp.glsl` — it already has the strip displacement logic.

---

### 6.2 — Load Shredder 3D Model

Replace the CSS `.machine` div in `Shredder.tsx` with an R3F `<Canvas>` that loads the shredder GLB:

```typescript
// /public/models/office_electronics_paper_shredder.glb
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/models/office_electronics_paper_shredder.glb');
```

Apply `mat_shredder_body` material overrides per `15-3d-asset-specs.md § MODEL 4`:
- Warm gray `#c0bdb5`, roughness 0.7, metalness 0.08

Add an idle jiggle animation via `useFrame`: `±2px` Y-oscillation at 0.5Hz. At scroll > 20%, increase jiggle to `±3px` at ~10Hz (motor vibration).

---

### 6.3 — ScrollTrigger Pin + Shader Uniform Update

Per `13-scroll-animation-system.md § SHREDDER`:

```typescript
// Shredder.tsx — pin this section and drive the shader progress
const progressRef = useRef(0);

useGSAP(() => {
  ScrollTrigger.create({
    trigger: sectionRef.current,
    pin: true,
    start: 'top top',
    end: '+=200%',
    anticipatePin: 1,
    onUpdate: (self) => {
      progressRef.current = self.progress; // ShredderCanvas reads this
    },
  });
});
```

Pass `progressRef` down to `ShredderCanvas` so it can update `uProgress` each frame.

---

### 6.4 — Businessman Shrug Figure

**Asset dependency**: `/public/images/businessman-shrug.png`. See `18-photo-asset-specs.md § P-04`.

Add an `<img>` element in `Shredder.tsx` positioned to the right of the headline, arms-wide pose. As `uProgress` increases past 0.5, this image should also be visually "shredded" — achieve this by applying the same CSS clip-path strip effect (approximately 8 CSS gradient strips that shift as a CSS variable changes).

**Fallback if no image**: Use a styled text placeholder `[🤷 businessman]` that still shifts/breaks apart.

---

### 6.5 — Background Transition

The section background transitions from cream (`#f0e8d8`) at the top to deep navy (`#0a0a14`) at the bottom. Implement via a CSS gradient on the section background that changes based on scroll progress (update a CSS custom property via the ScrollTrigger `onUpdate`):

```css
.section {
  background: linear-gradient(
    to bottom,
    var(--shred-top-color, #f0e8d8) 0%,
    #0a0a14 100%
  );
}
```

Update `--shred-top-color` from cream to transparent as progress increases.

---

## Acceptance Criteria

- [ ] Section pins for ~2x viewport height of scroll
- [ ] Shredder 3D model is visible and centered
- [ ] Shredder has idle jiggle animation
- [ ] At scroll > 20%, jiggle increases (motor vibration)
- [ ] The "cream plane" begins distorting into vertical strips as scroll progress increases
- [ ] At 60%+ progress, the strip warp is clearly visible (shredded appearance)
- [ ] The businessman figure also visually breaks apart at high scroll progress
- [ ] Background transitions from cream to dark navy from top to bottom of the section
- [ ] At 100% scroll, section un-pins and Contact Tease is revealed
- [ ] Mobile: CSS-only strip fallback (no WebGL) per `07-shredder.md § MOBILE`

---

---

# PHASE 7 — Contact Tease + Golden Tie

**Goal**: Build the Contact Tease section with proper GSAP entrance animations and a proper star lifecycle. Then build the full Golden Tie scene — load the tie GLB, implement cloth-like sway, add the applauding audience, and add all entrance animations.

**Spec docs**: `08-contact-tease.md`, `09-golden-tie.md`, `13-scroll-animation-system.md § CONTACT TEASE`, `13-scroll-animation-system.md § GOLDEN TIE`

---

## 7A — Contact Tease

**Files in scope**: `src/sections/07-ContactTease/ContactTease.tsx`, `src/sections/07-ContactTease/ContactTease.module.css`

### 7A.1 — Word-by-Word Headline Entrance

Per `13-scroll-animation-system.md § CONTACT TEASE`, the headline words stagger in from below. Split the headline text into individual `<span>` elements — one per word — then apply the stagger animation via GSAP ScrollTrigger.

```tsx
// Split "Still Not Convinced We're Serious About Business?" into word spans
const words = headline.split(' ');
return words.map((word, i) => (
  <span key={i} className={styles.word}>{word} </span>
));
```

```typescript
gsap.from(wordSpans, {
  opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', stagger: 0.06,
  scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
});
```

### 7A.2 — Star GSAP Lifecycle

Replace the current CSS-animation-only stars with a proper GSAP lifecycle per `13-scroll-animation-system.md § CONTACT TEASE star particle system`. Each star has: spawn position, velocity vector, rotation speed, opacity lifecycle (0 → 1 → 0), and a lifetime of 3–6 seconds. When a star completes, remove it and spawn a new one.

This is a JS `requestAnimationFrame` loop (not GSAP tweens — too many tweens). Update star positions via direct style mutation each frame.

---

## 7B — Golden Tie

**Files in scope**: `src/sections/08-GoldenTie/GoldenTie.tsx`, `src/sections/08-GoldenTie/GoldenTie.module.css`, `src/sections/08-GoldenTie/TieScene.tsx`

### 7B.1 — Load the Tie GLB

The model `Meshy_AI_A_classic_men_s_busin_0421141231_texture.glb` is available. Load it and assess its geometry. If it is a business tie model, use it. If not suitable, build a procedural tie mesh (a flat extruded shape with ~40 vertical segments, tapering from wide at bottom to narrow at top with a knot).

Per `15-3d-asset-specs.md § MODEL 2`, the tie mesh needs enough vertical edge loops for deformation. Override its material with `MeshPhysicalMaterial`:
```typescript
color: '#c9a84c', metalness: 0.88, roughness: 0.12, clearcoat: 0.3
```

### 7B.2 — Cloth Sway (Procedural Vertex Deformation)

Per `13-scroll-animation-system.md § GOLDEN TIE`:

```typescript
useFrame(({ clock }) => {
  const t = clock.getElapsedTime();
  const positions = tieGeometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    const normalizedDepth = Math.abs(Math.min(y, 0)) / maxTieLength;
    const swayAmount = normalizedDepth * normalizedDepth * 0.15;
    const newX = Math.sin(t * 0.8 + normalizedDepth * 1.5) * swayAmount;
    positions.setX(i, newX);
  }
  positions.needsUpdate = true;
  tieGeometry.computeVertexNormals();
});
```

The knot (top) vertex remains fixed at Y=0. The blade (bottom) has maximum sway.

### 7B.3 — Dramatic Spotlight

Add a `THREE.SpotLight` pointing straight down at the tie:
```typescript
<spotLight
  position={[0, 6, 0]}
  intensity={4}
  angle={0.25}
  penumbra={0.8}
  color="#ffe088"
  target-position={[0, 0, 0]}
  castShadow={false}
/>
```

Add a `SpotLightHelper` during development, remove for production.

For the visible light cone, add a CSS radial gradient behind the canvas: `radial-gradient(ellipse 40% 70% at 50% 20%, rgba(255,220,120,0.15) 0%, transparent 70%)`.

### 7B.4 — Applauding Audience

**Asset dependency**: `/public/images/applauding/clap-figure-01-a.png` through `clap-figure-05-b.png`. See `18-photo-asset-specs.md § P-07`.

Replace the current emoji placeholders with:
1. DOM `<img>` elements positioned with CSS `position: absolute` at `bottom: 0`, distributed across the viewport width
2. A CSS animation that alternates between `-a` and `-b` frames at 4fps:
```css
.person { animation: clap 0.5s steps(1) infinite alternate; }
@keyframes clap {
  from { content: url('/images/applauding/clap-figure-01-a.png'); }
  to   { content: url('/images/applauding/clap-figure-01-b.png'); }
}
```
Or better: toggle between two `<img>` tags with opacity.

**Fallback if no cutout PNGs**: Use animated emoji `👏` at larger size (`3rem`) with the existing CSS animation. This is the current state — it works as a placeholder.

### 7B.5 — Entrance Animations

Per `13-scroll-animation-system.md § GOLDEN TIE`:
- Pure black for 200ms, then spotlight fades in (600ms)
- Tie drops from above: `translateY(-100vh)` → spring settle (`back.out(1.4)`, 0.8s)
- Headline fades in with the tie settle
- Audience figures slide in from left/right edges, staggered 100ms

### 7B.6 — Headline Gold Shimmer

Per `09-golden-tie.md`, the headline has a shine sweep every ~4 seconds:
```css
.headline {
  background: linear-gradient(90deg, #c9a84c 0%, #ffd700 45%, #fff5cc 50%, #ffd700 55%, #c9a84c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer { to { background-position: 200% center; } }
```

---

## Acceptance Criteria

### Contact Tease
- [ ] Headline words stagger in from below on scroll enter
- [ ] Sub-text fades in after headline
- [ ] Gold stars spawn, drift, rotate, and fade out on a proper lifecycle loop
- [ ] Stars are behind text (z-index)
- [ ] Background is deep navy-black

### Golden Tie
- [ ] Pure black enters, spotlight turns on with flicker
- [ ] 3D tie drops from above and settles
- [ ] Tie sways continuously (cloth-like deformation, more movement at bottom)
- [ ] Tie is gold metallic (not yellow plastic) — high metalness, low roughness
- [ ] Headline is gold colored with shimmer sweep animation
- [ ] Sub-text is visible and muted
- [ ] Audience figures are visible at bottom edge (images or emoji fallback)
- [ ] Audience figures have clapping animation loop
- [ ] Entrance animations play on scroll enter

---

---

# PHASE 8 — Handshake + Good Buy

**Goal**: Build the Handshake cinematic image section and the Good Buy phones monument with camera orbit.

**Spec docs**: `10-handshake.md`, `11-good-buy.md`, `13-scroll-animation-system.md § HANDSHAKE`, `13-scroll-animation-system.md § GOOD BUY`

---

## 8A — Handshake

**Files in scope**: `src/sections/09-Handshake/Handshake.tsx`, `src/sections/09-Handshake/Handshake.module.css`

### 8A.1 — Background Image

**Asset dependency**: `/public/images/handshake.webp`. See `18-photo-asset-specs.md § P-06`.

**Fallback**: A CSS radial gradient suggesting hands in darkness: `radial-gradient(ellipse 60% 80% at 50% 50%, #3a2a1a 0%, #0d0d0d 60%)`.

Replace the current placeholder div with a proper background image container:
```tsx
<div ref={imageRef} className={styles.image}>
  {/* bg-image in CSS */}
</div>
```

### 8A.2 — Parallax + Entrance

Per `13-scroll-animation-system.md § HANDSHAKE`:

```typescript
// Entrance: zoom-out + fade-in
gsap.fromTo(imageRef.current,
  { scale: 1.05, opacity: 0 },
  { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' } }
);

// Deep parallax: image moves at 0.35x scroll speed
gsap.to(imageRef.current, {
  yPercent: -12, ease: 'none',
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
});
```

### 8A.3 — Top/Bottom Fades

The section needs gradient fades at top and bottom to blend seamlessly with surrounding sections. These are already in `Handshake.module.css` as `.fadeTop` and `.fadeBottom` — verify the gradient directions and colors are correct:
- Top: `linear-gradient(to bottom, #000000 0%, transparent 15%)`
- Bottom: `linear-gradient(to top, #0d0d0d 0%, transparent 15%)`

---

## 8B — Good Buy

**Files in scope**: `src/sections/10-GoodBuy/GoodBuy.tsx`, `src/sections/10-GoodBuy/GoodBuy.module.css`, `src/sections/10-GoodBuy/PhonesScene.tsx`

### 8B.1 — Load the Phones GLB

Replace the box geometry placeholders in `PhonesScene.tsx` with the real model:

```typescript
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/models/post_apocalyptic_style_retro_telephone.glb');
```

Apply the phone body material override per `15-3d-asset-specs.md § MODEL 3`:
- `color: '#d4cfc4'`, `roughness: 0.75`, `metalness: 0.05`

Scale and position the model to appear as a tight cluster in the center of the scene, per `11-good-buy.md § LAYOUT`.

### 8B.2 — Camera Orbit via Scroll

Per `13-scroll-animation-system.md § GOOD BUY`:

```typescript
const progress = useScrollProgress('#good-buy');

useFrame(({ camera }) => {
  const angle = progress * Math.PI * 0.3 - Math.PI * 0.1;
  camera.position.set(Math.sin(angle) * 4, 1.5, Math.cos(angle) * 4);
  camera.lookAt(0, 0.5, 0);
});
```

### 8B.3 — Spotlight + Floor Reflection

Per `11-good-buy.md`, a strong overhead spotlight on the phone cluster:
```typescript
<spotLight position={[0, 5, 0]} intensity={5} angle={0.3} penumbra={0.7} color="#ffffff" />
<pointLight position={[0, -2, 2]} intensity={0.6} color="#ffaa66" />
```

Optional floor reflection: add a `THREE.MeshStandardMaterial` with `roughness: 0.05` and low opacity on a floor plane.

### 8B.4 — "Good buy." Text Entrance

Per `13-scroll-animation-system.md § GOOD BUY`:

```typescript
gsap.fromTo('.good-buy-text',
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.good-buy-text', start: 'top 85%', toggleActions: 'play none none none' } }
);
```

Verify the "Good buy." text styling: `Playfair Display`, weight 900, `~12–14vw`, `#f0ece4`. **The period is mandatory.**

---

## Acceptance Criteria

### Handshake
- [ ] Full-bleed dark image (or fallback gradient) fills viewport
- [ ] Entrance: zoom-out from scale 1.05 + fade-in on scroll enter
- [ ] Deep parallax: image moves at ~0.35x scroll speed
- [ ] Top and bottom gradient fades blend with surrounding sections
- [ ] No text visible (default state per spec)

### Good Buy
- [ ] Real phone GLB loaded and visible as a cluster of units
- [ ] Phones are cream/gray colored (correct materials applied)
- [ ] Strong overhead spotlight lights the phones dramatically
- [ ] Camera slowly orbits the phone cluster as user scrolls (~20° arc)
- [ ] "Good buy." text is massive, centered below phones, with period
- [ ] Text fades up on scroll enter

---

---

# PHASE 9 — Footer Visual Polish

**Goal**: Rebuild the footer's visual design to match the spec — dashed CEO card border, SVG globe and laurel icons, proper three-column layout.

**Spec docs**: `12-footer.md`, `14-shared-components.md`
**Files in scope**: `src/sections/11-Footer/Footer.tsx`, `src/sections/11-Footer/Footer.module.css`

---

## What to Build

### 9.1 — CEO Card: Dashed Border

The current footer has no dashed border styling on the CEO card. Per `12-footer.md`:

```css
.ceoCard {
  border: 2px dashed rgba(240, 236, 228, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  padding: 32px;
  max-width: 540px;
  margin: 48px auto;
  display: flex;
  gap: 24px;
  align-items: center;
}
```

### 9.2 — CEO Photo

**Asset dependency**: `/public/images/ceo-phone-portrait.png`. See `18-photo-asset-specs.md § P-05`.

Replace the `📞` emoji with a proper `<img>` tag. Style it as `~120px × 150px` within the card. Fallback: a styled silhouette placeholder div.

### 9.3 — Footer Bar: Globe SVG (Left Badge)

Replace the `🌐` emoji with a proper wireframe globe SVG. The spec calls for a "parallel/meridian grid style" globe — similar to the classic UN/ISO globe icon:

```tsx
function GlobeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
         stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="20" />
      {/* Latitude lines */}
      <ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="14" />
      {/* Longitude lines */}
      <line x1="24" y1="4" x2="24" y2="44" />
      <path d="M 8 24 Q 24 18 40 24" />
      <path d="M 8 24 Q 24 30 40 24" />
    </svg>
  );
}
```

### 9.4 — Footer Bar: Laurel Wreaths (Right Badge)

Replace the `🌿 🌿` emoji with SVG laurel wreaths flanking the accessibility text:

```tsx
function LaurelLeft() {
  return (
    <svg width="28" height="48" viewBox="0 0 28 48" fill="none"
         stroke="currentColor" strokeWidth="1.2">
      {/* Curved branch with leaf sprigs at intervals */}
      <path d="M 20 44 Q 12 36 10 28 Q 8 20 12 12 Q 16 4 20 4" />
      <path d="M 16 38 Q 8 36 6 30" />
      <path d="M 13 30 Q 5 28 4 22" />
      <path d="M 12 22 Q 6 18 6 12" />
    </svg>
  );
}
// LaurelRight mirrors LaurelLeft horizontally (scaleX: -1)
```

### 9.5 — GSAP Entrance Animations

Add the stagger entrance animation from `13-scroll-animation-system.md § FOOTER`:

```typescript
useGSAP(() => {
  gsap.fromTo('.footer-col', { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
  
  gsap.fromTo('.ceo-card', { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)',
      scrollTrigger: { trigger: '.ceo-card', start: 'top 85%' } });
});
```

---

## Acceptance Criteria

- [ ] Contact grid has 3 equal columns: General Enquiries | Visit us | Social
- [ ] All column headers are `Playfair Display` weight 700
- [ ] CEO card has visible dashed border (not a solid border)
- [ ] CEO card has correct copy: "New business / Reach out today..."
- [ ] `ceo@shader.se` is a working mailto link
- [ ] Footer bar left: globe SVG icon + "WORLDWIDE BUSINESS CERTIFIED COMPANY" text
- [ ] Footer bar center: SHADER logo + tagline + copyright
- [ ] Footer bar right: laurel SVGs + "READ OUR ACCESSIBILITY STATEMENT" link
- [ ] All links open correctly (email clients, new tabs for social)
- [ ] Entrance animations stagger in on scroll

---

---

# PHASE 10 — Cross-Cutting Polish

**Goal**: Apply all site-wide quality improvements that span multiple sections. This phase should be done last before QA, once all sections are individually complete.

**Spec docs**: `13-scroll-animation-system.md § PREFERS-REDUCED-MOTION`, `17-qa-checklist.md`, `14-shared-components.md`, `16-dev-environment.md`

---

## What to Build

### 10.1 — `prefers-reduced-motion` Across All Sections

Every section that uses GSAP scroll animations must be wrapped with the motion check. The utility `prefersReducedMotion` exists in `src/utils/motion.ts` — apply it:

```typescript
import { prefersReducedMotion } from '../../utils/motion';

useGSAP(() => {
  if (prefersReducedMotion) {
    // Immediately show final state, no animations
    gsap.set([headlineRef.current, ctaRef.current], { opacity: 1, y: 0 });
    return;
  }
  // ... normal animation code
});
```

**For Three.js sections** (Hero, Golden Tie, Good Buy): on `prefers-reduced-motion`, disable camera orbits, use static render only.

---

### 10.2 — Mobile Responsive Pass

For every section, verify against the mobile spec in its respective doc. Key items:
- Hero: 3D computer hidden or simplified on `< 768px`, text full-width centered
- Film Strip: flat horizontal swipe (touch events) instead of 3D perspective strip
- Shredder: CSS-only strip fallback per `07-shredder.md § MOBILE`
- Golden Tie: simplified tie (no vertex deformation), 3 audience figures
- Footer: 2-column grid contact, stacked footer bar

Add breakpoints in each section's `.module.css` where they are missing.

---

### 10.3 — Performance Audit

- Add `will-change: transform` to film strip and parallax images only (max 4 elements)
- Confirm `dpr={[1, 1.5]}` on mobile for all R3F Canvas elements (not `[1, 2]`)
- Confirm all project images in carousel use `loading="lazy"`
- Add `decoding="async"` to all `<img>` elements
- Confirm `useGLTF.preload()` is called for all models

---

### 10.4 — Accessibility Pass

Per `17-qa-checklist.md § SECTION 7`:
- All `<canvas>` and 3D elements have `aria-hidden="true"`
- All decorative images have `alt=""`
- All meaningful images have descriptive `alt` text
- All interactive buttons have `aria-label`
- Focus rings use gold outline: `outline: 2px solid var(--color-accent-gold)`
- Color contrast ratios: verify all body text meets 4.5:1 against its background
- `skip-to-content` link: verify it's present and functional in `index.html`

---

### 10.5 — Safari-Specific Fixes

Test in Safari 17+:
- Lenis smooth scroll compatibility (may require `lerp` option adjustment)
- `backdrop-filter` fallback if used
- WebGL context creation succeeds
- CSS `perspective` for film strip renders correctly

---

### 10.6 — Grain Overlay on Preloader

Per `14-shared-components.md § GRAIN OVERLAY`, the grain canvas should NOT render over the preloader (the preloader has its own scanline effect — compound noise would be too heavy). Add a conditional in `GrainOverlay.tsx`:

```typescript
// Don't render grain when preloader is active
// Pass a prop or read from a context/store:
if (!isPreloaderDone) return null;
```

This is already gated in `App.tsx` (`GrainOverlay` only renders when `!isLoading`), but verify this is working correctly.

---

## Acceptance Criteria

- [ ] All scroll animations use `prefersReducedMotion` guard
- [ ] Three.js camera orbits are disabled at `prefers-reduced-motion: reduce`
- [ ] All sections are usable on iPhone 14 (Safari) and Samsung Galaxy S24 (Chrome)
- [ ] No horizontal scroll anywhere (except film strip section)
- [ ] Film strip is swipeable via touch on mobile
- [ ] All images are lazy-loaded
- [ ] R3F Canvas uses `dpr={[1, 1.5]}` on mobile
- [ ] No console errors on production build
- [ ] `npm run build` passes without TypeScript errors

---

---

# PHASE 11 — QA & Launch Verification

**Goal**: Complete the full QA checklist per `17-qa-checklist.md` before production deploy.

**Spec doc**: `17-qa-checklist.md` (this is the authoritative checklist — use it directly)

---

## Process

1. Run `npm run build && npm run preview` to test the production build locally
2. Open `17-qa-checklist.md` and work through every checkbox in order
3. Record results in the sign-off table at the bottom of that doc
4. Any `FAIL` that is a blocker must be resolved before deploying to production
5. Non-blocker issues can be shipped and fixed in a hotfix

## Additional Pre-Launch Items

### Lighthouse Targets
Per `17-qa-checklist.md § SECTION 6`:
- Performance: ≥ 70
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- LCP: < 2.5s

Run `npm run build` and test on staging with Lighthouse mobile preset.

### Cloudflare Pages Deploy
Per `16-dev-environment.md § DEPLOYMENT`:
- Confirm `_headers` file is in `/public/` with correct cache-control rules
- Confirm `_redirects` is in `/public/` for SPA routing
- Set `VITE_ENABLE_PRELOADER=true` in Cloudflare environment variables
- Node version: 20

### Final Copy Check
Per `17-qa-checklist.md § SECTION 3`, verify every text string verbatim — especially:
- "Good buy." (with period, capital G, lowercase b)
- "Version 1.02"
- The full copyright line
- CEO email: `ceo@shader.se`
- Address: `Laxholmstorget 3, 602 21 Norrköping, Sweden`

---

## Acceptance Criteria

- [ ] All 140 items in `17-qa-checklist.md` are checked
- [ ] Zero blocker items remain
- [ ] Lighthouse Performance ≥ 70 on mobile
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Tested in: Chrome latest, Firefox latest, Safari 17+, Edge latest
- [ ] Tested on: iPhone 14 (Safari), Samsung Galaxy S24 (Chrome), iPad (Safari)
- [ ] `Book a call` Cal.com flow works end-to-end
- [ ] All social links open correctly
- [ ] Deploy sign-off obtained from Lead Dev + Project Lead

---

---

## ASSET PRODUCTION PARALLEL TRACK

While Phases 1–11 are in progress, the following assets can be produced in parallel. Each phase that depends on an asset has a fallback so development is never blocked.

| Asset | Spec | Used In Phase | Fallback |
|-------|------|--------------|---------|
| `about-office-cubicles.webp` | `18-photo-asset-specs.md § P-01` | Phase 5 | CSS dark gradient |
| `about-retro-computers.webp` | `18-photo-asset-specs.md § P-02` | Phase 5 | CSS warm gradient |
| `businessman-about.png` | `18-photo-asset-specs.md § P-03` | Phase 5 | Styled silhouette placeholder |
| `businessman-shrug.png` | `18-photo-asset-specs.md § P-04` | Phase 6 | Text placeholder `[🤷]` |
| `ceo-phone-portrait.png` | `18-photo-asset-specs.md § P-05` | Phase 9 | Styled silhouette placeholder |
| `handshake.webp` | `18-photo-asset-specs.md § P-06` | Phase 8 | CSS radial gradient |
| `carousel/project-*.webp` | `18-photo-asset-specs.md` | Phase 4 | Gradient placeholders in FilmStrip |
| `applauding/clap-figure-*.png` | `18-photo-asset-specs.md § P-07` | Phase 7 | `👏` emoji at 3rem |
| Fonts in `/public/fonts/` | `16-dev-environment.md § 6` | Phase 1 | Google Fonts CDN fallback |

---

## QUICK REFERENCE: Files Per Phase

| Phase | Files Modified |
|-------|---------------|
| 1 | `src/components/shared/SectionAnchor.tsx`, `src/components/Navbar/Navbar.tsx`, `src/components/Navbar/Navbar.module.css`, `src/main.tsx`, `src/hooks/useLenis.ts` |
| 2 | `src/components/Preloader/Preloader.tsx`, `src/components/Preloader/Preloader.module.css` |
| 3 | `src/sections/01-Hero/HeroScene.tsx`, `src/hooks/useScrollProgress.ts` |
| 4 | `src/sections/02-SelectedWork/SelectedWork.tsx`, `src/sections/02-SelectedWork/FilmStrip.module.css`, `src/utils/constants.ts` |
| 5 | `src/sections/03-AboutHero/AboutHero.module.css`, `src/sections/04-AboutCopy/AboutCopy.tsx`, `src/sections/04-AboutCopy/AboutCopy.module.css`, `src/sections/05-AboutVintage/AboutVintage.module.css` |
| 6 | `src/sections/06-Shredder/Shredder.tsx`, `src/sections/06-Shredder/ShredderCanvas.tsx`, `src/sections/06-Shredder/Shredder.module.css`, `src/utils/glsl/shredWarp.vert` *(new)* |
| 7 | `src/sections/07-ContactTease/ContactTease.tsx`, `src/sections/07-ContactTease/ContactTease.module.css`, `src/sections/08-GoldenTie/GoldenTie.tsx`, `src/sections/08-GoldenTie/GoldenTie.module.css`, `src/sections/08-GoldenTie/TieScene.tsx` |
| 8 | `src/sections/09-Handshake/Handshake.tsx`, `src/sections/09-Handshake/Handshake.module.css`, `src/sections/10-GoodBuy/GoodBuy.tsx`, `src/sections/10-GoodBuy/GoodBuy.module.css`, `src/sections/10-GoodBuy/PhonesScene.tsx` |
| 9 | `src/sections/11-Footer/Footer.tsx`, `src/sections/11-Footer/Footer.module.css` |
| 10 | All section `.tsx` files (motion guard), all section `.module.css` (mobile breakpoints) |
| 11 | Deploy config, `public/_headers`, `public/_redirects` |
