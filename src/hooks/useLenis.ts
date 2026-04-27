import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let ticker: ((time: number) => void) | null = null;
let resizeHandler: (() => void) | null = null;
let refreshHandler: (() => void) | null = null;

export function initLenis(): Lenis {
  if (lenis) {
    return lenis;
  }

  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  ticker = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.defaults({
    scroller: document.body,
    invalidateOnRefresh: true,
  });

  refreshHandler = () => lenis?.scrollTo(lenis.scroll, { immediate: true });
  ScrollTrigger.addEventListener('refresh', refreshHandler);

  resizeHandler = () => ScrollTrigger.refresh();
  window.addEventListener('resize', resizeHandler);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function pauseLenis(): void {
  lenis?.stop();
}

export function resumeLenis(): void {
  lenis?.start();
}

export function destroyLenis(): void {
  if (ticker) {
    gsap.ticker.remove(ticker);
    ticker = null;
  }

  if (refreshHandler) {
    ScrollTrigger.removeEventListener('refresh', refreshHandler);
    refreshHandler = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  lenis?.destroy();
  lenis = null;
}
