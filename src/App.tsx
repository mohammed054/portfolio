import { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { SmoothScroll } from './components/shared/SmoothScroll';
import { Navbar } from './components/Navbar/Navbar';
import { GrainOverlay } from './components/shared/GrainOverlay';
import Preloader from './components/Preloader/Preloader';
import Hero from './sections/01-Hero/Hero';
import SelectedWork from './sections/02-SelectedWork/SelectedWork';
import AboutHero from './sections/03-AboutHero/AboutHero';
import AboutCopy from './sections/04-AboutCopy/AboutCopy';
import AboutVintage from './sections/05-AboutVintage/AboutVintage';
import Shredder from './sections/06-Shredder/Shredder';
import ContactTease from './sections/07-ContactTease/ContactTease';
import GoldenTie from './sections/08-GoldenTie/GoldenTie';
import Handshake from './sections/09-Handshake/Handshake';
import GoodBuy from './sections/10-GoodBuy/GoodBuy';
import Footer from './sections/11-Footer/Footer';

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <Router>
      <SmoothScroll paused={!preloaderComplete}>
        <Preloader onComplete={() => setPreloaderComplete(true)} />
        <Navbar />
        <GrainOverlay />
        <main>
          <Hero />
          <SelectedWork />
          <AboutHero />
          <AboutCopy />
          <AboutVintage />
          <Shredder />
          <ContactTease />
          <GoldenTie />
          <Handshake />
          <GoodBuy />
          <Footer />
        </main>
      </SmoothScroll>
    </Router>
  );
}

export default App;