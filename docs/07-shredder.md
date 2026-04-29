# 07 - SHREDDER
## "Had Enough Reading? Let's Shred This Thing."

---

## OVERVIEW

The Shredder section is the site's paper-destruction transition from the cream corporate-brochure world into the dark contact act. In the captured demo, the gag is not a standalone desktop shredder sitting in the middle of the page. It is a **full-width horizontal shredder gate** that sweeps upward through the viewport while the cream page is pulled through it.

The effect turns the headline, the shrugging salesman, and the cream paper surface into a warped field of vertical black shred lines. As the shredded cream sheet rises away, the navy contact-tease section emerges underneath.

**Observed in the 2026-04-29 Chrome capture:** the key transition runs from roughly `00:22.5` to `00:25.3`.

---

## VISUAL BREAKDOWN

### Entry From Previous Section

The shredder is introduced immediately after the cream CTA section:

- The previous block contains the `SHADER` logo, body copy, a dashed booking-card module, and a dark "Book a Call Today" button.
- A stacked rainbow rule spans the full viewport width and separates the previous copy from the shredder joke.
- The persistent fixed nav remains visible at the top: logo at left, links centered, phone icon plus `Book a call` at right.
- The page retains the warm paper color and soft vintage blur/grain treatment.

### Pre-Shred Panel

The main panel is a wide cream page, almost like a printed brochure being fed into an office machine.

- **Background:** warm cream / old paper, close to `#f0e8d8`.
- **Top divider:** 6-8 thin horizontal rainbow stripes, slightly wavy with the page perspective.
- **Headline:** large serif text on the left:
  ```text
  Had Enough
  Reading? Let's
  Shred This Thing.
  ```
- **Figure:** a retro businessman cutout on the right, smiling with both hands raised in a shrug.
- **Composition:** headline sits left-of-center; businessman occupies the right third and is cropped at the bottom as the shred begins.

### Shredder Gate

The machine reads as the **top head / mouth of a shredder**, not the full bin.

- Full-width horizontal metal bar crossing the viewport.
- Warm gray/olive office-equipment body with subtle bevels and shadows.
- Small centered black badge that reads `SHREDDER`.
- Decorative vent slits and small dark hardware details on both sides of the badge.
- The gate starts near the lower half of the panel, then scrolls/sweeps upward as the paper is consumed.
- A thin dark shadow under the gate sells the idea that the paper is passing behind a physical lip.

### Shredded Output

Below the gate, the cream panel becomes a hanging curtain of distorted paper strips.

- Dense vertical black lines run from the gate downward through the cream paper.
- Lines are not evenly mechanical; they bend in soft sine/noise waves.
- Some lines thicken into dark ribbons while others remain hairline thin.
- The original content remains visible behind the lines but is horizontally warped and ghosted.
- The headline skews and doubles as it passes through the strips.
- The businessman is also consumed by the pattern, with his shirt, tie, face, and hands visibly bent by the vertical waves.
- The bottom edge of the cream sheet becomes irregular and slightly glowing, like a torn/wet edge against the dark section.

### Dark Contact Reveal

The next section is visible during the shred rather than after a hard cut.

- Deep navy / blue-black gradient rises from the bottom, approximately `#05060e` to saturated cobalt-navy.
- The contact-tease headline begins appearing while the shredded cream sheet still hangs at the top:
  ```text
  Still Not
  Convinced We're
  Serious About
  Business?
  ```
- Sub-text appears below in small serif text:
  ```text
  We've got one last trick up our sleeve.
  ```
- By the end of the transition, the shredded cream curtain remains only as a wavy remnant near the top edge.

---

## FRAME-BY-FRAME BEATS

These timings are from the supplied MP4 and should be treated as visual reference, not hard-coded animation durations.

| Time | Observed state |
|------|----------------|
| `00:22.50` | The CTA copy and booking card are still visible above. The rainbow divider and the shredder headline enter below. |
| `00:22.75` | The headline and shrugging businessman are clear. The shredder gate is just about to enter from the bottom. |
| `00:23.00` | The metal gate crosses the lower third. Thin vertical shred lines appear below it; navy peeks in at the very bottom. |
| `00:23.25` | The gate intersects the headline. `Shred This Thing.` is dragged into the strip field while the man starts to pass through. |
| `00:23.75` | The gate is near the top. Most of the cream panel is now striped and wavy, with the man and headline heavily distorted. |
| `00:24.25` | The gate has effectively left the frame. The whole cream page behaves like a suspended warped paper curtain. |
| `00:24.75` | The dark contact section rises; the small teaser line is visible below the torn cream edge. |
| `00:25.25` | The contact headline is centered on navy while the shredded cream remnant stays at the top as an exit flourish. |

---

## LAYOUT SPEC

```text
VIEWPORT, DESKTOP

[fixed nav over page]
Logo                Home  Selected Work  About Us  Contact          Book a call

[cream paper]
================================================ rainbow rule ================

      Had Enough                         [shrugging retro businessman]
      Reading? Let's                     [smiling, hands raised]
      Shred This Thing.

--------------------------- metal SHREDDER gate -----------------------------
|||||||||||||||||||||||||||| wavy shredded paper |||||||||||||||||||||||||||||
|||||||||||||||||||||||||||| text/man distortions ||||||||||||||||||||||||||||

~~~~~~~~~~~~~~~~~~~~~~~~ irregular cream edge ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

[deep navy contact tease rising underneath]

                    Still Not
                    Convinced We're
                    Serious About
                    Business?

                    We've got one last trick up our sleeve.
```

---

## ANIMATION DETAILS

### Scroll Relationship

- The sequence should feel scroll-bound and continuous, not like a timed modal animation.
- The shredder gate translates upward through the viewport as scroll progresses.
- The cream paper content above the gate remains mostly clean.
- The content below the gate is rendered through the shred distortion.
- The navy contact section rises underneath and is visible before the shredded paper fully exits.

### Progress Stages

- **0-20%:** Previous cream CTA section scrolls away; rainbow rule and shredder headline enter.
- **20-35%:** Headline and businessman settle into the pre-shred composition.
- **35-50%:** Shredder gate enters from the lower viewport; first vertical strip lines appear below it.
- **50-70%:** Gate crosses headline and figure; strip distortion grows stronger and more wavy.
- **70-85%:** Gate exits near the top; the entire cream panel is now a wavy shredded curtain.
- **85-100%:** Navy contact tease rises and becomes the primary section; cream strips recede to the top edge.

### Figure Treatment

- The businessman should not disappear before the shred. He is part of the punchline.
- Keep his original cutout visible in the clean panel, then duplicate/mask/warp him in the shredded layer.
- The strongest distortion should hit his torso and tie first, then his face and hands as the gate passes upward.
- Opacity can drop slightly in the shredded layer so he feels printed into the paper rather than floating above it.

### Typography Treatment

- The headline is not merely clipped into separate rectangles.
- As it enters the shred field, it should skew and smear horizontally with the vertical waves.
- A slight ghost/double-image is acceptable and matches the VHS/CRT feeling of the capture.

### Nav Behavior

- The fixed nav remains above the effect.
- On cream, nav text is dark.
- As the navy section takes over, nav contrast should switch toward light text, but the switch should not flicker during the mixed cream/navy overlap.

---

## TECHNICAL APPROACH

The captured effect can be implemented without a heavy 3D paper-shredder model. The important pieces are the full-width gate, a duplicated paper layer, and a convincing vertical line displacement.

### Recommended Layer Stack

```tsx
<section className="shredder" ref={sectionRef}>
  <div className="paperClean">
    <RainbowRule />
    <h2>Had Enough Reading? Let's Shred This Thing.</h2>
    <img src="/images/businessman-shrug.png" alt="" />
  </div>

  <div className="shreddedPaper" aria-hidden="true">
    <div className="paperDuplicate">
      {/* same headline + businessman, rendered behind a strip mask */}
    </div>
  </div>

  <ShredderGate />

  <div className="contactPreview" aria-hidden="true">
    <h2>Still Not Convinced We're Serious About Business?</h2>
    <p>We've got one last trick up our sleeve.</p>
  </div>
</section>
```

### CSS/SVG Option

A convincing implementation can use:

- `repeating-linear-gradient()` for the vertical black strip field.
- CSS custom properties driven by ScrollTrigger: `--shred-progress`, `--gate-y`, `--wave-amount`.
- An SVG `feTurbulence` + `feDisplacementMap` filter on the duplicated content layer.
- A mask/clip that only reveals the shredded layer below the gate.
- A pseudo-element for the irregular cream bottom edge.

### WebGL Option

If using WebGL, target the observed visual: wavy vertical line distortion and a growing reveal below the gate. This is closer than random separated paper scraps.

```glsl
// shredLines.frag - conceptual reference
uniform sampler2D uTexture;
uniform float uProgress; // 0.0 to 1.0
uniform float uGateY;    // normalized gate position from top, 0.0 to 1.0
uniform vec2 uResolution;

varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;

  // In UV space y grows upward in many setups; adjust to match renderer.
  float belowGate = smoothstep(uGateY - 0.02, uGateY + 0.02, 1.0 - uv.y);
  float lineCount = 120.0;
  float lineId = floor(uv.x * lineCount);
  float localX = fract(uv.x * lineCount);

  float wave = sin(uv.y * 18.0 + lineId * 0.33) * 0.012;
  wave += sin(uv.y * 41.0 + hash(lineId) * 6.283) * 0.006;

  uv.x += wave * belowGate * uProgress;

  vec4 paper = texture2D(uTexture, uv);

  float variableWidth = mix(0.08, 0.34, hash(lineId));
  float stripe = 1.0 - smoothstep(variableWidth, variableWidth + 0.08, localX);
  float ink = stripe * belowGate * smoothstep(0.25, 1.0, uProgress);

  vec3 color = mix(paper.rgb, vec3(0.03, 0.025, 0.02), ink * 0.85);
  gl_FragColor = vec4(color, paper.a);
}
```

---

## ASSETS REQUIRED

- [ ] `shredder-gate.svg` or CSS component
  - Full-width horizontal office-machine head.
  - Warm gray/olive plastic or metal face.
  - Center black badge reading `SHREDDER`.
  - Vent slits and small hardware details flanking the badge.
  - Should scale cleanly across desktop widths.
- [ ] `businessman-shrug.png` or `.webp`
  - Transparent cutout.
  - Retro/vintage stock-photo treatment.
  - Male office worker, shirt and tie, smiling or mock-exasperated, both hands raised.
  - Tall enough for desktop crop; target 900-1200px high source.
- [ ] `paper-grain.webp`
  - Subtle cream paper texture/noise used across the clean and shredded layers.

**Do not prioritize** a full standalone `shredder-machine.glb` for this section. The demo reads as a 2D/illustrated horizontal gate, and the distortion effect is the hero.

---

## COPY (EXACT STRINGS)

### Shredder Panel

```text
Had Enough Reading? Let's Shred This Thing.
```

### Contact Tease Revealed During Exit

```text
Still Not Convinced We're Serious About Business?
```

```text
We've got one last trick up our sleeve.
```

---

## MOBILE BEHAVIOR

- Keep the cream-to-navy gag, but simplify the effect.
- Use the static `shredder-gate` as a horizontal divider.
- Replace WebGL/SVG displacement with a CSS-only mask:
  - 16-24 vertical stripes on tablet.
  - 8-12 wider stripes on small phones.
  - Stagger each stripe upward/downward by a small amount as the navy section rises.
- The businessman can be cropped or hidden below `480px` width if he fights the headline.
- Preserve the exact headline and the contact tease copy.
- Avoid long pinned scroll on small screens; let the transition complete in about one viewport height.

