// ============================================================
// SHADER REBUILD — Shared Types
// src/types/index.ts
// ============================================================

// ─── PROJECTS / CAROUSEL ─────────────────────────────────────

export interface Project {
  id: number;
  name: string;
  category: string;
  viewUrl: string;
  images: {
    main: string;
    detail1?: string;
    detail2?: string;
  };
}

// ─── NAVBAR ──────────────────────────────────────────────────

export type NavbarTheme = 'light' | 'dark';

export interface NavLink {
  label: string;
  href: string;
  sectionId: string;
}

// ─── SCROLL ──────────────────────────────────────────────────

export interface ScrollState {
  progress: number;   // 0–1 across the full page
  velocity: number;   // scroll velocity (px/frame)
  direction: 1 | -1; // 1 = down, -1 = up
}

// ─── SECTION ANCHOR ──────────────────────────────────────────

export type SectionId =
  | 'home'
  | 'work'
  | 'about-us'
  | 'about-copy'
  | 'about-vintage'
  | 'shredder'
  | 'contact'
  | 'golden-tie'
  | 'handshake'
  | 'good-buy'
  | 'footer';

// ─── STAR PARTICLE (Contact Tease) ───────────────────────────

export interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  lifetime: number;
  age: number;
  size: number;
}

// ─── THREE.JS HELPERS ────────────────────────────────────────

export interface R3FCanvasConfig {
  dpr: [number, number];
  antialias: boolean;
  alpha: boolean;
  powerPreference: 'high-performance' | 'default' | 'low-power';
}

// ─── ENV ─────────────────────────────────────────────────────

export interface AppFeatureFlags {
  enable3D: boolean;
  enableGrain: boolean;
  enablePreloader: boolean;
}
