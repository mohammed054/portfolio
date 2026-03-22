import dynamic from 'next/dynamic';
import AboutSection    from '@/components/sections/AboutSection';
import TimelineSection from '@/components/sections/TimelineSection';

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
  return (
    <main>
      <HeroScene />
      <div
        id="post-hero"
        style={{ marginTop: '100vh', position: 'relative', zIndex: 20, background: '#000' }}
      >
        <div className="void-bridge">
          <p className="vb-text">You made it through.</p>
          <p className="vb-sub">This is what remains.</p>
        </div>
        <AboutSection />
        <TimelineSection />
      </div>
    </main>
  );
}
