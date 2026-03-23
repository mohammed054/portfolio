'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
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

  /* Restore scroll to top on first mount */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  /* When hero exits: unlock the page scroll and jump to top of post-hero */
  useEffect(() => {
    if (heroExited) {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow            = 'auto';
      // Start post-hero at its very top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [heroExited]);

  /* Wheel-up at page top → go back to hero */
  useEffect(() => {
    if (!heroExited) return;

    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        setHeroExited(false);
        // Re-lock scroll for the hero's internal scroll mechanism
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow            = 'hidden';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [heroExited, setHeroExited]);

  /* Track scroll for the "snap back to top" feel */
  useEffect(() => {
    const onScroll = () => { lastScrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main>
      {/* Hero always rendered in the DOM; hidden under post-hero via z-index */}
      <HeroScene />

      {/*
        Post-hero sits above the hero after exit.
        During hero: z-index 5 (below hero z:10), opacity 0, no pointer events.
        After hero:  z-index 20, opacity 1, pointer events on.
      */}
      <div
        id="post-hero"
        style={{
          position:      'relative',
          zIndex:        heroExited ? 20 : 5,
          background:    '#000',
          opacity:       heroExited ? 1 : 0,
          pointerEvents: heroExited ? 'auto' : 'none',
          // Only transition opacity in; instant out so wheel-back is snappy.
          transition:    heroExited ? 'opacity 0.65s ease 0.05s' : 'none',
        }}
      >
        <PostHeroSection />
      </div>
    </main>
  );
}