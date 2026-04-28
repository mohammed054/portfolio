import { useEffect, useState } from 'react';
import { SmoothScroll } from '@components/shared/SmoothScroll';
import { GrainOverlay } from '@components/shared/GrainOverlay';
import { Navbar } from '@components/Navbar/Navbar';
import { Preloader } from '@components/Preloader/Preloader';
import Hero from '@sections/01-Hero/Hero';
import SelectedWork from '@sections/02-SelectedWork/SelectedWork';
import AboutHero from '@sections/03-AboutHero/AboutHero';
import AboutCopy from '@sections/04-AboutCopy/AboutCopy';
import AboutVintage from '@sections/05-AboutVintage/AboutVintage';
import Shredder from '@sections/06-Shredder/Shredder';
import ContactTease from '@sections/07-ContactTease/ContactTease';
import GoldenTie from '@sections/08-GoldenTie/GoldenTie';
import { FEATURES } from '@utils/constants';

export default function App() {
  const skipPreloader =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('skip-preloader');
  const jumpTarget =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('jump')
      : null;
  const soloTarget =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('solo')
      : null;
  const [isLoading, setIsLoading] = useState(FEATURES.enablePreloader && !skipPreloader);

  useEffect(() => {
    if (isLoading || !jumpTarget) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(jumpTarget)?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, jumpTarget]);

  return (
    <SmoothScroll paused={isLoading}>
      <Preloader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          {FEATURES.enableGrain && <GrainOverlay />}
          <Navbar />

          <main id="main-content">
            {(!soloTarget || soloTarget === 'home') && <Hero />}
            {(!soloTarget || soloTarget === 'work') && <SelectedWork />}
            {(!soloTarget || soloTarget === 'about-us') && <AboutHero />}
            {(!soloTarget || soloTarget === 'about-copy') && <AboutCopy />}
            {(!soloTarget || soloTarget === 'about-vintage') && <AboutVintage />}
            {(!soloTarget || soloTarget === 'shredder') && <Shredder />}
            {(!soloTarget || soloTarget === 'contact') && <ContactTease />}
            {(!soloTarget || soloTarget === 'golden-tie') && <GoldenTie />}
          </main>
        </>
      )}
    </SmoothScroll>
  );
}
