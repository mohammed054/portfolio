# MH Portfolio — Procedural 3D Code-Driven Portfolio

A cinematic, scroll-driven portfolio built with **Next.js 14**, **Three.js / React Three Fiber**, **GSAP ScrollTrigger**, and **Framer Motion**.

---

## ✦ Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| 3D Engine | Three.js + React Three Fiber |
| 3D Helpers | Drei |
| Scroll Animation | GSAP + ScrollTrigger |
| UI Animation | Framer Motion |
| Styling | Tailwind CSS + CSS Variables |
| State | Zustand |
| Post-processing | @react-three/postprocessing (Bloom) |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Add fonts (required for 3D Text)

The 3D initials (`MHInitials.tsx`) and hero text require **typeface JSON fonts** in `public/fonts/`.

You need:
- `public/fonts/Syne_Bold.json`
- `public/fonts/DMSans_Regular.json`

Generate them using [facetype.js](https://gero3.github.io/facetype.js/):
1. Upload `Syne-Bold.ttf` → download JSON → save as `Syne_Bold.json`
2. Upload `DMSans-Regular.ttf` → download JSON → save as `DMSans_Regular.json`

Or install via npm and copy:
```bash
# Fonts available from Google Fonts or npm packages
```

> **Tip:** If you skip the fonts, `MHInitials` and `HeroText` will simply not render — the rest of the site works fine.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css        # Design tokens + global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Entry point
├── components/
│   ├── canvas/            # Three.js / R3F components
│   │   ├── Scene.tsx      # Canvas root
│   │   ├── CameraRig.tsx  # Scroll-driven camera
│   │   ├── StarField.tsx  # Procedural stars (shader)
│   │   ├── BlackHole.tsx  # Black hole with Fresnel glow
│   │   ├── AccretionDisk.tsx # Rotating torus shader
│   │   ├── MHInitials.tsx # Interactive 3D text
│   │   ├── HeroText.tsx   # Floating hero text
│   │   └── FloatingParticles.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── ui/                # UI components
│       ├── Loader.tsx
│       ├── Navigation.tsx
│       ├── CustomCursor.tsx
│       └── NoiseOverlay.tsx
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useReducedMotion.ts
│   └── useScrollProgress.ts
├── lib/
│   ├── data.ts            # Portfolio content
│   ├── gsap.ts            # GSAP setup + helpers
│   └── three-utils.ts     # Three.js utilities
├── store/
│   └── scene.ts           # Zustand global state
└── types/
    └── index.ts
```

---

## 🎨 Design Tokens

All design tokens are defined in `src/app/globals.css` as CSS custom properties:

```css
--accent-primary:    #7A3CFF  /* Purple */
--accent-secondary:  #00D0FF  /* Electric blue */
--background-deep:   #000010  /* Cosmic void */
```

---

## 📱 Responsive Strategy

| Breakpoint | Strategy |
|---|---|
| Mobile < 768px | CSS fallback, no heavy 3D, no post-processing |
| Tablet 768–1024px | Reduced particle count, simpler shaders |
| Desktop > 1024px | Full procedural 3D with Bloom post-processing |

---

## ✏️ Customization

1. **Content** → Edit `src/lib/data.ts` (projects, skills, timeline, testimonials)
2. **Colors** → Edit CSS variables in `src/app/globals.css`
3. **3D scene** → Edit components in `src/components/canvas/`
4. **Scroll behavior** → Edit `CameraRig.tsx` + GSAP triggers in `Hero.tsx` / `About.tsx`

---

## ♿ Accessibility

- All 3D scene elements are `aria-hidden`
- Screen-reader text duplicates 3D content
- `prefers-reduced-motion` respected — fade-only fallback
- Keyboard navigable, AA color contrast minimum

---

## ⚡ Performance Targets

- LCP < 2.5s
- 60 FPS desktop / 30 FPS mobile
- JS < 200kb initial bundle
- Canvas renders on-demand (`frameloop="demand"`)
- Assets disposed when leaving viewport
