# 07 — SHREDDER
## "Had Enough Reading? Let's Shred This Thing."

---

## OVERVIEW

The Shredder section is the most technically inventive DOM section of the site. It is a **interactive scroll-triggered page destruction effect** where the entire previous "light world" (cream background, editorial copy) appears to be fed through a physical **paper shredder** mounted at the center of the viewport. As the user scrolls, the page gets shredded — the content above warps and distorts into vertical strips, as if passing through shredder blades.

This section is the comedic climax of the About narrative: "We've told you everything. Now let's destroy the corporate brochure."

---

## VISUAL BREAKDOWN

### Pre-Shred State (section entry)
The section initially renders with:
- **Background**: cream `#f0e8d8` — continuous from the about-copy section
- **Headline**: "Had Enough Reading? Let's Shred This Thing."
- **A retro businessman** cutout (different from the about-copy one) standing to the right of the page, arms wide/shrugging — looks like he's gesturing to the shredder
- **The shredder machine**: centered horizontally, near vertical center of viewport

### The Shredder Machine (3D or CSS)
A rendered-quality depiction of an **office paper shredder** — the countertop/desktop variety:

**Visual appearance**:
- Boxy, beige/tan body — classic 1990s office equipment aesthetic
- A **paper input slot** at the top center
- Two flanking **orange/yellow side columns** (the waste basket wings)
- A label on the front face reading **"SHREDDER"** in the same brand logo style (with the rainbow-striped icon)
- The shredder appears to be **3D rendered** and composited into the 2D layout — likely a GLB model rendered in R3F, or a very convincing CSS/SVG illustration

### The Shred Effect

This is a **WebGL canvas warp** that creates the paper shredder visual illusion:

**Technical approach**:
A full-viewport canvas element sits on top of the page content. It **samples the DOM content** (via `html2canvas` or a pre-rendered texture) and applies a GLSL displacement shader.

**GLSL warp description**:
```
The area ABOVE the shredder's input slot is the "unshredded paper"
The area BELOW the shredder is the "shredded output"

As scroll progress increases (0 → 1):
- The unshredded area compresses vertically (the page "feeds in")
- A wave distortion is applied to the content in the shredder zone
- Below the shredder: content is rendered as vertical strips with:
  - Random per-strip horizontal displacement (±2–8px per strip)
  - Very slight strip tilt (±0.5–2° per strip)
  - Strips are ~12–16px wide
  - Inter-strip gaps: ~2px (pure black)
  - Strips get progressively more displaced further down (they fall apart)
```

**Scroll-triggered stages**:
- **0%**: Page looks normal, shredder sits idle
- **20%**: Shredder machine "powers on" — a subtle motor hum animation on the shredder body
- **40%**: The page content ABOVE the shredder begins warping — the distortion increases
- **60%**: The middle zone shows strong warp — the content is visibly "going through the blades"
- **80%**: The shredded strips below are fully visible, the headline and man are warped
- **100%**: The entire cream section is "destroyed" — full shred effect visible, transition to next section begins

**The businessman figure during the shred**:
- He appears to be feeding the page INTO the shredder
- As the warp effect intensifies, his image ALSO gets shredded/warped — he goes through the machine too
- This is the comedic punchline — the corporate spokesman is consumed by the machine

### Color Inversion at Bottom
- Below the shredder output zone, the background transitions from cream to a deep dark navy/purple (`#0a0a14`)
- This is the "contact" section beginning to emerge from under the destroyed about section

---

## LAYOUT SPEC

```
VIEWPORT (100vw × 100vh, PINNED)

[Cream background]
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  "Had Enough Reading?                [BUSINESSMAN]       │
│   Let's Shred This Thing."           (arms wide)         │
│                                      ███████████         │
│                                      ███████████         │
│     ┌─────────────────────────────────────────┐         │
│     │           [SHREDDER MACHINE]            │         │
│     │  [ ] [ ] [ ] SHREDDER [ ] [ ] [ ]      │         │
│     │           [input slot]                  │         │
│     └─────────────────────────────────────────┘         │
│                                                          │
│  ░ ░ ░ ░ ░ ░  [shredded strips falling] ░ ░ ░ ░ ░ ░    │
│  ░ ░ ░ ░ ░ ░                            ░ ░ ░ ░ ░ ░    │
│                                                          │
└──────────────────────────────────────────────────────────┘
[Navy/dark section begins]
```

---

## ANIMATION DETAILS

### Shredder Machine Idle
- Idle state: small subtle bounce/jiggle on the shredder body (GSAP `yoyo: true` on Y position, ±2px, 2s period)
- No motion until scroll begins

### Shredder "Active" State (scroll > 20%)
- The input slot area at the top of the shredder shows the page content "entering"
- A horizontal line of distortion crosses the page at the shredder's input height
- The machine body shakes slightly more (motor vibration: ±3px at 20Hz frequency, CSS animation)

### Headline Warp
- "Had Enough Reading? Let's Shred This Thing." is also subject to the warp shader
- As the warp increases, the headline letters are sliced by the vertical strip effect
- The text breaks apart into vertical columns, each slightly offset

### Businessman Warp
- The businessman cutout image is also warped by the GLSL pass
- At 80% scroll, he is visibly being "fed through" — his torso is striped/sliced

### Exit
- At 100%, the canvas warp fades out / the cream layer scales down to nothing
- The deep navy contact section is now fully visible

---

## SHADER (GLSL)
```glsl
// shredWarp.glsl
uniform sampler2D uTexture;
uniform float uProgress;  // 0.0 → 1.0 (scroll progress)
uniform float uShredderY; // normalized Y position of shredder (e.g., 0.5)

varying vec2 vUv;

float random(float x) {
  return fract(sin(x * 127.1) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Strip width in UV space (approx 14px on 1920px = 0.0073)
  float stripWidth = 0.0075;
  float stripIndex = floor(uv.x / stripWidth);
  
  // How far below the shredder is this fragment?
  float belowShredder = max(0.0, uShredderY - uv.y);
  float shredZone = smoothstep(0.0, 0.4, belowShredder);
  
  // Per-strip random displacement
  float dispX = (random(stripIndex) - 0.5) * 0.02 * uProgress * shredZone;
  float dispY = (random(stripIndex + 100.0) - 0.5) * 0.005 * uProgress * shredZone;
  
  uv.x += dispX;
  uv.y += dispY;
  
  // Gaps between strips
  float inGap = step(0.85, fract(uv.x / stripWidth));
  
  vec4 color = texture2D(uTexture, uv);
  color.a *= (1.0 - inGap * uProgress * shredZone);
  
  gl_FragColor = color;
}
```

---

## ASSETS REQUIRED

- [ ] `shredder-machine.glb` — 3D model of paper shredder OR a high-quality CSS/SVG illustration
  - If 3D: beige/tan body, input slot at top, "SHREDDER" label on front with rainbow icon
  - If CSS/SVG: same visual, very detailed
- [ ] `businessman-shrug.webp` — cutout PNG of man gesturing/shrugging
  - Spec: Male, business casual (shirt + tie), arms spread wide or upward
  - Transparent background
  - ~400px tall at 2x
  - Same "vintage stock photo" treatment as about-copy figure

---

## COPY (exact strings)

```
Had Enough Reading? Let's Shred This Thing.
```
*(Sub-text visible from live site data)*:
```
We've got one last trick up our sleeve.
```

---

## MOBILE BEHAVIOR

- The full GLSL warp effect is disabled on mobile (too heavy)
- Instead: a **CSS-only strip animation** where the section splits into ~8 vertical strips that each animate downward with staggered delays (Framer Motion or CSS keyframes)
- The shredder machine is shown as a static SVG/image
- The businessman cutout is hidden (too complex for mobile layout)
- The headline and sub-text remain fully visible
