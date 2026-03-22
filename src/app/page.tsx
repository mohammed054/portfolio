import dynamic from 'next/dynamic';
import AboutSection    from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import ContactSection  from '@/components/sections/ContactSection';

const HeroScene = dynamic(() => import('@/components/hero/HeroScene'), {
  ssr: false,
  loading: () => (
    <div style={{ width:'100vw', height:'100vh', background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:4, height:4, borderRadius:'50%', background:'#00C8FF',
        boxShadow:'0 0 80px 40px rgba(0,180,255,0.35)' }}/>
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      {/* Fixed 3D canvas — always visible behind everything */}
      <HeroScene />

      {/*
        Portfolio content.
        marginTop:100vh pushes it below the fold so it appears
        after the hero dive. The fixed canvas is visible behind
        all glass sections.
      */}
      <div id="post-hero" style={{ marginTop: '100vh', position: 'relative', zIndex: 20 }}>
        <div className="void-bridge">
          <div className="vb-text">You made it through.</div>
          <div className="vb-sub">This is what remains.</div>
        </div>
        <AboutSection />
        <ProjectsSection />
        <TimelineSection />
        <ContactSection />
      </div>
    </main>
  );
}
