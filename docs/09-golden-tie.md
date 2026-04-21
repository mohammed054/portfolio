# 09 — GOLDEN TIE
## "Check Out This Golden Tie"

---

## OVERVIEW

The Golden Tie section is the comedic climax of the entire site. A **physically-simulated 3D golden necktie** hangs and sways in the center of a dark stage, illuminated by a dramatic spotlight. Around it, a group of vintage-cutout businesspeople enthusiastically **applaud**. The headline rewards the user for scrolling this far.

It is absurdist, theatrical, and completely committed to the bit. The 3D tie must be genuinely beautiful — gold-metallic, soft-body physics simulated, catching the light as it moves.

---

## VISUAL BREAKDOWN

### Background
- **Pure black**: `#000000` — the darkest section on the site
- A dramatic **spotlight cone** from above center — a circular pool of warm golden-white light (`rgba(255, 220, 120, 0.15)`) illuminating the center of the scene, fadeout to pure black at edges
- This is Three.js `SpotLight` pointing straight down at the tie, with visible light cone (volumetric if possible via custom shader, or a CSS radial gradient)
- The rest of the scene is extremely dark — the contrast between lit and unlit is stark

### Headline
**"Check Out This Golden Tie"**:
- Font: `Playfair Display`, weight 700
- Size: `~6.5vw`
- Color: Warm gold: `#e8c96a` — it glows slightly (text-shadow: `0 0 40px rgba(200, 160, 60, 0.4)`)
- Position: **top center of viewport**, approximately `15vh` from top
- The headline appears to have a subtle **shimmer/shine** animation: a CSS or GSAP `background-clip: text` animation where a bright highlight sweeps left to right across the gold text every ~4 seconds

**Sub-text**:
**"You made it this far. You deserve a tie-break."**:
- Font: `EB Garamond`, 400, italic
- Size: `1.1rem`
- Color: `#8a8680` muted
- Below the headline, ~16px below

### The 3D Golden Tie (Center Stage)

**Visual description**:
The tie is a **3D mesh** of a standard business necktie:
- **Shape**: Classic triangular necktie silhouette — wide blade at bottom (~18cm virtual width), tapering upward to the knot, then a narrow tail
- **The tie hangs vertically** from its knot at the top center of the scene
- The bottom blade sways gently with **soft-body physics** (cloth simulation)
- The knot area is at approximately `45vh` from top

**Material**:
- `MeshPhysicalMaterial` in Three.js
- `color: #c9a84c` (deep gold)
- `metalness: 0.85`
- `roughness: 0.15`
- `reflectivity: 1.0`
- Very shiny — catches the spotlight and creates clear specular highlights that move as the tie sways
- No texture map — smooth gold metal

**Physics simulation**:
- The tie is a soft-body mesh (~30 vertical segments)
- The top knot vertex is **pinned** (fixed position)
- The rest of the tie is influenced by gravity and a gentle sinusoidal "breeze"
- Sway amplitude: ±8° side-to-side
- Sway period: ~3s
- The bottom blade deforms more than the upper shaft — authentic cloth drape

**Tie implementation options**:
- Option A (preferred): Custom R3F component with Rapier physics (soft body via position-based dynamics)
- Option B: GSAP-driven procedural mesh deformation (no physics library, but more controllable)
- Option C: Pre-animated GLB with baked cloth simulation from Blender

### The Applauding Business People

**What they are**:
- A row of **5–7 vintage-stock-photo cutout people** positioned around the tie, spread across the lower 40% of the viewport
- They are 2D PNG cutouts composited into the 3D scene (or DOM positioned over a canvas)
- Each figure is a business professional from 1985–1995 stock photography: suits, blouses, blazers

**Visible figures** (from video frames):
- Far left: Woman in blazer, clapping
- Left-center: Man and woman together, applauding/raising hands
- Center-left: Group of 3–4 people applauding
- Right: Man in dark suit, fist-pumping / arm raised
- Far right: Partial figure, hand raised in celebration

**Style**:
- The figures are all slightly desaturated (~60% saturation) with a warm slight color grade
- The **spotlight** illuminates them from above — strong top-down lighting with their faces somewhat in shadow
- They are `position: absolute` around the canvas/scene
- On-enter, each figure animates in from their respective edge of the screen

**Figure animation**:
- They perform a looping "clapping" animation: each figure has 2 alternating PNG frames (arms in, arms slightly out) swapping at ~4fps — a simple GIF-style animation using CSS `animation-direction: alternate`
- The figures sway very slightly side-to-side (±2px, 1.5s period, staggered)

---

## ANIMATION SEQUENCE

### Enter
1. **Black screen** first — total darkness for 200ms
2. **Spotlight appears**: the light cone fades in from `opacity:0` to full over 600ms, with a slight flicker (the spotlight "turns on")
3. **Tie drops in**: the tie falls from above (`translateY(-100vh)`) and settles at its hanging position with a realistic bounce/overshoot (spring physics)
4. **Headlines fade in**: staggered with the tie settle
5. **People walk in**: each figure slides in from their respective edge of the viewport, staggered 100ms apart
6. **Clapping animation begins**: once all figures are in position

### While in View
- Tie sways continuously (soft body or GSAP sine wave)
- Spotlight has very subtle intensity pulse (~5% range, 3s period)
- People's clapping animation loops
- The gold headline shimmer sweeps every 4s

### Exit
- Section scrolls away normally; the tie begins accelerating upward as the user scrolls past (parallax, the tie "floats up into darkness")

---

## LAYOUT

```
VIEWPORT (dark stage)

  "Check Out This Golden Tie"              ← top center
  "You made it this far. You deserve a tie-break."

                   [SPOTLIGHT CONE]
                         ↓
                    ████████████  ← knot
                    ███████████
                    ██████████
                    █████████
                    ████████
                    ███████
                    ██████
                    █████    ← tie blade (sways)


[WOMAN] [GROUP]       [TIE]       [MAN] [FIGURE]
 clap    clap         center       fist  hands
```

---

## ASSETS REQUIRED

- [ ] `golden-tie.glb` — 3D necktie model
  - Mesh topology: clean vertical quad strips (~400 faces)
  - UV unwrapped cleanly
  - Knot geometry included
  - DRACO compressed, < 1MB
- [ ] Applauding people cutout PNGs (5–7 images):
  - `clap-woman-blazer.png` (2 frames for animation)
  - `clap-group-center.png` (2 frames)
  - `clap-man-suit.png` (2 frames)
  - etc.
  - All: transparent background, ~600px tall at 2x
  - Style: vintage corporate stock, desaturated 60%, warm grade

---

## COPY (exact strings)

**Headline**:
```
Check Out This Golden Tie
```

**Sub-text**:
```
You made it this far. You deserve a tie-break.
```

---

## MOBILE BEHAVIOR

- 3D tie: simplified mesh, no soft body physics — static sway via GSAP sine wave on rotation
- Spotlight: CSS radial gradient (no Three.js)
- Applauding figures: reduced to 3 (left, center-ish, right)
- Figures smaller (150–200px tall)
- Headline: `clamp(32px, 8vw, 64px)`
- Full interaction preserved — this section must shine on mobile too (pun intended)
