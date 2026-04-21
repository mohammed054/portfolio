# 06 — ABOUT VINTAGE
## Retro Computer Product Spread

---

## OVERVIEW

After the editorial copy, the page transitions into a **full-bleed photographic section** showcasing a spread of vintage/retro computer hardware — an Apple II–era product photography layout reminiscent of a 1980s technology catalog. The image fills the viewport, slowly scrolling in parallax. There is no text overlay in this section (the content communicates through the image alone). It acts as a **visual breath** between the heavy copy above and the dramatic shredder section below.

---

## VISUAL BREAKDOWN

### Background
- **Transitional**: the cream section background (`#f0e8d8`) of the about-copy section continues as the page scrolls into this section, then gradually darkens to a **warm medium gray/brown** (`#5a4e3a`) that matches the photography's background tone

### The Image

A **full-bleed product photography spread** of vintage Commodore/Apple-era computer hardware, styled exactly like a corporate technology catalog from 1982:

**Equipment visible in the image**:
- **Two full keyboard/computer units** (Apple II or equivalent form factor) — left and right foreground
- **A dot-matrix or line printer** (center, slightly behind) — a boxy beige/tan unit
- **A CRT monitor** (center-right, elevated on a stand or the keyboard unit) — showing a colored bar chart ("NET SALES BY DIVISION") in the on-screen display
- **A separate storage/floppy drive unit** (right edge)

**Photography style**:
- Shot against a **flat, featureless warm gray background** — pure studio product shot
- Slightly warm color tone (not pure white bg — more of a `#c8b89a` warm stone)
- **High key lighting** — bright, even, softbox lighting from above-left
- The computer screens glow softly — the bar chart on the monitor is the only color element
- The entire image has the look of a **stock photo from a 1982 tech catalog** — accurate recreation or very convincing vintage stock
- No humans, no context — pure product

**The monitor on-screen content**:
- Shows a **colored bar chart** labeled "NET SALES BY DIVISION" with `<1000>` axis label
- Y-axis: 10 to 80 (in increments of 10)
- X-axis: 1 through 7 (divisions)
- The bars are in multiple colors (the pixel-art color palette of the era: pink/magenta, yellow, green, red, blue, light green)
- This is the same chart style that would appear on an Apple II or Commodore PET running Visicalc/VisiPlot

**Image file**: `about-retro-computers.webp`
**Resolution**: 2560×1600px minimum (full-bleed)
**Art direction**: If sourcing/creating, it must look authentically period — not "retro-inspired" but actually indistinguishable from a real 1982 catalog photo.

### Layout
- The image is **full viewport width and height**: `width: 100vw; height: 100vh; object-fit: cover;`
- `object-position: center 30%` — to show the computer array rather than the background
- The image does **NOT** have text overlaid (the section is purely visual)
- A very light vignette around edges

### Transition In (from about-copy)
- The warm cream of the about-copy section gives way to this image as the user scrolls
- There is a **thin colored stripe** at the top of this section — approximately 6–8 horizontal lines, each a different brand-rainbow color (red, orange, yellow, teal, blue, purple), spanning full width, each ~4px tall
- This stripe serves as a visual separator/punctuation mark between sections
- It resembles the "color bars" test pattern on old TV broadcasts

### Transition Out
- At the bottom of this image section, the same rainbow stripe appears again (mirrored)
- Below it, the shredder section begins

---

## ANIMATION

### Scroll Parallax
- The image moves at **0.4x scroll velocity** (slower than the page) — deep parallax
- This creates the sensation of looking through a window at something very large and distant

### Entering Section
- On scroll-enter: the image cross-fades from the cream background
- The rainbow stripe at the top animates in from left to right (each stripe line extends from 0 to 100% width, 50ms staggered)

---

## ASSETS REQUIRED

- [ ] `about-retro-computers.webp` — the vintage computer spread photo
  - **Must include**: 2x keyboard units (Apple II form factor), 1x dot-matrix printer, 1x CRT monitor with bar chart
  - **Style**: 1982 catalog product photography, warm gray background, softbox lighting
  - **The on-screen chart is an important visual detail** — must be legible and period-accurate
  - Resolution: 2560×1600px+
  - Treatment: very slight warm color cast, no modern post-processing

---

## NO COPY IN THIS SECTION

This section contains **no text**. The image speaks for itself.

---

## MOBILE BEHAVIOR

- Image still full-bleed but `object-position` adjusts to show the computers centered
- Parallax: disabled (performance)
- Rainbow stripe: visible but thinner (2–3px per stripe)
- Min-height: 60vh (the section can be shorter on mobile since it's purely decorative/atmospheric)
