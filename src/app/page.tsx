'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import PostHeroSection from '@/components/PostHeroSection/PostHeroSection';
import { useSceneStore } from '@/store/scene';

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 4, height: 4, borderRadius: '50%', background: '#00C8FF',
        boxShadow: '0 0 80px 40px rgba(0,180,255,0.35)',
      }} />
    </div>
  ),
});

export default function Home() {
  const heroExited    = useSceneStore(s => s.heroExited);
  const setHeroExited = useSceneStore(s => s.setHeroExited);
  const lastScrollY   = useRef(0);

  /* Track first-ever hero exit to trigger the portal transition exactly once */
  const didExitRef    = useRef(false);
  const [portalPhase, setPortalPhase] = useState<'idle' | 'enter' | 'hold' | 'leave'>('idle');

  /* Lock scroll during hero phase */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = 'hidden';
  }, []);

  /* Trigger cinematic portal when heroExited becomes true for the first time */
  useEffect(() => {
    if (heroExited && !didExitRef.current) {
      didExitRef.current = true;

      // Phase 1 — black hold (matches the black-hole darkness)
      setPortalPhase('enter');

      // Phase 2 — radial reveal expanding outward (portal opening)
      setTimeout(() => setPortalPhase('hold'), 180);

      // Phase 3 — fade out as asteroid field is revealed
      setTimeout(() => setPortalPhase('leave'), 820);

      // Done — remove overlay
      setTimeout(() => setPortalPhase('idle'), 1900);
    }
  }, [heroExited]);

  /* When hero exits: unlock scroll */
  useEffect(() => {
    if (heroExited) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.style.overflow = '';
      requestAnimationFrame(() => {
        document.documentElement.style.overflow = 'auto';
      });
    }
  }, [heroExited]);

  /* Wheel-up at page top → go back to hero */
  useEffect(() => {
    if (!heroExited) return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        setHeroExited(false);
        didExitRef.current = false;   // allow portal to re-play on next exit
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [heroExited, setHeroExited]);

  /* Track scroll */
  useEffect(() => {
    const onScroll = () => { lastScrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Portal overlay style — computed per phase ──────────────────── */
  const portalStyle: React.CSSProperties = (() => {
    if (portalPhase === 'idle') return { display: 'none' };

    const base: React.CSSProperties = {
      position:      'fixed',
      inset:         0,
      zIndex:        30,
      pointerEvents: 'none',
      // Deep space gradient — matches the black hole interior colour
      background:    'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(6,14,38,1) 0%, rgba(0,0,0,1) 72%)',
    };

    if (portalPhase === 'enter') {
      // Starts fully opaque — seamless with black-hole exit frame
      return { ...base, opacity: 1, transition: 'none' };
    }
    if (portalPhase === 'hold') {
      // Expand a subtle radial "portal iris" while holding opacity
      return {
        ...base,
        opacity: 1,
        // Clip-path circle expanding from singularity to full-screen
        clipPath: 'circle(120% at 50% 50%)',
        transition: 'clip-path 0.64s cubic-bezier(.22,1,.36,1)',
      };
    }
    // 'leave' — fade out + very slight zoom-out revealing the asteroid field
    return {
      ...base,
      opacity: 0,
      transform: 'scale(1.04)',
      transition: 'opacity 1.08s cubic-bezier(.4,0,.2,1), transform 1.08s cubic-bezier(.4,0,.2,1)',
    };
  })();

  return (
    <main>
      {/*
        HeroScene: position fixed, always mounted.
        Handles its own opacity fade via diveOpacity.
      */}
      <div style={{
        position:      'fixed',
        inset:         0,
        zIndex:        heroExited ? 0 : 10,
        pointerEvents: heroExited ? 'none' : 'auto',
      }}>
        <HeroScene />
      </div>

      {/*
        PostHero: always rendered behind hero.
        When heroExited, rises to primary layer.
      */}
      <div
        id="post-hero"
        style={{
          position:      'relative',
          zIndex:        heroExited ? 20 : 5,
          background:    '#000',
          pointerEvents: heroExited ? 'auto' : 'none',
        }}
      >
        <PostHeroSection />
      </div>

      {/*
        Cinematic portal overlay — only mounts for ~1.9 s on first hero exit.
        Creates the "emerging from singularity into asteroid field" moment:
          1. Brief black hold  (continuity with black-hole dive)
          2. Radial clip-path expands outward  (portal iris opening)
          3. Fade-out + slight zoom  (you've arrived in open space)
      */}
      <div style={portalStyle} aria-hidden="true" />

      <style>{`
        @keyframes portalIrisIn {
          from { clip-path: circle(0% at 50% 50%); }
          to   { clip-path: circle(120% at 50% 50%); }
        }
      `}</style>
    </main>
  );
}