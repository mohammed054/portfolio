# 05 — ABOUT COPY
## "Making Digital Storytelling More Playful, Powerful, and Alive"

---

## OVERVIEW

This section is the primary editorial content section. It transitions from the dark, moody world into a **warm cream / parchment background** — a radical shift in visual key that feels like opening a printed brochure. The section delivers the About copy across a three-column layout with a large display headline, editorial body text, and a retro cutout photograph of a businessman.

It is the most text-heavy section of the site. The design must make reading feel pleasurable — long-form editorial, not a web listicle.

---

## VISUAL BREAKDOWN

### Background
- **Solid warm cream**: `#f0e8d8`
- This is a full departure from dark mode — the section is entirely light
- There is a very subtle **paper texture** overlay: a low-contrast grain/noise pattern that gives the bg a tactile, printed-page quality
- Optional: a faint diagonal or grid line pattern (like graph paper or old notebook paper) at `opacity: 0.03` — barely visible, adds depth
- The transition FROM the cubicle photo above: the cream slides up from below (standard scroll reveal)

### Headline
**"Making Digital Storytelling More Playful, Powerful, and Alive"**:
- Font: `Playfair Display`, weight 900
- Size: `~5.5vw` (never below 32px)
- Color: `#1a1208` (very dark brown, near-black)
- Layout: **centered**, spanning the full column width
- Line arrangement (natural wrapping at ~3 lines):
  ```
  Making Digital
  Storytelling More Playful,
  Powerful, and Alive
  ```
- **No decorative underline, no background** — pure type
- Margin below headline: ~64px before the three columns begin

### Three-Column Body Copy

The body copy is split into **3 equal-width columns** in a `grid: 1fr 1fr 1fr` layout.

**Column 1** ("Shader is a creative development studio..."):
```
Shader is a creative development studio specialized in building 
interactive 3D and AI solutions for the web. Serious about 
business, based in Sweden, and working with brands, agencies 
and designers worldwide. Plugged into the future. While we're 
a small team of creative engineers, we have a hand-picked 
network of collaborators: designers, 3D artists, copywriters, 
animators, and creative technologists, ready to plug in with 
an array of capabilities.
```

**Column 2** ("This modular approach means we can scale..."):
```
This modular approach means we can scale and adapt to each 
challenge. Whether it's a WebGL experiment, an interactive 
product visualization, a mobile app, or an AI-driven 
experience, we help bold brands stand out across every 
screen. We build storytelling platforms that demand attention 
and reward curiosity. We push digital mediums to places you 
haven't seen before, and have fun doing it. Beyond code, 
we offer 3D design and animation, UI and motion design, 
concepts and digital strategy, full-stack development, 
and creative consulting.
```

**Column 3** ("Whether it's prototyping an idea...") + vintage businessman photo:
```
Whether it's prototyping an idea, launching an augmented 
reality experience, or bringing high-fidelity visuals to 
life, Shader bridges the gap between creative ambition 
and technical execution. Our process is hands-on, 
collaborative, and tailored for teams that value both 
craft and innovation. We combine technical expertise with 
a designer's eye, ensuring that every interaction feels 
natural and every pixel is perfectly placed. We're not 
your regular IT department. We don't troubleshoot printers.
```

**Typography for body columns**:
- Font: `EB Garamond`, weight 400
- Size: `1.05rem`
- Line height: `1.7`
- Color: `#2c2416` (dark warm brown)
- Column gap: `~48px`
- The text is **NOT justified** — left-aligned within each column
- No dropcap, no bullets, no special formatting — pure running prose

### Vintage Businessman Cutout

**Position**: overlapping Column 3, right side of the section, anchored to the right margin

- A **cutout photograph** (PNG with transparent background) of a middle-aged man in a formal shirt and tie, holding papers, with a calm/neutral pose (arms at sides or crossed)
- The image is **cropped to the torso and upward** — no legs visible
- The figure is positioned so it overlaps the text column slightly, sitting at the right edge
- **Scale**: approximately `400–450px` tall (fills the visual height of the 3 text columns)
- **Style**: The photo has a slightly **warm-processed, slightly muted** color treatment — like a stock photo from 1995 scanned from a corporate brochure
- The figure appears to be standing in the column, as if posing for a business directory

**Art direction note**: This image creates a visual joke — the corporate stock photo archetype alongside earnest copy about craft and creativity. The contrast is intentional. The man should look extremely generic and business-formal.

---

## LAYOUT SPEC

```
[FULL WIDTH CONTAINER — padded 8vw left/right]

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│         Making Digital Storytelling More Playful,                  │
│              Powerful, and Alive                                    │
│                                                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  [MAN]  │
│  │                │  │                │  │              │   ██    │
│  │  Column 1      │  │  Column 2      │  │  Column 3    │   ██    │
│  │  body text...  │  │  body text...  │  │  body text   │   ██    │
│  │                │  │                │  │  ...         │   ██    │
│  └────────────────┘  └────────────────┘  └──────────────┘  [MAN]  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Container**: max-width `1400px`, centered, horizontal padding `8vw` (capped at 120px)
**Headline area**: full width above columns
**Column grid**: `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px;`
**Businessman image**: `position: absolute; right: 0; bottom: 0;`

---

## ANIMATION

### Enter
- The section slides up into view from below as the user scrolls past the cubicle photo
- The **headline fades up** first: `translateY(30px) opacity:0 → rest` over 600ms
- The **three columns stagger in** from left to right: 150ms delay between each column
  - Each column: `translateY(20px) opacity:0 → rest` over 500ms
- The **businessman photo** slides in from the right: `translateX(80px) opacity:0 → rest` over 700ms, with a 400ms delay

### Scroll Within Section
- The section has a gentle parallax: the businessman image moves at ~0.8x scroll speed (slightly slower than the text, creating subtle depth)

---

## ASSETS REQUIRED

- [ ] `businessman-vintage.webp` — the cutout figure
  - **Spec**: Male figure, 40s–50s, formal shirt and tie, neutral expression, white or light background (for cutout), slightly warm-processed color
  - PNG with transparent background
  - Height: ~800px at 2x
  - Treatment: slight warm color grade, contrast +10%
- [ ] Paper/grain texture for section background (optional but recommended)

---

## COPY (complete, verbatim from live site)

**Headline**:
```
Making Digital Storytelling More Playful, Powerful, and Alive
```

**Column 1**:
```
Shader is a creative development studio specialized in building interactive 3D and AI 
solutions for the web. Serious about business, based in Sweden, and working with 
brands, agencies and designers worldwide. Plugged into the future. While we're a 
small team of creative engineers, we have a hand-picked network of collaborators: 
designers, 3D artists, copywriters, animators, and creative technologists, ready 
to plug in with an array of capabilities.
```

**Column 2**:
```
This modular approach means we can scale and adapt to each challenge. Whether it's 
a WebGL experiment, an interactive product visualization, a mobile app, or an 
AI-driven experience, we help bold brands stand out across every screen. We build 
storytelling platforms that demand attention and reward curiosity. We push digital 
mediums to places you haven't seen before, and have fun doing it. Beyond code, 
we offer 3D design and animation, UI and motion design, concepts and digital 
strategy, full-stack development, and creative consulting.
```

**Column 3**:
```
Whether it's prototyping an idea, launching an augmented reality experience, or 
bringing high-fidelity visuals to life, Shader bridges the gap between creative 
ambition and technical execution. Our process is hands-on, collaborative, and 
tailored for teams that value both craft and innovation. We combine technical 
expertise with a designer's eye, ensuring that every interaction feels natural 
and every pixel is perfectly placed. We're not your regular IT department. 
We don't troubleshoot printers.
```

---

## MOBILE BEHAVIOR

- Single-column layout (no grid)
- Columns stack vertically: headline → col 1 → col 2 → col 3
- Businessman photo: reduced to 200px width, floated right within column 3, text wraps around
- Padding: `6vw` left/right
- Font size: `1rem` body, headline `clamp(28px, 8vw, 52px)`
