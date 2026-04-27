import { useState } from 'react';
import { SmoothScroll } from '@components/shared/SmoothScroll';
import { GrainOverlay } from '@components/shared/GrainOverlay';
import { Navbar } from '@components/Navbar/Navbar';
import { Preloader } from '@components/Preloader/Preloader';
import Hero from '@sections/01-Hero/Hero';
import SelectedWork from '@sections/02-SelectedWork/SelectedWork';
import AboutHero from '@sections/03-AboutHero/AboutHero';
import AboutCopy from '@sections/04-AboutCopy/AboutCopy';
import AboutVintage from '@sections/05-AboutVintage/AboutVintage';
import { FEATURES } from '@utils/constants';

export default function App() {
  const [isLoading, setIsLoading] = useState(FEATURES.enablePreloader);

  return (
    <SmoothScroll paused={isLoading}>
      <Preloader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          {FEATURES.enableGrain && <GrainOverlay />}
          <Navbar />

          <main id="main-content">
            <Hero />
            <SelectedWork />
            <AboutHero />
            <AboutCopy />
            <AboutVintage />
          </main>
        </>
      )}
    </SmoothScroll>
  );
}
