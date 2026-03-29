'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import PostHeroSection from '@/components/PostHeroSection/PostHeroSection';
import Navigation from '@/components/ui/Navigation';
import { useSceneStore } from '@/store/scene';

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#00C8FF',
          boxShadow: '0 0 80px 40px rgba(0,180,255,0.32)',
        }}
      />
    </div>
  ),
});

export default function Home() {
  const heroExited    = useSceneStore(s => s.heroExited);
  const setHeroExited = useSceneStore(s => s.setHeroExited);

  /* Lock scroll during hero phase */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = 'hidden';
  }, []);

  /* When hero exits: PostHeroSection owns scroll during its intro.
     We only need to ensure the page is ready — PostHeroSection
     unlocks overflow itself after the cinematic intro finishes. */
  useEffect(() => {
    if (heroExited) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Do NOT unlock here — PostHeroSection locks & unlocks its own scroll
    }
  }, [heroExited]);

  /* Wheel-up at page top — go back to hero */
  useEffect(() => {
    if (!heroExited) return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        setHeroExited(false);
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [heroExited, setHeroExited]);

  return (
    <main>
      <Navigation />

      {/*
        HeroScene: position fixed, always mounted.
        Handles its own opacity fade via diveOpacity.
        z-index drops to 0 after exit so PostHero shows above.
      */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        heroExited ? 0 : 10,
          pointerEvents: heroExited ? 'none' : 'auto',
        }}
      >
        <HeroScene />
      </div>

      {/*
        PostHero: always rendered behind hero.
        When heroExited, rises to primary layer.
        The intro animation in PostHeroSection handles the
        "zooming in from far away into the asteroid field"
        cinematic effect — no fade needed.
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
    </main>
  );
}