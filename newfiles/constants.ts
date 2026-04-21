// ============================================================
// SHADER REBUILD — Constants
// src/utils/constants.ts
// ============================================================

import type { NavLink, Project } from '../types';

// ─── BUSINESS INFO ────────────────────────────────────────────

export const CONTACT = {
  email: 'hello@shader.se',
  ceoEmail: 'ceo@shader.se',
  calUrl: 'https://cal.com/simon-hedlund-kglzne',
  address: {
    street: 'Laxholmstorget 3',
    city: '602 21 Norrköping',
    country: 'Sweden',
  },
  social: {
    linkedin: 'https://linkedin.com/company/shadersweden/',
    instagram: 'https://instagram.com/shadersweden/',
    twitter: 'https://x.com/shadersweden',
  },
  copyright: '© Shader Sweden AB. All Rights Reserved.',
  tagline: 'A High Tech Business Solutions Company',
} as const;

// ─── NAVIGATION ───────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',          href: '#home',     sectionId: 'home' },
  { label: 'Selected Work', href: '#work',     sectionId: 'work' },
  { label: 'About Us',      href: '#about-us', sectionId: 'about-us' },
  { label: 'Contact',       href: '#contact',  sectionId: 'contact' },
];

// ─── SECTION NAVBAR THEME MAP ─────────────────────────────────
// 'light' = section has a dark background, navbar shows light text
// 'dark'  = section has a light/cream background, navbar shows dark text

export const SECTION_THEMES: Record<string, 'light' | 'dark'> = {
  'home':          'light',
  'work':          'light',
  'about-us':      'light',
  'about-copy':    'dark',
  'about-vintage': 'dark',
  'shredder':      'dark',
  'contact':       'light',
  'golden-tie':    'light',
  'handshake':     'light',
  'good-buy':      'light',
  'footer':        'light',
};

// ─── COPY ─────────────────────────────────────────────────────

export const COPY = {
  preloader: {
    line1: 'Shader Development Studio, Website',
    line2: 'Version 1.02',
    footer: 'Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.',
  },
  hero: {
    headline: ['A Creative', 'Development', 'Studio, Plugged', 'into the Future'],
    subCta: 'Scroll to Inspect Our Closed Deals',
  },
  selectedWork: {
    title: 'Selected Work',
    subtitle: 'Browse our project carousel to explore our selected work.',
  },
  aboutHero: {
    title: 'About Us',
  },
  aboutCopy: {
    headline: 'Making Digital Storytelling More Playful, Powerful, and Alive',
    col1: `Shader is a creative development studio specialized in building interactive 3D and AI solutions for the web. Serious about business, based in Sweden, and working with brands, agencies and designers worldwide. Plugged into the future. While we're a small team of creative engineers, we have a hand-picked network of collaborators: designers, 3D artists, copywriters, animators, and creative technologists, ready to plug in with an array of capabilities.`,
    col2: `This modular approach means we can scale and adapt to each challenge. Whether it's a WebGL experiment, an interactive product visualization, a mobile app, or an AI-driven experience, we help bold brands stand out across every screen. We build storytelling platforms that demand attention and reward curiosity. We push digital mediums to places you haven't seen before, and have fun doing it. Beyond code, we offer 3D design and animation, UI and motion design, concepts and digital strategy, full-stack development, and creative consulting.`,
    col3: `Whether it's prototyping an idea, launching an augmented reality experience, or bringing high-fidelity visuals to life, Shader bridges the gap between creative ambition and technical execution. Our process is hands-on, collaborative, and tailored for teams that value both craft and innovation. We combine technical expertise with a designer's eye, ensuring that every interaction feels natural and every pixel is perfectly placed. We're not your regular IT department. We don't troubleshoot printers.`,
  },
  shredder: {
    headline: 'Had Enough Reading? Let\'s Shred This Thing.',
    sub: 'We\'ve got one last trick up our sleeve.',
  },
  contactTease: {
    headline: 'Still Not Convinced We\'re Serious About Business?',
    sub: 'We\'ve got one last trick up our sleeve.',
  },
  goldenTie: {
    headline: 'Check Out This Golden Tie',
    sub: 'You made it this far. You deserve a tie-break.',
  },
  goodBuy: {
    headline: 'Good buy.',
  },
  footer: {
    newBusiness: 'New business',
    newBusinessBody: 'Reach out today to our CEO for new business enquiries at',
    certBadge: 'WORLDWIDE BUSINESS CERTIFIED COMPANY',
    accessibilityStatement: 'READ OUR ACCESSIBILITY STATEMENT',
    accessibilityHref: '/accessibility-statement',
  },
} as const;

// ─── PROJECTS (placeholder — replace with real data) ──────────

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'eHealth Arena',
    category: '3D Showroom',
    viewUrl: '#',
    images: {
      main: '/images/carousel/project-01-main.webp',
      detail1: '/images/carousel/project-01-detail1.webp',
    },
  },
  {
    id: 2,
    name: 'Design is Funny',
    category: 'Brand Identity',
    viewUrl: '#',
    images: {
      main: '/images/carousel/project-02-main.webp',
      detail1: '/images/carousel/project-02-detail1.webp',
    },
  },
  // Add remaining projects here
];

// ─── ANIMATION TIMING ─────────────────────────────────────────

export const TIMING = {
  preloaderExitHold: 400,         // ms before CRT power-off begins
  crtCollapseY: 200,              // ms for vertical squish
  crtCollapseX: 150,              // ms for horizontal shrink
  crtFlash: 200,                  // ms for white flash
  heroEnterDelay: 300,            // ms after preloader exits
  sectionEnterDuration: 600,      // ms for typical section entrance
  staggerDelay: 80,               // ms between staggered items
  parallaxScrub: 1.5,             // GSAP scrub value for film strip
} as const;

// ─── FEATURE FLAGS (from env) ─────────────────────────────────

export const FEATURES = {
  enable3D: import.meta.env.VITE_ENABLE_3D !== 'false',
  enableGrain: import.meta.env.VITE_ENABLE_GRAIN !== 'false',
  enablePreloader: import.meta.env.VITE_ENABLE_PRELOADER !== 'false',
} as const;
