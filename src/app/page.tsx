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

  const [flashOpacity,    setFlashOpacity]    = useState(0);
  const [flashTransition, setFlashTransition] = useState(false);

  /* Restore scroll to top on first mount + lock overflow for hero phase */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow            = 'hidden';
  }, []);

  /* When hero exits: unlock scroll + flash-bridge + reveal post-hero */
  useEffect(() => {
    if (heroExited) {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow            = 'auto';
      window.scrollTo({ top: 0, behavior: 'instant' });

      setFlashTransition(false);
      setFlashOpacity(0.85);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlashTransition(true);
          setFlashOpacity(0);
        });
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
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow            = 'hidden';
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

  return (
    <main>
      {/*
        ─── KEY FIX ────────────────────────────────────────────────────
        HeroScene is position:fixed so it takes ZERO space in the
        document flow. This means:
          • PostHeroSection owns the document from y = 0
          • Total page height = TOTAL_VH * vh (no extra 100vh gap)
          • PostHeroSection's scroll lock lands exactly at the bottom
          • No dead air gap below the section
        ────────────────────────────────────────────────────────────────
      */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        heroExited ? 0 : 10,   // behind post-hero after exit
          pointerEvents: heroExited ? 'none' : 'auto',
        }}
      >
        <HeroScene />
      </div>

      {/*
        post-hero starts at y = 0 now (no hero block above it in flow).
        zIndex:20 keeps it above the fixed hero layer.
      */}
      <div
        id="post-hero"
        style={{
          position:      'relative',
          zIndex:        heroExited ? 20 : 5,
          background:    '#000',
          opacity:       heroExited ? 1 : 0,
          pointerEvents: heroExited ? 'auto' : 'none',
          transition:    heroExited ? 'opacity 0.35s ease 0.05s' : 'none',
        }}
      >
        <PostHeroSection />
      </div>

      {/* Flash bridge */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        30,
          background:    '#fff',
          opacity:       flashOpacity,
          transition:    flashTransition ? 'opacity 0.75s ease' : 'none',
          pointerEvents: 'none',
        }}
      />
    </main>
  );
}