# 02 — HERO
## "A Creative Development Studio, Plugged into the Future"

---

## OVERVIEW

The hero is the first section seen after the preloader exits. It is a **full-viewport, dark cinematic composition** combining large hand-set serif type on the left with a **3D interactive SuperPET computer** on the right. The computer screen cycles through footage/textures of Shader's work and client projects.

The mood is: **dark, atmospheric, faintly eerie, technically grand**. Like a 1980s technology advertisement shot by a photographer who later won a Cannes award. Fog drifts. The computer glows. The headline is massive.

---

## VISUAL BREAKDOWN

### Background
- **Solid near-black**: `#0d0d0d`
- **Volumetric fog / smoke**: A soft, animated fog/mist fills the lower portion of the viewport — it's purple-gray (`rgba(80, 60, 100, 0.3)`) and drifts slowly from bottom-right to center
- The fog is achieved with either:
  - A **Three.js particle system** (preferred, ~1500 small sprites)
  - Or a **CSS layered radial gradients** that shift position slowly with keyframe animation
- There is a **subtle vignette** around the entire hero: dark inward from all four edges

### Left Column — Typography
Position: left-aligned, starting at approximately `left: 8vw`, vertically centered in viewport

**Headline** (4 lines):
```
A Creative
Development
Studio, Plugged
into the Future
```
- Font: `Playfair Display`, weight 900
- Size: `~9vw` (responsive; never smaller than 52px on mobile)
- Color: `#f0ece4` (warm white)
- Line height: `0.95` — lines are extremely tight
- The text has a **very subtle chromatic aberration** on each letter — a 1–2px RGB split (red shifted 1px left, blue shifted 1px right). This is a CSS `text-shadow` or GSAP/Canvas-based effect. It should be barely noticeable — perceptible on close inspection, subliminal from normal viewing distance.
- The text does NOT have a hover effect, but it does have a **scroll-parallax**: it moves upward at ~0.6x scroll velocity as the user scrolls down (GSAP ScrollTrigger scrub)

**Sub-text / CTA row**:
Below the headline, separated by ~48px:
```
Scroll to Inspect Our Closed Deals  [icon] [icon] [icon]
```
- Font: `EB Garamond`, 1rem, `#8a8680` (muted)
- The three icons are scroll-indicator icons — animated looping "down scroll" arrows or circular arrows. They appear to be SVG icons that pulse/cycle in sequence (icon 1 → icon 2 → icon 3 → repeat) every 1.5s
- These fade in ~800ms after the preloader exits

### Right Column — 3D SuperPET Computer
Position: right side of viewport, centered vertically, slight downward offset (~5% from center)

**The Model**:
- A **Commodore SuperPET SP9000** (or visually identical CBC Micro retro computer) rendered in Three.js
- The model includes: the computer body/keyboard unit, the elevated CRT monitor on top, and the branding label on the front reading "SHADER"
- The model label on the front left reads "SHADER" (branded replacement of original "SuperPET" label)
- The monitor label area also reads "SuperPET SP9000" — this is the original detail, preserved for authenticity

**Model Size / Position**:
- Takes up approximately the **right 55% of the viewport**
- Slightly oversized — the keyboard extends below the viewport fold, the top of the monitor is near the top of the viewport
- Positioned so the screen of the computer is roughly at horizontal center of the full viewport

**Lighting**:
- Key light: **warm, slightly orange spot** from top-right — illuminates the top-right of the computer body
- Fill light: **cool blue-purple** from left — creates separation and depth
- The fog/atmosphere around the computer is lit by a very dim ambient purple-blue
- The computer screen **self-illuminates** — it is a strong light source in the scene

**Computer Screen Texture**:
- The monitor screen shows **looping video/animation content** — footage of Shader's work
- Content cycles through: satellite imagery/city lights from orbit, isometric game/map views, 3D design renders
- Each clip plays for ~4–6 seconds before cross-fading to next
- The screen has a subtle **CRT mesh overlay** (a fine dot-matrix or slot-mask texture at low opacity)
- The screen glow **illuminates the surrounding fog** — there is a colored bloom effect radiating outward from the screen into the fog

**Scroll Animation**:
- As the user begins scrolling, the camera slowly **pans around the computer** (orbit-style)
- The computer also **zooms slightly toward the viewer** as scroll progresses — the monitor takes up more of the screen until it fills the viewport
- At ~30% scroll progress, the camera is **looking directly into the monitor** — the work carousel section begins with the computer screen as the transition point
- This is a GSAP ScrollTrigger scrub applied to the Three.js camera position/rotation

---

## NAVBAR (appears over hero)

- Position: `fixed`, top of viewport
- Left: SHADER logo (rainbow icon + wordmark), approx 160px wide
- Center: `Home | Selected Work | About Us | Contact`
  - All links use `EB Garamond`, underline decoration
  - Active page: no additional styling (underline already present on all)
  - Hover: color brightens to `#f0ece4`
- Right: `📞 Book a call` — telephone receiver icon (retro style, filled) + italic text
- Background: transparent (the dark hero shows through)
- A very thin `1px` separator line at bottom: `rgba(255,255,255,0.06)`

---

## ANIMATION — ON ENTER

After preloader exits (white flash resolves):

1. **t=0ms**: Hero background fades from white (the exit flash) to `#0d0d0d` over 300ms
2. **t=300ms**: The 3D computer **drops in from slightly above** its rest position — a 0.8s ease-out settle
3. **t=400ms**: Headline text lines **stagger in from left** — each line slides from `translateX(-20px) opacity:0` to rest, 80ms between each line
4. **t=800ms**: Sub-text / scroll CTA fades in
5. **t=1000ms**: Fog animation begins (particles or gradient shift starts)
6. **t=1200ms**: Navbar links fade in (they were present but at 0 opacity)

---

## SCROLL TRANSITION OUT

As the user scrolls down past the hero:
- The left-column text parallaxes upward and fades out
- The camera moves inside/into the 3D computer monitor
- This triggers a seamless cut to the **Selected Work** section

---

## ASSETS REQUIRED

- [ ] `superpet-computer.glb` — Commodore SuperPET 3D model with:
  - [ ] Separate mesh for the screen (receives video texture)
  - [ ] "SHADER" branding on body
  - [ ] DRACO compressed, < 3MB
- [ ] Screen video textures (short loops, ~5s each, muted .mp4 or .webm):
  - [ ] `screen-01-satellite.mp4` — Earth from space / city lights
  - [ ] `screen-02-citymap.mp4` — isometric city/map render
  - [ ] `screen-03-design.mp4` — design renders, 3D product viz
- [ ] Fog particle sprite: `smoke-particle.webp` (32×32, white circle, soft edges)

---

## COPY (exact strings)

**Headline**:
```
A Creative
Development
Studio, Plugged
into the Future
```

**Sub-CTA**:
```
Scroll to Inspect Our Closed Deals
```

---

## MOBILE BEHAVIOR

- The 3D computer is hidden or reduced on mobile (< 768px)
- Text takes full width, centered
- Font size: `clamp(44px, 12vw, 80px)`
- Sub-CTA text remains but scroll icons are hidden
- Background fog: CSS gradient only (no 3D particles), static with slow `@keyframes` drift
- Navbar collapses to hamburger menu (same fonts/style, full-screen overlay on open)
