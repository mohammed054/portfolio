# 00 — BLUEPRINT
## Shader Development Studio — Full Site Rebuild
**Budget: $50,000–$60,000 USD**
**Live reference: shader.se**
**Version: 1.02**

---

## 1. PROJECT OVERVIEW

Shader is a Swedish creative development studio specializing in interactive 3D and AI web experiences. Their website is a deliberate, theatrical piece of self-branding that functions as a live demonstration of what they sell: technically ambitious, visually absurdist, humor-laced digital storytelling.

The site is a **single-page application** that scrolls through multiple distinct "acts," each with a completely different visual world — dark sci-fi, retro-corporate, cinematic black-and-white, vivid cream editorial. Each section is a set piece. The site does not just describe what Shader does — it **performs** it.

The rebuild must preserve this theatrical ambition at 100% fidelity and extend it where the tech stack allows.

---

## 2. SITE STRUCTURE (PAGE FLOW)

The site is a single continuous scroll. The URL hash updates as the user passes section thresholds.

```
[PRELOADER]          → Full-screen CRT boot sequence (blocks page)
  ↓
[HERO]               shader.se/#home
  ↓
[SELECTED WORK]      shader.se/#work       (film-strip carousel)
  ↓
[ABOUT — INTRO]      shader.se/#about-us   (cubicle office flyover)
  ↓
[ABOUT — COPY]                             (cream bg, 3-col text)
  ↓
[ABOUT — VINTAGE]                          (retro computer photograph)
  ↓
[SHREDDER]                                 (scroll-triggered paper shred transition)
  ↓
[CONTACT — TEASE]    shader.se/#contact    ("Still Not Convinced...")
  ↓
[GOLDEN TIE]                               ("Check Out This Golden Tie")
  ↓
[HANDSHAKE]                                (cinematic close-up)
  ↓
[GOOD BUY]                                 (3D phone monument + "Good buy.")
  ↓
[FOOTER / CONTACT]                         (dark, 3-column info grid)
```

**Total sections: 12**
**Markdown docs: 01 through 12 + this blueprint**

---

## 3. TECH STACK

### Frontend Framework
- **React 18** (with Vite)
- **TypeScript** throughout
- **React Router v6** (hash-based for section anchors)

### 3D / WebGL
- **Three.js r165+** — all 3D scenes
- **@react-three/fiber** — React wrapper for Three.js
- **@react-three/drei** — helpers (Environment, ScrollControls, Scroll, Html, useProgress, etc.)
- **@react-three/postprocessing** — bloom, chromatic aberration, noise, vignette
- **GSAP 3 + ScrollTrigger** — all scroll-driven animation outside R3F
- **Lenis** — smooth scroll (replaces native scroll, feeds ScrollTrigger)

### Animation
- **GSAP 3** — primary animation engine for DOM elements
- **Framer Motion** — secondary, for React component mount/unmount transitions
- **CSS custom properties + keyframes** — for simple loops (scanlines, flicker, grain)

### Visual FX
- **Custom GLSL shaders** (inline in R3F materials) for:
  - CRT screen curvature distortion
  - Film grain overlay
  - Scanline pass
  - Chromatic aberration on hero text
  - Paper shred warp distortion
- **canvas-confetti** — for star/sparkle burst on "Golden Tie" section

### Fonts (Google Fonts + Adobe Fonts)
- **Display / Headlines**: `Playfair Display` — serif, high contrast, used across ALL headline copy
- **Logo wordmark**: Custom — condensed, horizontally-striped logo SVG (matches visible "SHADER" logotype)
- **Monospace / Preloader**: `Courier Prime` or `Courier New` — used exclusively in preloader boot text
- **Body / UI**: `EB Garamond` — body copy, nav links, footer
- **CTA / Button**: `EB Garamond` italic or small caps

> **Note**: No sans-serif fonts anywhere. The entire site is serif + monospace. This is intentional and non-negotiable.

### Styling
- **CSS Modules** + global CSS custom properties
- **No Tailwind** — all layout by hand, pixel-precise
- PostCSS for nesting and custom media

### Assets
- `.glb` / `.gltf` — all 3D models (SuperPET computer, phones, tie, office, film strip)
- `.webp` / `.avif` — all photographic assets (vintage office people, retro computers, handshake)
- `.mp4` (looping, muted, no audio) — any video texture used inside 3D screen meshes
- SVG — logo, icons, decorative elements

### Infrastructure
- **Next.js 14 App Router** OR **Vite + React** SPA — decision per team preference
  - If Next.js: static export (`output: 'export'`) to CDN
  - If Vite: direct CDN deploy
- **Cloudflare Pages** — hosting
- **Cloudflare R2** — 3D asset delivery (GLBs, textures)
- **Cal.com** — "Book a call" integration (existing: `cal.com/simon-hedlund-kglzne`)

### Performance
- **Three.js DRACOLoader** — compress all GLBs
- **Progressive loading**: preloader masks all asset loads; content reveals only after load completes
- **Suspense + useProgress** — loading state managed inside preloader screen
- Target: **LCP < 2.5s** (preloader is the LCP; actual content loads behind it)

---

## 4. COLOR PALETTE

The site alternates between two worlds as you scroll:

### Dark World (Hero, Work, About-Intro, Contact sections)
```
--color-bg-dark:        #0d0d0d    /* near-black, main background */
--color-bg-dark-2:      #111111    /* card backgrounds */
--color-bg-contact:     #0a0a14    /* deep navy-black for contact tease */
--color-text-light:     #f0ece4    /* warm white, headlines */
--color-text-muted:     #8a8680    /* subdued body text on dark */
--color-accent-gold:    #c9a84c    /* golden tie, hover states, "Book a call" */
--color-purple-mid:     #2a1f5e    /* deep purple gradient in work section */
--color-blue-deep:      #0e1b6e    /* footer / contact section background */
```

### Light World (About copy, Shredder section)
```
--color-bg-cream:       #f0e8d8    /* warm parchment / old paper */
--color-bg-cream-2:     #e8dfc8    /* slightly darker cream for contrast */
--color-text-dark:      #2c2416    /* deep warm brown for body text on cream */
--color-text-headline:  #1a1208    /* darkest brown for large headlines on cream */
```

### Brand Accents
```
--color-rainbow-1:      #e63946    /* logo stripe red */
--color-rainbow-2:      #f4a261    /* logo stripe orange */
--color-rainbow-3:      #e9c46a    /* logo stripe yellow */
--color-rainbow-4:      #2a9d8f    /* logo stripe teal */
--color-rainbow-5:      #457b9d    /* logo stripe blue */
--color-rainbow-6:      #6a0572    /* logo stripe purple */
```

### CRT / Preloader
```
--color-crt-bg:         #1a1aff    /* classic Commodore blue, slightly bright */
--color-crt-text:       #e8e4d8    /* off-white CRT phosphor */
--color-crt-bar:        #e8e4d8    /* progress bar fill */
--color-crt-border:     #e8e4d8    /* progress bar outline */
```

---

## 5. TYPOGRAPHY SYSTEM

```css
/* HEADLINES — all serif, Playfair Display */
.h1            { font: 900 8vw/1.0 'Playfair Display', serif; letter-spacing: -0.02em; }
.h2            { font: 700 5.5vw/1.1 'Playfair Display', serif; }
.h3            { font: 700 4vw/1.15 'Playfair Display', serif; }
.hero-title    { font: 900 9.5vw/0.95 'Playfair Display', serif; }

/* BODY — EB Garamond */
.body-large    { font: 400 1.2rem/1.7 'EB Garamond', serif; }
.body-base     { font: 400 1.0rem/1.65 'EB Garamond', serif; }
.body-small    { font: 400 0.85rem/1.6 'EB Garamond', serif; }

/* NAV — EB Garamond, underline style */
.nav-link      { font: 400 1rem/1 'EB Garamond', serif; text-decoration: underline; }

/* MONO / PRELOADER — Courier */
.mono          { font: 400 1rem/1.5 'Courier Prime', monospace; }

/* SPECIAL — CTA */
.cta           { font: 400 italic 1.1rem/1 'EB Garamond', serif; }
```

---

## 6. LOGO

The SHADER logo is a **lockup** of:
1. A **rainbow-striped horizontal-line icon** (7–8 stacked lines, each a different color from the brand rainbow palette, tapering or speed-lined to the right suggesting motion/velocity)
2. The wordmark **"SHADER"** in a condensed serif or slab

The logo appears in the top-left of the fixed navbar at all times. On dark sections it is full-color. On the preloader it appears large and centered, also full-color.

The "Book a call" button in the top right uses a **telephone receiver icon** (🏛️ style, retro) followed by the text.

---

## 7. NAVIGATION

**Fixed top navbar** persisting across all scroll positions.

```
[LOGO (left)]          [Home] [Selected Work] [About Us] [Contact]          [📞 Book a call (right)]
```

- Background: transparent (inherits section background)
- Nav links: underlined, `EB Garamond`, no hover background — just color shift
- "Book a call": no button border, just telephone icon + text, right-aligned
- On scroll into light sections: nav text shifts to dark
- `position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;`

---

## 8. SCROLL BEHAVIOR

- **Lenis** smooth scroll with `lerp: 0.08`, `duration: 1.4`
- **GSAP ScrollTrigger** pinned to Lenis via `lenis.on('scroll', ScrollTrigger.update)`
- Most sections use **ScrollTrigger pin + scrub** for parallax and reveal
- The film-strip carousel uses **horizontal scroll within a pinned container**
- The Shredder section uses a **canvas-based warp** triggered on scroll progress
- Scroll velocity is tracked to influence certain animations (e.g., CRT screen content)

---

## 9. VIBE / EMOTION / FEELING

This is the most important section. Share this with all team members.

**The word for this site is: THEATRICAL.**

Shader's website is **a comedy show performed by a tech studio.** It is serious about craft and completely absurd in presentation. Every section is a different "bit" — a sketch, a set piece. The humor is dry, corporate-parody, and self-aware.

### Tone spectrum
- **Retro-futurism** — old computers as portals to the future
- **Corporate parody** — buzzword-laden copy delivered with a wink
- **Cinematic gravity** — the handshake, the tie, are shot like movie stills
- **Earnest craft** — the 3D work is genuinely beautiful and technically impressive
- **Wit** — "Good buy." (deliberately misspelled), "We don't troubleshoot printers"

### Visual vocabulary
- Everything feels like it belongs to a different era being **filtered through a future lens**
- Dark, moody, cinematic for the studio identity sections
- Warm cream and editorial for the "serious business" parody sections
- Glitchy, scanlined, distorted for transitions
- The site should feel like flipping channels on a very expensive, very strange television

### What it must NOT feel like
- Generic agency portfolio
- Tech startup with gradients and Inter font
- "We're creative" as decoration rather than substance
- Clean, minimal, safe

---

## 10. FOLDER STRUCTURE

```
shader-rebuild/
├── public/
│   ├── models/
│   │   ├── superpet-computer.glb       # Hero section 3D computer
│   │   ├── phones-array.glb            # "Good buy." section phones
│   │   ├── golden-tie.glb              # Golden tie 3D model
│   │   └── ehealth-showroom.glb        # Work carousel project 1
│   ├── textures/
│   │   ├── grain.png                   # Film grain overlay
│   │   ├── scanlines.png               # CRT scanline texture
│   │   └── crt-curve.png               # CRT vignette mask
│   ├── images/
│   │   ├── about-office-cubicles.webp  # About hero background
│   │   ├── about-retro-computers.webp  # Vintage computer spread
│   │   ├── handshake.webp              # Cinematic handshake
│   │   ├── businessman-shrug.webp      # Shredder section man
│   │   ├── businessman-vintage.webp    # CEO contact card photo
│   │   ├── applauding-group.webp       # Golden tie section crowd
│   │   └── carousel/
│   │       ├── project-01-*.webp       # eHealth Arena screenshots
│   │       ├── project-02-*.webp       # Design is Funny screenshots
│   │       └── project-0N-*.webp       # Additional projects
│   └── fonts/
│       ├── playfair-display.woff2
│       ├── eb-garamond.woff2
│       └── courier-prime.woff2
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                       # Global CSS vars, resets
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.module.css
│   │   ├── Preloader/
│   │   │   ├── Preloader.tsx
│   │   │   └── Preloader.module.css
│   │   └── shared/
│   │       ├── GrainOverlay.tsx
│   │       ├── SmoothScroll.tsx
│   │       └── SectionAnchor.tsx
│   │
│   ├── sections/
│   │   ├── 01-Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.module.css
│   │   │   ├── HeroScene.tsx           # R3F scene
│   │   │   └── SuperPETModel.tsx       # 3D computer component
│   │   ├── 02-SelectedWork/
│   │   │   ├── SelectedWork.tsx
│   │   │   ├── SelectedWork.module.css
│   │   │   ├── FilmStrip.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── 03-AboutHero/
│   │   │   ├── AboutHero.tsx
│   │   │   └── AboutHero.module.css
│   │   ├── 04-AboutCopy/
│   │   │   ├── AboutCopy.tsx
│   │   │   └── AboutCopy.module.css
│   │   ├── 05-AboutVintage/
│   │   │   ├── AboutVintage.tsx
│   │   │   └── AboutVintage.module.css
│   │   ├── 06-Shredder/
│   │   │   ├── Shredder.tsx
│   │   │   ├── Shredder.module.css
│   │   │   └── ShredderCanvas.tsx      # WebGL warp effect
│   │   ├── 07-ContactTease/
│   │   │   ├── ContactTease.tsx
│   │   │   └── ContactTease.module.css
│   │   ├── 08-GoldenTie/
│   │   │   ├── GoldenTie.tsx
│   │   │   ├── GoldenTie.module.css
│   │   │   └── TieScene.tsx            # R3F tie model
│   │   ├── 09-Handshake/
│   │   │   ├── Handshake.tsx
│   │   │   └── Handshake.module.css
│   │   ├── 10-GoodBuy/
│   │   │   ├── GoodBuy.tsx
│   │   │   ├── GoodBuy.module.css
│   │   │   └── PhonesScene.tsx         # R3F phones model
│   │   └── 11-Footer/
│   │       ├── Footer.tsx
│   │       └── Footer.module.css
│   │
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── useScrollProgress.ts
│   │   └── useGSAP.ts
│   │
│   ├── utils/
│   │   ├── glsl/
│   │   │   ├── crtDistort.glsl
│   │   │   ├── filmGrain.glsl
│   │   │   └── shredWarp.glsl
│   │   └── constants.ts
│   │
│   └── types/
│       └── index.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## 11. DEPENDENCIES (package.json highlights)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.105.0",
    "@react-three/postprocessing": "^2.16.0",
    "postprocessing": "^6.36.0",
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.0",
    "lenis": "^1.1.0",
    "framer-motion": "^11.2.0",
    "canvas-confetti": "^1.9.3"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite-plugin-glsl": "^1.3.0"
  }
}
```

---

## 12. PERFORMANCE CONSTRAINTS

| Metric          | Target     |
|-----------------|------------|
| FCP             | < 1.5s     |
| LCP             | < 2.5s     |
| CLS             | < 0.05     |
| TBT             | < 300ms    |
| 3D GLB total    | < 8MB (compressed with Draco) |
| Image total     | < 4MB (WebP/AVIF) |

---

## 13. BROWSER SUPPORT

- Chrome 110+ ✓
- Firefox 115+ ✓
- Safari 17+ ✓
- Mobile: iOS Safari 17+, Chrome Android 110+
- **WebGL2 required** — display fallback message for incompatible browsers

---

## 14. ACCESSIBILITY

- All 3D/canvas sections have `aria-hidden="true"` with visible text equivalents in DOM
- Focus management on nav (skip-to-content link)
- Preloader: `role="progressbar"` with `aria-valuenow`
- Motion: `prefers-reduced-motion` media query disables GSAP scroll scrub and parallax, shows static versions of animated sections
- Full accessibility statement linked in footer: `/accessibility-statement`

---

## 15. CONTACT / BUSINESS INFO (from live site)

```
General:     hello@shader.se
New business: ceo@shader.se
Book a call:  https://cal.com/simon-hedlund-kglzne
Address:     Laxholmstorget 3, 602 21 Norrköping, Sweden
LinkedIn:    linkedin.com/company/shadersweden/
Instagram:   instagram.com/shadersweden/
Twitter/X:   x.com/shadersweden
Copyright:   © Shader Sweden AB. All Rights Reserved.
Tagline:     "A High Tech Business Solutions Company"
```
