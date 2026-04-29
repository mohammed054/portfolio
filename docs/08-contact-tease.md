# 08 — CONTACT TEASE
## "Still Not Convinced We're Serious About Business?"

---

## OVERVIEW

After the shredder destroys the about section, the site returns to its **dark world**. This section is a full-viewport dark stage with a single large rhetorical question centered on screen, followed by a teaser line. Animated golden stars/sparkles fall or float across the text. It functions as a dramatic comedic beat — a "one more thing" moment before the big finale.

The URL becomes `shader.se/#contact` here.

---

## VISUAL BREAKDOWN

### Background
- **Deep navy-black**: `#0a0a14` — slightly more blue-toned than the hero's pure black
- No image, no texture — pure dark void
- A very subtle **radial vignette**: darkest at corners, slightly less dark at center
- The overall feeling is: you are in a theater. The lights have dimmed. Something is about to happen.

### Headline
**"Still Not Convinced We're Serious About Business?"**:
- Font: `Playfair Display`, weight 700–900
- Size: approximately `7.5vw` — large, commanding
- Color: `#f0ece4` (warm white)
- Layout: centered, 3–4 lines:
  ```
  Still Not
  Convinced We're
  Serious About
  Business?
  ```
- No chromatic aberration in this section — the text is clean and crisp
- The text has a very subtle glow/halo: `text-shadow: 0 0 60px rgba(240, 236, 228, 0.15)`

### Sub-text
**"We've got one last trick up our sleeve."**:
- Font: `EB Garamond`, 400
- Size: `1.1rem`
- Color: `#8a8680` (muted)
- Centered, below the headline, ~32px margin

### Floating Stars / Sparkles

**The animated stars**:
- Multiple (5–8) golden star shapes float across or fall through the text area
- They are **5-pointed golden stars** (`#c9a84c` to `#ffd700` gradient fill)
- Size range: 40px to 80px
- They move at different speeds and angles — some float upward slowly, some drift sideways
- They rotate slowly as they move (3–15° per second, random per star)
- They appear and disappear on a loop — each star has a fade-in → travel → fade-out cycle (~3–5s per star)
- The stars are **3D rendered quality** — they have a subtle gold metallic sheen (could be actual 3D via R3F, or a high-quality SVG with gradient + drop shadow)
- The stars pass **behind** the text (z-index lower than text container)

**Technical implementation**:
```tsx
// Each star:
// - Random start position (distributed across viewport)
// - Random velocity vector (slow drift, ±0.3vw per frame)
// - Random rotation speed
// - Random scale (0.5 → 1.5)
// - Opacity: 0 → 1 → 0 over lifetime
// - Lifetime: 3000 → 6000ms (random)
// - New star spawns when one completes lifecycle
// - GSAP or requestAnimationFrame loop
```

---

## ANIMATION

### Enter (from shredder)
- The dark background rises underneath the shredded cream paper while the cream remnant is still visible near the top edge
- The headline can begin appearing before the shredder transition has fully cleared, matching the captured overlap
- The headline words **stagger in from below**:
  - Each word: `translateY(40px) opacity:0 → rest`
  - 60ms stagger between words
  - 600ms duration each, `ease: power3.out`
- Stars begin appearing 400ms after the headline finishes

### While in View
- Stars continuously float/drift — this is a looping idle animation
- Headline is static once settled

### Exit
- Stars continue until the next section takes over
- Section scrolls away normally (no special exit)

---

## LAYOUT

```
VIEWPORT CENTER

         ┌─────────────────────────────────────────┐
         │                                         │
         │                                ★        │
         │         Still Not                       │
         │                                         │
         │         Convinced We're      ★          │
         │                                         │
         │      ★  Serious About                   │
         │                                         │
         │         Business?                  ★    │
         │                                         │
         │   We've got one last trick up our sleeve│
         │                                         │
         └─────────────────────────────────────────┘
```

**Container**: centered, max-width `900px`, full viewport height, flex column, justify-content center

---

## ASSETS REQUIRED

- [ ] Star SVG or 3D model
  - If SVG: 5-pointed star, gold gradient fill (`#c9a84c → #ffd700 → #8b6914`), subtle drop shadow
  - If 3D (R3F): golden icosahedron or star mesh with MeshStandardMaterial, gold metallic + roughness 0.2

---

## COPY (exact strings)

**Headline**:
```
Still Not Convinced We're Serious About Business?
```

**Sub-text**:
```
We've got one last trick up our sleeve.
```

---

## MOBILE BEHAVIOR

- Font size: `clamp(36px, 9vw, 72px)`
- Stars: reduced to 3 stars (performance)
- Stars size: 30–50px
- Sub-text: same size
- Padding: `6vw`
