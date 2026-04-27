import { useEffect, type ReactNode } from 'react';
import {
  destroyLenis,
  initLenis,
  pauseLenis,
  resumeLenis,
} from '../../hooks/useLenis';

interface SmoothScrollProps {
  children: ReactNode;
  paused?: boolean;
}

export function SmoothScroll({
  children,
  paused = false,
}: SmoothScrollProps) {
  useEffect(() => {
    initLenis();

    return () => {
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    if (paused) {
      pauseLenis();
    } else {
      resumeLenis();
    }
  }, [paused]);

  return <>{children}</>;
}
