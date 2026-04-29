import { Suspense, lazy, useEffect, useState } from 'react';
import { SmoothScroll } from '@components/shared/SmoothScroll';
import { GrainOverlay } from '@components/shared/GrainOverlay';
import { Navbar } from '@components/Navbar/Navbar';
import { Preloader } from '@components/Preloader/Preloader';
import Hero from '@sections/01-Hero/Hero';
import { FEATURES } from '@utils/constants';

const SelectedWork = lazy(() => import('@sections/02-SelectedWork/SelectedWork'));
const AboutHero = lazy(() => import('@sections/03-AboutHero/AboutHero'));
const AboutCopy = lazy(() => import('@sections/04-AboutCopy/AboutCopy'));
const AboutVintage = lazy(() => import('@sections/05-AboutVintage/AboutVintage'));
const Shredder = lazy(() => import('@sections/06-Shredder/Shredder'));
const ContactTease = lazy(() => import('@sections/07-ContactTease/ContactTease'));
const GoldenTie = lazy(() => import('@sections/08-GoldenTie/GoldenTie'));
const Handshake = lazy(() => import('@sections/09-Handshake/Handshake'));
const GoodBuy = lazy(() => import('@sections/10-GoodBuy/GoodBuy'));
const Footer = lazy(() => import('@sections/11-Footer/Footer'));

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

    let attempts = 0;
    let frame = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(jumpTarget);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }

      attempts += 1;
      if (attempts < 120) {
        frame = window.requestAnimationFrame(scrollToTarget);
      }
    };

    frame = window.requestAnimationFrame(scrollToTarget);

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
            <Suspense fallback={null}>
              {(!soloTarget || soloTarget === 'work') && <SelectedWork />}
              {(!soloTarget || soloTarget === 'about-us') && <AboutHero />}
              {(!soloTarget || soloTarget === 'about-copy') && <AboutCopy />}
              {(!soloTarget || soloTarget === 'about-vintage') && <AboutVintage />}
              {soloTarget === 'shredder' && <Shredder />}
              {soloTarget === 'contact-tease' && <ContactTease />}
              {soloTarget === 'golden-tie' && <GoldenTie />}
              {soloTarget === 'handshake' && <Handshake />}
              {soloTarget === 'good-buy' && <GoodBuy />}
              {(!soloTarget || soloTarget === 'contact' || soloTarget === 'footer') && <Footer />}
            </Suspense>
          </main>
        </>
      )}
    </SmoothScroll>
  );
}
