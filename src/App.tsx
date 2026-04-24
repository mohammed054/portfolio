import { useState } from 'react';
import { SmoothScroll } from '@components/shared/SmoothScroll';
import { GrainOverlay } from '@components/shared/GrainOverlay';
import { Navbar } from '@components/Navbar/Navbar';
import { Preloader } from '@components/Preloader/Preloader';
import { Hero } from '@sections/Hero/Hero';
import { SelectedWork } from '@sections/SelectedWork/SelectedWork';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll paused={isLoading}>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Preloader onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <>
          <GrainOverlay />
          <Navbar />
          <main id="main-content">
            <Hero />
            <SelectedWork />
            <div style={{ height: '60vh', background: '#f0e8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2c2416' }}>
              About Us ↓ (Phase 4+)
            </div>
          </main>
        </>
      )}
    </SmoothScroll>
  );
}
