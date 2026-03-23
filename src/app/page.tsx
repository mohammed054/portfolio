'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import AboutSection    from '@/components/sections/AboutSection';
import TimelineSection from '@/components/sections/TimelineSection';
import { useSceneStore } from '@/store/scene';

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width:'100vw', height:'100vh', background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        width:4, height:4, borderRadius:'50%', background:'#00C8FF',
        boxShadow:'0 0 80px 40px rgba(0,180,255,0.35)',
      }} />
    </div>
  ),
});

export default function Home() {
  const heroExited = useSceneStore(s => s.heroExited);

  // Always land at the top — no saved scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Also prevent browser from restoring scroll on refresh
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  return (
    <main>
      <HeroScene />

      {/* Post-hero content: hidden until hero exit animation completes */}
      <div
        id="post-hero"
        style={{
          position:'relative', zIndex:20, background:'#000',
          // Invisible (but in DOM) until hero exits — prevents flashing on load
          opacity: heroExited ? 1 : 0,
          pointerEvents: heroExited ? 'auto' : 'none',
          transition: heroExited ? 'opacity 0.6s ease 0.1s' : 'none',
        }}
      >
        <AboutSection />
        <TimelineSection />
      </div>
    </main>
  );
}