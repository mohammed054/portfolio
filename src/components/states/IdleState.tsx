'use client';

import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

// ─────────────────────────────────────────────────────────────────────────────
// IDLE STATE — progress 0.00–0.05
// Camera: far back (z=45), looking at substrate.
// Visible: substrate grid only, very dim.
// Near total darkness — only grid lines hint at structure.
// Full implementation: Phase 6.
// ─────────────────────────────────────────────────────────────────────────────

export const IdleState = () => {
  const status = useSystemStore((s) => s.status);

  // Only active during Idle state
  if (status.state !== SystemState.Idle) return null;

  // Idle is purely the substrate — no additional geometry here.
  // The substrate + near darkness handles the visual.
  return null;
};
