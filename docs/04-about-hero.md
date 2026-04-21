# 04 — ABOUT HERO
## Cubicle Office Flyover

---

## OVERVIEW

The "About Us" section opens with a **full-viewport dramatic photograph** of an endless office cubicle maze — hundreds of identical workstations stretching into the distance. The word **"About Us"** is set in massive Playfair Display type directly over the image. The photo has a strong **desaturated, high-contrast, institutional** quality — like a dystopian corporate headquarters from a 1990s B-movie.

The section functions as a visual prologue to the About copy below. It establishes the tone: Shader is commenting on the corporate world from within and above it.

---

## VISUAL BREAKDOWN

### Background Image
- **Full-bleed background photograph**: An aerial/elevated perspective shot of a **vast open-plan office** filled with identical cubicles, desks, office chairs, and CRT monitors
- The photo is desaturated to near-monochrome (grayscale with very slight warm/tan tint)
- **High contrast**: deep shadows in the cubicle dividers, bright highlights on the desk surfaces
- The photo fills the entire viewport: `object-fit: cover`
- There is a **mild vignette overlay** (darkening around the edges)
- The top of the image transitions from the dark hero section with a soft gradient: `linear-gradient(to bottom, #0d0d0d 0%, transparent 15%)`

### Text Overlay
Position: horizontally centered, vertically centered, directly on top of the photo

**"About Us"**:
- Font: `Playfair Display`, weight 400 or 700
- Size: approximately `15vw` — extremely large, dominating the composition
- Color: `#ffffff` at roughly `0.85` opacity — not pure white, slightly transparent so the photo bleeds through the letters
- The text has a very **subtle text-shadow** below for legibility: `0 4px 40px rgba(0,0,0,0.4)`
- The text does NOT have a container — it sits directly over the image at full impact

### CRT Glitch Artifacts
The entire section has a **subtle RGB channel shift** / chromatic aberration effect applied to the image:
- A CSS or GLSL pass that shifts the red channel ~2px right and the blue channel ~2px left
- This gives the whole image a slight "demagnetized CRT" feel
- The "About Us" text also inherits this glitch through the visual composition

### Section Anchor
- URL becomes `shader.se/#about-us` when this section enters viewport
- The navbar text should be readable against the image — if necessary, a very thin semi-transparent background strip on the navbar (`rgba(0,0,0,0.3)`)

---

## ANIMATION

### Entering
- The section fades in as the work carousel unpins and scrolls away
- The photo starts at **scale: 1.05** and slowly settles to **scale: 1.0** over 1.5s (subtle zoom stabilize)
- "About Us" text fades in from `opacity: 0` to `opacity: 0.85` over 600ms, with a very slight upward drift (`translateY(10px) → 0`)

### Scroll Parallax
- As the user scrolls through this section, the background photo moves at **0.5x scroll speed** (classic parallax)
- This creates depth — the photo slides up slower than the page content, suggesting height/scale

### Exit
- The photo fades and zooms slightly as the about-copy section (cream background) slides up from below
- This is a standard scroll-reveal with the cream section obscuring the photo from the bottom

---

## ASSETS REQUIRED

- [ ] `about-office-cubicles.webp` — the office photo
  - **Spec**: Aerial/elevated 45° perspective, dense grid of office cubicles/workstations with CRT computers
  - Resolution: 2560×1600px minimum (for retina full-bleed)
  - Treatment: Desaturated (~85%), high contrast, slight warm tint
  - Art direction: The composition should suggest **infinity** — the cubicles extend to the horizon
  - If sourcing stock: search "office cubicles aerial 3D render" or "isometric office workstation overflow"
  - **Note from video**: The image appears to be a **3D render** (not a real photo) — possibly rendered in Blender or Cinema 4D. The cubicles are uniform, the lighting is CG. This should be matched.

---

## COPY

```
About Us
```
That is the only text in this section.

---

## MOBILE BEHAVIOR

- Background image: same, `object-position: center center`
- "About Us" text: `clamp(60px, 18vw, 120px)`
- Parallax effect: disabled on mobile (performance)
- CRT glitch: disabled on mobile (performance), replaced with static desaturated filter
