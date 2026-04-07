'use client';

import { useEffect } from 'react';
import { useSystemStore } from '@/store/systemStore';

export const SystemStateObserver = () => {
  const state = useSystemStore((store) => store.status.state);
  const setReducedMotion = useSystemStore((store) => store.setReducedMotion);

  useEffect(() => {
    document.documentElement.setAttribute('data-system-state', state);
  }, [state]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = (matches: boolean) => {
      setReducedMotion(matches);
    };

    sync(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      sync(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [setReducedMotion]);

  return null;
};
