import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/scene';

export const useScrollProgress = () => {
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);
  const setActiveSection = useSceneStore((s) => s.setActiveSection);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'testimonials', 'contact'];

    const update = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? scrollY / totalHeight : 0;
      setScrollProgress(progress);

      // Determine active section
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
          setActiveSection(id);
          break;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // initial
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setScrollProgress, setActiveSection]);
};
