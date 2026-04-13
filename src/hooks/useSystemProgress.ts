'use client';

import { useSystemStore } from '@/store/systemStore';

// ─────────────────────────────────────────────────────────────────────────────
// useSystemProgress
// Returns the current global progress value [0,1].
// Subscribes to the Zustand store — re-renders on every scroll frame.
// Use sparingly in expensive components — prefer useFrame for Three.js.
// ─────────────────────────────────────────────────────────────────────────────

export const useSystemProgress = (): number => {
  return useSystemStore((s) => s.progress);
};
