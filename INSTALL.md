# Hero Section — Setup Guide

## Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing gsap framer-motion

npm install -D @types/three typescript tailwindcss autoprefixer postcss
```

## Font Files Required

Place **typeface.js format** JSON fonts in `public/fonts/`:

- `public/fonts/Syne_Bold.json`  ← Used for MH initials
- `public/fonts/DM_Sans_Regular.json`  ← Used for subtitles (if 3D text needed later)

**How to get typeface fonts:**
1. Go to https://gero3.github.io/facetype.js/
2. Upload your font file (Syne Bold, DM Sans Regular)
3. Download the JSON and place in `public/fonts/`

Alternatively, use any other typeface JSON and update the path in:
`src/components/hero/MHInitials.tsx` → `font="/fonts/YOUR_FONT.json"`

## Dev Server

```bash
npm run dev
```

## Interaction Flow

```
Page Load
    │
    ▼
[IDLE] – Stars drift, black hole pulses, cursor repels particles
    │
    │ ← CLICK ANYWHERE
    ▼
[APPROACHING] – Camera flies toward black hole (2.8s cinematic dolly)
    │
    │ ← CLICK THE BLACK HOLE
    ▼
[INITIALS] – MH 3D initials emerge from the singularity
    │
    │ ← CLICK THE MH INITIALS
    ▼
[TEXT] – "Mohammed Hassoun – Software Engineer" appears
         CTA buttons fade in
```

## Performance Notes

- Bloom is heavy — if FPS drops on mobile, reduce `intensity` in EffectComposer
- Star count default 900, reduce to 500 for mobile in HeroScene.tsx
- `frameloop` is set to `"always"` for continuous animation; switch to `"demand"` if needed

## Architecture

```
src/
  app/
    layout.tsx          ← Syne + DM Sans + JetBrains Mono fonts
    page.tsx            ← Dynamic import (no SSR)
    globals.css         ← Design tokens, cursor, animations
  components/hero/
    HeroScene.tsx       ← Canvas + state machine + overlays
    BlackHole.tsx       ← Event horizon + accretion disk shaders
    StarField.tsx       ← Procedural stars + cursor repulsion
    MHInitials.tsx      ← Text3D + emission + tilt
    ParticleField.tsx   ← Orbital ambient particles
    HeroText.tsx        ← HTML text overlay
    CameraController.tsx← GSAP stage-driven camera
  hooks/
    useMouse.ts         ← Global mouse tracking ref
```
