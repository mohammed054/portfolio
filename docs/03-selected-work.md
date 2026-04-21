# 03 — SELECTED WORK
## Film Strip Carousel

---

## OVERVIEW

The "Selected Work" section is a **horizontally-scrolling film strip carousel** that fills the entire viewport and pins while the user scrolls. It is styled as a **physical 35mm film reel** — the strip curves gently in 3D space (perspective transform), and project thumbnails appear as frames on the film. The background shifts from the hero's black to a deep **navy-purple gradient**.

This is the most technically complex DOM section (outside the 3D hero). The carousel must feel tactile, physical, and cinematic — not a standard web slider.

---

## VISUAL BREAKDOWN

### Background
- Gradient: `linear-gradient(160deg, #2a1f5e 0%, #0e1b6e 50%, #0d0d0d 100%)`
- This is significantly different from the hero — a vivid deep blue-purple that signals a section change
- The gradient is **fixed** (doesn't scroll with the content) — `background-attachment: fixed` or equivalent GSAP pin

### Section Header (above film strip)
```
Selected Work
Browse our project carousel to explore our selected work.
```
- "Selected Work": `Playfair Display`, 700, ~3.5rem, `#f0ece4`, centered, but fades out once carousel is in focus
- The header is NOT persistent once scrolling begins within the pinned section

### Film Strip Structure

The film strip is a **single long horizontal strip** that scrolls left as the user continues scrolling vertically (scroll-to-horizontal conversion via GSAP ScrollTrigger).

```
         ← film strip scrolls this direction as user scrolls down →

┌──────────────────────────────────────────────────────────────────────────────────┐
│ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ← sprocket holes (top edge) ██ ██ ██ ██ ██ │
│                                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │              │   │              │   │              │   │              │      │
│  │  [PROJECT 1] │   │  [PROJECT 2] │   │  [PROJECT 3] │   │  [PROJECT 4] │      │
│  │   image      │   │   image      │   │   image      │   │   image      │      │
│  │              │   │              │   │              │   │              │      │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘      │
│                                                                                   │
│ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ← sprocket holes (bottom edge) ██ ██ ██ ██ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Film strip physical details**:
- The entire strip background: `#111111` (dark charcoal — the film base color)
- **Sprocket holes**: Rectangular cutouts (`~24px × 32px`) spaced evenly along the top and bottom edges of the strip. They are actual holes (CSS background shows through to the purple gradient behind).
- The strip has a very subtle **film grain texture** overlay
- The strip has a slight **3D perspective tilt** — it appears to curve away from the viewer at both left and right edges (CSS `perspective` + `rotateY` on the strip container — approximately `rotateY(8deg)` on the right edge, `-8deg` on the left, creating a concave film reel effect)

### Project Cards (Film Frames)

Each project is shown as **2–3 consecutive frames** in the strip (one main full image + adjacent smaller detail images visible on the sides).

**Active (center) frame**:
- Width: ~55% of viewport width
- Height: ~70% of viewport height
- The image/render fills the frame completely
- No border — the frame is defined by the film strip structure

**Adjacent frames** (left and right of center):
- Slightly smaller (scale ~0.85)
- Partially obscured by the film strip perspective warp
- Appear as context/preview of previous and next projects

**Project metadata (below active frame)**:
```
[PROJECT NAME]        ← Playfair Display, ~3rem, centered, #f0ece4
[Category] • View project →    ← EB Garamond, ~1rem, #8a8680 muted
```
This text sits **above** the film strip (between the strip and the top of the viewport), centered.

### Navigation Controls

**Left/Right arrows**:
- Large `←` and `→` arrow buttons at the left and right edges of the viewport
- Style: white text arrows in simple brackets or standalone — `← ` and ` →`
- Font: EB Garamond, ~2rem
- They remain visible at all times during the pinned scroll

**Dot pagination**:
- A row of dots at the bottom center of the viewport
- One dot per project
- Active dot: filled/white circle (~8px)
- Inactive: outline circle (~6px)
- Approximately 11 dots visible (matching the number of projects)

---

## PROJECTS IN CAROUSEL

Based on visible frames and context from live site, the carousel contains approximately **11 projects**. Confirmed visible:

1. **Design is Funny** — circular 3D logo design with rings; design/brand project
2. **eHealth Arena** — 3D virtual showroom, interior renders of medical product spaces
3. **[Additional projects]** — further projects visible but not fully legible in recording

Each project card requires:
- `project.name`: string
- `project.category`: string (e.g., "3D Showroom", "Brand Identity", "Web Experience")
- `project.url`: string (external link)
- `project.images`: array of 2–3 `.webp` files (main + details)

---

## ANIMATION / INTERACTION

### Entering the Section
- GSAP ScrollTrigger **pins** the section when it enters viewport
- The film strip **zooms from small to full-size** as the section pins (scale 0.6 → 1.0 over first 20% of pinned scroll)
- The background gradient **fades in** simultaneously

### Scrolling Through Projects
- Each additional "scroll unit" (scroll down) moves the film strip **left by one frame**
- The transition between frames uses GSAP `scrub: 1.5` for a smooth, slightly sticky feel
- The **center frame** always has the project metadata displayed; adjacent frames are blurred or dimmed (`opacity: 0.5` on non-active frames)

### Manual Arrow Navigation
- Clicking `←` / `→` advances by one project immediately with a `0.4s ease` animation
- The dot indicator updates simultaneously

### Hover on Active Frame
- A very subtle **scale: 1.02** on hover of the center frame
- A `cursor: pointer` indicating the project is clickable
- `View project →` text brightens on hover

### Exiting the Section
- Once all projects have been scrolled through, the pin releases
- The film strip **scales down and fades out** as the next section (About) enters

---

## CAROUSEL DATA STRUCTURE

```typescript
interface Project {
  id: number;
  name: string;
  category: string;
  viewUrl: string;
  images: {
    main: string;       // primary thumbnail
    detail1?: string;   // secondary frame
    detail2?: string;   // tertiary frame
  };
}
```

---

## ASSETS REQUIRED

- [ ] All project images at 2x resolution (main: ~1200×900px, details: ~600×450px)
- [ ] Film grain texture: `grain.png` (256×256 tileable)
- [ ] Sprocket hole SVG or CSS definition

---

## COPY

**Section intro**:
```
Selected Work
Browse our project carousel to explore our selected work.
```

**Navigation labels**:
```
Previous project  ←
Next project      →
```

---

## MOBILE BEHAVIOR

- The 3D perspective film strip is simplified to a **flat horizontal swipe carousel** on mobile
- Swipe left/right via touch events
- Project frames take 85vw width
- Dot pagination remains
- Film strip edges and sprocket holes are simplified (reduced size)
- The metadata (project name/category) moves below the image frame
