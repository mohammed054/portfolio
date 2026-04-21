# 18 — PHOTO & IMAGE ASSET SPECS
## For the Art Director, Photographer & Retoucher

---

## OVERVIEW

This document specifies every **photographic and illustration asset** needed for the rebuild. For each asset, it details what must be in the image, the required dimensions, file format, color treatment, and sourcing guidance. Some assets exist on the live site; all must be either licensed, re-created, or sourced fresh.

---

## ASSET INVENTORY

| ID | Filename | Section | Type | Est. Size |
|----|----------|---------|------|-----------|
| P-01 | `about-office-cubicles.webp` | About Hero | 3D render / stock | ~400KB |
| P-02 | `about-retro-computers.webp` | About Vintage | Stock / recreated photo | ~500KB |
| P-03 | `businessman-about.png` | About Copy | Cutout PNG | ~200KB |
| P-04 | `businessman-shrug.png` | Shredder | Cutout PNG | ~200KB |
| P-05 | `ceo-phone-portrait.png` | Footer | Cutout PNG | ~80KB |
| P-06 | `handshake.webp` | Handshake | Stock photo | ~350KB |
| P-07 | `applauding-people-*.png` | Golden Tie | Cutout PNGs (×5-7) | ~60KB each |
| P-08 | `og-image.jpg` | Meta tags | Composite render | ~150KB |

**Total estimated image payload**: ~2.5MB (before compression)

---

## P-01: Office Cubicle Array (About Hero)

**Purpose**: Full-bleed background for the "About Us" section hero. A dramatic aerial view of an office cubicle maze that communicates scale, corporate uniformity, and faint dystopia.

**Dimensions**: 2560×1440px minimum (16:9)
**Format**: WebP, quality 90
**File size target**: < 450KB

**Visual requirements**:
- Elevated bird's-eye view (45–60° above floor level) of an open-plan office
- Hundreds of identical cubicle workstations in a grid pattern
- Each cubicle has: desk, black office chair, CRT monitor (important period detail)
- Cubicle dividers: low-height (~5ft) fabric panels, neutral gray or beige
- The grid extends to the horizon (infinity illusion)
- No people — completely empty (adds to the uncanny/dystopian quality)
- No windows or exterior views visible

**Preferred source**: This appears to be a **3D CG render** on the live site, not a real photograph. A Blender or Cinema 4D render with thousands of instanced cubicle objects is the cleanest approach. Alternatively: Getty Images / Shutterstock search terms: "office cubicles aerial 3D render infinite" or "corporate office overhead view"

**Color treatment**:
- Desaturate to ~85% gray (keep a slight cool gray tint, not warm brown)
- Increase contrast: Curves → bring blacks to ~20, whites to ~230
- Apply a subtle top vignette: darken top 10% with a gradient
- Do not add grain (the site's grain overlay handles that)

---

## P-02: Retro Computer Product Spread (About Vintage)

**Purpose**: Full-bleed 1982-era technology catalog product photograph. This is a key visual — it must be period-perfect.

**Dimensions**: 2560×1440px minimum
**Format**: WebP, quality 92
**File size target**: < 550KB

**Visual requirements**:
- Shot against a **flat, warm gray studio background** (`~#c8b89a`, a sandy stone color)
- Equipment spread: minimum 3 items:
  1. Two Apple II–era keyboard/computer units (can be exact Apple IIs, or Commodore PETs)
  2. One dot-matrix printer (wide format, early 1980s — Epson MX-80 style)
  3. One CRT monitor showing a bar chart (see below)
- **The monitor on-screen content is critical**:
  - Label: "NET SALES BY DIVISION"
  - Axis label: `<1000>`
  - Y-axis: 10 to 80
  - X-axis: seven divisions (labeled 1–7 or BID)
  - Bar colors: magenta, yellow, green, red, teal, yellow-green (period-accurate CGA palette)
  - This should look like an Apple II running Visicalc/VisiPlot
- Photography style: high-key softbox from top-left, clean even illumination
- No people, no hands, no context

**Color treatment**:
- Very slight warm cast: +5 temperature toward yellow
- Mild contrast boost
- The screen content (bar chart) should be the most colorful element in the frame
- Do NOT desaturate — this section is meant to be warm and period-authentic

**Sourcing approach**:
- Option A: Commission original product photography with rented vintage equipment
- Option B: Source from museum collections (Computer History Museum, etc.) with licensing
- Option C: 3D render (Blender + vintage computer models from Sketchfab/Poly Haven)
- **Do NOT use obviously modern-looking stock photos** of retro computers — the period authenticity is critical

---

## P-03: Vintage Businessman Cutout — About (About Copy)

**Purpose**: Corporate archetype figure standing alongside the about copy. Creates humorous contrast between the earnest copy and the corny stock-photo character.

**Dimensions**: ~600×900px at 2x (600px wide, full height of the copy section)
**Format**: PNG with transparent background
**File size target**: < 250KB

**Visual requirements**:
- Male figure, apparent age 40s–50s
- Business attire: formal white or light blue dress shirt, dark or patterned tie, possibly blazer
- Neutral expression — perhaps slightly smug, or gesturing to a document
- Pose: standing, three-quarter view (not fully frontal), perhaps holding papers or pointing
- The figure should be from the **shoulders up to feet** — full body, portrait orientation
- Background removed completely (transparent PNG)

**Aesthetic**:
- Color: slightly warm, mildly desaturated — looks like a 1994 corporate brochure photo
- Very slightly soft/low-contrast (printed materials look)
- Hair and clothing should look period-appropriate (early 1990s business fashion)
- Avoid any modern hair styles, phone, computer equipment in frame

**Source options**:
- Retro stock photography archives (Getty vintage, Alamy historical)
- AI generation (Midjourney / FLUX — specify: "1990s corporate portrait, business professional, formal attire, clean background, stock photo, warm tone")
- Custom shoot (budget-allowing)

---

## P-04: Businessman Shrug Cutout (Shredder Section)

**Purpose**: The comedic foil who "feeds" the page into the shredder. He gestures to the shredder machine with arms wide, an expression of mock-exasperation or "well, what can you do?"

**Dimensions**: ~500×700px at 2x
**Format**: PNG with transparent background
**File size target**: < 250KB

**Visual requirements**:
- Male figure, similar vintage aesthetic to P-03 (same "universe" of corporate stock)
- Can be the same character/person as P-03, or different
- **Pose is critical**: arms spread wide and slightly upward — the classic "I don't know" / "what do you want from me?" gesture
- Expression: exasperated, bewildered, or performatively helpless
- Business casual: dress shirt + tie minimum (jacket optional)
- From approximately mid-thigh upward (waist to top of head)

**Aesthetic**: Same vintage treatment as P-03.

---

## P-05: CEO Portrait — Holding Phone (Footer)

**Purpose**: The CEO contact card photo. Small but character-defining — a person on the phone, ready for business.

**Dimensions**: ~240×300px at 2x (small card portrait)
**Format**: PNG with transparent background
**File size target**: < 100KB

**Visual requirements**:
- Person holding a phone receiver to their ear (old-school desk phone handset)
- Business/formal attire
- Expression: engaged, confident, ready to deal
- Can be male or female
- Same vintage stock photo aesthetic as P-03/P-04
- Background: completely transparent
- **Important**: The phone being held should be a **retro desk phone handset**, not a smartphone

**Note**: This is meant to humorously reinforce the "Call us" messaging. The character should feel like the SHADER "mascot" — consistent with the rest of the site's corporate parody persona.

---

## P-06: Cinematic Handshake (Handshake Section)

**Purpose**: The emotional pivot of the site — a dramatic close-up of a handshake that signals genuine partnership and deal-making.

**Dimensions**: 2560×1440px
**Format**: WebP, quality 92
**File size target**: < 400KB

**Visual requirements**:
- **Extreme close-up**: only hands and wrist-area visible. No faces, no context
- Both hands are in formal business suits (white dress shirt, dark suit jacket cuffs)
- The grip is firm and completed — a confident handshake, not an initiation
- **One hand has a diamond ring** (adds a personal/character detail that was present on the live site)
- Background: **pure black**, zero ambient
- Lighting: dramatic hard side-key light (right side), very deep shadows
- The hands appear **luminous** against the pure black — like a film still

**Aesthetic**:
- Cinematic, desaturated ~30% (skin tones preserved, just slightly muted)
- Very slight film grain (the site overlay will add more, so be conservative here)
- High contrast — the shadows are deep black, not raised
- This should feel like a frame from a 2005 Wall Street film

**Source options**:
- Original photography (controlled studio, 2 actors/models, hard lighting)
- Stock photo: Getty, Shutterstock — search "handshake dramatic lighting dark background cinematic"
- The ring detail may need to be composited in if not sourced naturally

---

## P-07: Applauding Business People Cutouts (Golden Tie Section)

**Purpose**: The celebratory audience for the Golden Tie. Multiple individual figures arranged to form a crowd.

**Quantity**: 5–7 individual cutout PNGs
**Dimensions per figure**: ~400×700px at 2x (variable by figure height)
**Format**: PNG with transparent background
**File size target**: ~70KB per figure compressed (use Squoosh/TinyPNG)

**Visual requirements per figure**:
- Each is an individual business professional (mix of male/female)
- All are applauding, celebrating, or raising their arms in triumph
- Business attire: suits, blazers, formal wear
- Period aesthetic: early-to-mid 1990s business fashion
- Full body or at least from waist up
- No two figures should have identical poses
- They should feel like they're from **the same universe** (consistent art direction)

**Required poses** (approximate):
1. Woman, blazer, clapping hands together (facing camera)
2. Man in dark suit, fist raised / pumping
3. Mixed group of 2–3 people applauding (can be one composite image)
4. Woman, formal dress or blazer, hands raised
5. Man, arms spread in celebration

**Aesthetic**:
- Same vintage corporate stock photo treatment as all other people assets
- Slightly desaturated (~60% saturation — they're slightly muted, not full color)
- Warm-processed (slightly yellow-warm tone)
- Strong top-down lighting (they're lit by the spotlight from above)

**Animation preparation**:
For each figure, provide **2 PNG frames** (for the simple 2-frame clapping animation):
- Frame A: hands at neutral position (or clapping just completed)
- Frame B: hands slightly raised or separated (mid-clap)

Name them: `clap-figure-01-a.png`, `clap-figure-01-b.png`, etc.

---

## P-08: OG Image (Social Preview)

**Purpose**: The image shown when the site URL is shared on social media (Twitter, LinkedIn, iMessage, etc.).

**Dimensions**: 1200×630px (2:1 — standard OG size)
**Format**: JPEG, quality 88
**File size target**: < 200KB

**Visual requirements**:
- Composite image combining the hero aesthetic: dark background + the 3D SuperPET computer (right side) + "SHADER" logo and wordmark (left-center)
- Subtitle: "A Creative Development Studio, Plugged into the Future"
- The SHADER logo and wordmark must be legible at small sizes
- Optional: add the preloader-style blue CRT aesthetic as an alternative

---

## UNIVERSAL IMAGE TREATMENT GUIDE

### For all dark-section images (P-01, P-06):
```
Photoshop / Lightroom adjustments:
  Saturation:   -40 to -60 (desaturate)
  Contrast:     +25
  Blacks:       -20 (deeper shadows)
  Whites:       -10 (slightly compressed highlights)
  Clarity:      +10
  Grain:        0 (site overlay handles it)
```

### For all light/cream-section images (P-02):
```
  Temperature:  +150 (warmer)
  Saturation:   -10 (slight desaturation only)
  Contrast:     +10
  Highlights:   -15
  Clarity:      +5
```

### For all cutout PNGs (P-03 through P-07):
- Remove background using Photoshop "Remove Background" → manual refinement
- Soften the edges slightly (0.5px feather) — hard edges look harsh on screen
- Do NOT use aggressive edge detection — hair and loose clothing must look natural
- Always deliver at 2x resolution (for retina screens)
- Compress with `pngquant --quality=75-90` or TinyPNG

---

## DELIVERY FORMAT

All assets delivered as a `.zip` with the following structure:
```
assets-delivery/
├── originals/          ← full-resolution, uncompressed source files
│   ├── P01-office-cubicles.psd (or .blend/.c4d)
│   ├── P02-retro-computers.tif
│   └── ...
├── web-ready/          ← processed, compressed, correctly named for /public/
│   ├── images/
│   │   ├── about-office-cubicles.webp
│   │   ├── about-retro-computers.webp
│   │   ├── handshake.webp
│   │   └── og-image.jpg
│   └── cutouts/
│       ├── businessman-about.png
│       ├── businessman-shrug.png
│       ├── ceo-phone-portrait.png
│       ├── applauding-people/
│       │   ├── clap-figure-01-a.png
│       │   ├── clap-figure-01-b.png
│       │   └── ...
└── README.txt          ← notes on any licensing, sourcing, or variations
```
