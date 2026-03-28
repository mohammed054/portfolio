'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import PostHeroSection from '@/components/PostHeroSection/PostHeroSection';
import Navigation from '@/components/ui/Navigation';
import Loader from '@/components/ui/Loader';
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
      {/* Premium loader — shown on first load */}
      {/* <Loader /> */}

      {/* Navigation — floats above everything once hero exits */}
      <Navigation />

      {/*
        HeroScene: position fixed, always mounted.
        Handles its own opacity fade via diveOpacity.
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