# 13 — SCROLL & ANIMATION SYSTEM
## GSAP + Lenis Architecture: Complete Timeline

---

## OVERVIEW

This document defines the **entire scroll and animation system** for the Shader rebuild. Every section's entrance, scroll behavior, pinning logic, and exit is specified here. This is the master reference for whoever implements scroll-driven animations.

The two tools doing all the work:
- **Lenis** — replaces native scroll with a smooth, momentum-based scroll engine
- **GSAP ScrollTrigger** — attaches animations to scroll position, handles pinning

They work together: Lenis intercepts scroll events → feeds them to ScrollTrigger → ScrollTrigger drives GSAP timelines.

---

## 1. LENIS SETUP

```typescript
// src/hooks/useLenis.ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.4,          // scroll duration in seconds
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // Bridge Lenis → ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Lenis RAF loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

// Pause Lenis during preloader
export function pauseLenis(): void { lenis?.stop(); }
export function resumeLenis(): void { lenis?.start(); }
```

**IMPORTANT**: Lenis must be **paused** while the preloader is active (so the user cannot scroll before the site is ready). Call `pauseLenis()` on init, `resumeLenis()` when preloader exits.

---

## 2. SCROLLTRIGGER DEFAULTS

```typescript
// Set once at app init
ScrollTrigger.defaults({
  scroller: document.body, // Lenis uses body
  invalidateOnRefresh: true,
});

// Refresh ScrollTrigger after Lenis updates
// (needed after dynamic content loads)
ScrollTrigger.addEventListener('refresh', () => lenis?.scrollTo(0, { immediate: true }));
window.addEventListener('resize', () => ScrollTrigger.refresh());
```

---

## 3. SECTION-BY-SECTION SCROLL BEHAVIORS

### PRELOADER (no scroll)
- Lenis is paused. No scroll triggers. Pure time-based animation.

---

### HERO — `#home`
**Scroll type**: Passive parallax (not pinned)
**Trigger**: enters viewport

```typescript
// Hero text parallax — text drifts upward as user scrolls
gsap.to('.hero-text', {
  yPercent: -25,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

// Hero fog particles — fade out as user scrolls
gsap.to('.hero-fog', {
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-hero',
    start: 'top top',
    end: '60% top',
    scrub: true,
  }
});

// 3D computer — camera moves INTO the screen (R3F, not DOM)
// Handled inside HeroScene.tsx via useFrame + scroll progress
// See section 3D CAMERAS below
```

**Three.js camera scroll** (inside `HeroScene.tsx`):
```typescript
// useScrollProgress() returns 0→1 across hero section
const progress = useScrollProgress('#section-hero');

useFrame(() => {
  // Move camera from initial position toward monitor screen
  camera.position.lerp(
    new THREE.Vector3(
      THREE.MathUtils.lerp(0, 0.8, progress),   // move right
      THREE.MathUtils.lerp(0, 0.2, progress),   // move up
      THREE.MathUtils.lerp(5, 1.2, progress),   // zoom in
    ),
    0.05
  );
  camera.lookAt(monitorScreenPosition);
});
```

---

### SELECTED WORK — `#work`
**Scroll type**: **PINNED** + horizontal scroll conversion
**Duration**: 4× viewport height of scrollable distance (one "viewport" per project approximately)

```typescript
// Pin the work section
// Horizontal scroll: convert vertical scroll to horizontal translation of film strip

const numProjects = 11;
const stripWidth = document.querySelector('.film-strip')!.scrollWidth;

gsap.to('.film-strip', {
  x: () => -(stripWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-work',
    pin: true,
    scrub: 1.5,         // 1.5s lag for inertia feel
    start: 'top top',
    end: () => `+=${stripWidth - window.innerWidth + window.innerWidth * 0.5}`,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Update active project index based on scroll progress
      const idx = Math.round(self.progress * (numProjects - 1));
      updateActiveProject(idx);
    },
  }
});

// Scale in on enter
gsap.fromTo('.film-strip-wrapper', 
  { scale: 0.6, opacity: 0 },
  {
    scale: 1, opacity: 1,
    scrollTrigger: {
      trigger: '.section-work',
      start: 'top 90%',
      end: 'top 20%',
      scrub: true,
    }
  }
);
```

**Important**: The film strip wrapper must have `will-change: transform` for GPU compositing. Test thoroughly for paint jank.

---

### ABOUT HERO — `#about-us`
**Scroll type**: Passive parallax
**Duration**: 1× viewport height

```typescript
// Parallax the background image at 0.5x speed
gsap.to('.about-hero-bg', {
  yPercent: -20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-about-hero',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});

// Fade in "About Us" headline
gsap.fromTo('.about-hero-title',
  { opacity: 0, y: 20 },
  {
    opacity: 0.85, y: 0, duration: 0.6,
    scrollTrigger: {
      trigger: '.section-about-hero',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    }
  }
);
```

---

### ABOUT COPY (cream section)
**Scroll type**: Passive, entrance animations only

```typescript
// Headline stagger reveal
gsap.fromTo('.about-headline',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-about-copy',
      start: 'top 75%',
      toggleActions: 'play none none none',
    }
  }
);

// Three columns stagger
gsap.fromTo('.about-col',
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.section-about-copy',
      start: 'top 65%',
      toggleActions: 'play none none none',
    }
  }
);

// Businessman slides in from right
gsap.fromTo('.about-businessman',
  { opacity: 0, x: 80 },
  {
    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-about-copy',
      start: 'top 60%',
      toggleActions: 'play none none none',
    }
  }
);
```

---

### ABOUT VINTAGE (retro computer spread)
**Scroll type**: Deep parallax

```typescript
gsap.to('.about-vintage-img', {
  yPercent: -15,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-about-vintage',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});

// Rainbow stripe entrance (top stripe)
// Each stripe extends from 0→100% width, staggered
gsap.fromTo('.rainbow-stripe-segment',
  { scaleX: 0, transformOrigin: 'left center' },
  {
    scaleX: 1,
    duration: 0.4,
    stagger: 0.04,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-about-vintage',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  }
);
```

---

### SHREDDER
**Scroll type**: scroll-bound transition + moving gate + strip warp

The reference capture shows a full-width horizontal shredder gate sweeping upward while the cream page becomes dense wavy vertical strips. Drive the effect with CSS custom properties so the DOM, CSS/SVG fallback, and optional WebGL shader stay in sync.

```typescript
const section = document.querySelector<HTMLElement>('.section-shredder');

ScrollTrigger.create({
  trigger: section,
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress;

    section?.style.setProperty('--shred-progress', String(progress));
    section?.style.setProperty('--gate-y', `${100 - progress * 120}%`);
    section?.style.setProperty('--wave-amount', String(Math.min(1, progress * 1.35)));

    // Optional WebGL path: keep shader uniforms aligned with the DOM gate.
    shredderShader?.uniforms.uProgress.value = progress;
    shredderShader?.uniforms.uGateY.value = 1 - progress;
  },
});
```

Progress mapping:
- `0.00-0.20`: previous cream CTA exits; rainbow rule and shredder headline enter.
- `0.20-0.35`: headline and businessman remain clean and readable.
- `0.35-0.70`: gate crosses the panel; shredded layer expands below it.
- `0.70-0.85`: gate leaves near the top; cream sheet becomes a wavy curtain.
- `0.85-1.00`: navy Contact Tease centers under the cream remnant.

---

### CONTACT TEASE
**Scroll type**: Entrance animation, passive

```typescript
// Headline words stagger in from below
gsap.fromTo('.contact-tease-word',
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0,
    duration: 0.7, ease: 'power3.out',
    stagger: 0.06,
    scrollTrigger: {
      trigger: '.section-contact-tease',
      start: 'top 70%',
      toggleActions: 'play none none none',
    }
  }
);
// Note: split headline into individual <span> words for stagger
// Use split utility: splitWords('.contact-tease-title')
```

**Star particle system** (JS, not GSAP):
```typescript
// Runs via requestAnimationFrame inside the section
// Each star: { x, y, vx, vy, rotation, rotationSpeed, opacity, lifetime, age, size }
function spawnStar(container: HTMLElement): Star {
  return {
    x: Math.random() * container.offsetWidth,
    y: Math.random() * container.offsetHeight * 0.8 + container.offsetHeight * 0.1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.3 - 0.1, // slight upward drift
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    opacity: 0,
    lifetime: 3000 + Math.random() * 3000,
    age: 0,
    size: 40 + Math.random() * 40,
  };
}
```

---

### GOLDEN TIE
**Scroll type**: Camera orbit scrub (R3F), entrance animations

```typescript
// Camera orbit: driven by scroll progress
// Handled inside TieScene.tsx
const tieProgress = useScrollProgress('#section-golden-tie');

useFrame(() => {
  camera.position.x = Math.sin(tieProgress * Math.PI * 0.4) * 3;
  camera.position.z = Math.cos(tieProgress * Math.PI * 0.4) * 3;
  camera.lookAt(0, 0, 0);
});

// Entrance: people walk in from edges
gsap.fromTo('.tie-person-left',
  { x: '-120%' },
  {
    x: '0%', duration: 0.8, ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.section-golden-tie',
      start: 'top 60%',
      toggleActions: 'play none none none',
    }
  }
);

gsap.fromTo('.tie-person-right',
  { x: '120%' },
  {
    x: '0%', duration: 0.8, ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.section-golden-tie',
      start: 'top 60%',
      toggleActions: 'play none none none',
    }
  }
);
```

**Soft-body tie physics** (R3F + GSAP, no Rapier):
```typescript
// Procedural sine-wave deformation of tie mesh vertices
// Simpler than real physics, indistinguishable visually

useFrame(({ clock }) => {
  const t = clock.getElapsedTime();
  const positions = tieGeometry.attributes.position;
  
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);  // 0 = knot (top), negative = blade (bottom)
    const normalizedDepth = Math.abs(Math.min(y, 0)) / maxTieLength;
    
    // More movement at the bottom
    const swayAmount = normalizedDepth * normalizedDepth * 0.15;
    const newX = Math.sin(t * 0.8 + normalizedDepth * 1.5) * swayAmount;
    
    positions.setX(i, newX);
  }
  
  positions.needsUpdate = true;
  tieGeometry.computeVertexNormals();
});
```

---

### HANDSHAKE
**Scroll type**: Deep parallax + opacity

```typescript
gsap.to('.handshake-img', {
  yPercent: -12,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section-handshake',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
});

gsap.fromTo('.handshake-img',
  { scale: 1.05, opacity: 0 },
  {
    scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-handshake',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  }
);
```

---

### GOOD BUY
**Scroll type**: Camera orbit scrub (R3F)

```typescript
// Phone monument camera orbit
const goodBuyProgress = useScrollProgress('#section-good-buy');

useFrame(() => {
  const angle = goodBuyProgress * Math.PI * 0.3 - Math.PI * 0.1; // -18° to +36°
  camera.position.x = Math.sin(angle) * 4;
  camera.position.z = Math.cos(angle) * 4;
  camera.position.y = 1.5;
  camera.lookAt(0, 0.5, 0);
});

// "Good buy." text entrance
gsap.fromTo('.good-buy-text',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.good-buy-text',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  }
);
```

---

### FOOTER
**Scroll type**: Staggered entrance only

```typescript
// Contact columns stagger
gsap.fromTo('.footer-col',
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.section-footer',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  }
);

// CEO card
gsap.fromTo('.ceo-card',
  { opacity: 0, scale: 0.96 },
  {
    opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '.ceo-card',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  }
);
```

---

## 4. SCROLL PROGRESS HOOK

```typescript
// src/hooks/useScrollProgress.ts
import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useScrollProgress(sectionSelector: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionSelector,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, [sectionSelector]);

  return progress;
}
```

---

## 5. PREFERS-REDUCED-MOTION

**All animations must respect this system preference.**

```typescript
// src/utils/motion.ts
export const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Usage:
if (!prefersReducedMotion) {
  gsap.to('.element', { ... });
} else {
  // Show final state immediately
  gsap.set('.element', { opacity: 1, y: 0 });
}
```

**For ScrollTrigger scrub animations** (parallax, etc.):
- Disable entirely on `prefers-reduced-motion: reduce`
- Set `scrub: false` and use `toggleActions: 'play none none none'` instant reveals instead

**For Three.js scenes**:
- On reduced motion: disable camera orbits, disable cloth/physics
- Show static render only

---

## 6. SECTION TRANSITION SYSTEM

Sections flow as a continuous scroll. No page reloads, no route changes. Hash updates are cosmetic only (history.pushState via IntersectionObserver).

```typescript
// src/components/shared/SectionAnchor.tsx
// Updates URL hash when section enters viewport

import { useEffect, useRef } from 'react';

interface Props {
  id: string;        // e.g., 'home', 'work', 'about-us', 'contact'
  threshold?: number; // 0–1, how much of section must be visible
}

export function SectionAnchor({ id, threshold = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          history.replaceState(null, '', `#${id}`);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, threshold]);

  return <div ref={ref} id={id} />;
}
```

---

## 7. PERFORMANCE NOTES

### Kill ScrollTriggers on unmount
Every `ScrollTrigger.create()` call must be stored and `.kill()`-ed in the cleanup function of the React effect. Use `useGSAP()` from `@gsap/react` which handles this automatically.

```typescript
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  gsap.to('.element', {
    scrollTrigger: { ... },
    y: 100,
  });
}, { scope: containerRef }); // auto-cleanup on unmount
```

### `will-change` budget
- Apply `will-change: transform` only to the **film strip** and **parallax images**
- Maximum 4 elements with `will-change` active simultaneously
- Remove `will-change` once animation completes (via `onComplete`)

### Three.js and GSAP coexistence
- The R3F canvas runs its own RAF loop
- GSAP also runs its own RAF loop
- Do **not** use `gsap.ticker` for R3F animation — use `useFrame` inside R3F
- Use GSAP only for DOM elements; use R3F/useFrame for Three.js objects
- The bridge between them: `useScrollProgress()` reads GSAP/ScrollTrigger values and passes them into R3F via React state (or Zustand store for performance)
