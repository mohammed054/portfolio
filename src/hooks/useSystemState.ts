'use client';

import { SystemState, SystemStatus } from '@/types/system';
import { useSystemStore } from '@/store/systemStore';

// ─────────────────────────────────────────────────────────────────────────────
// useSystemStateValue
// Returns the current SystemState enum value.
// ─────────────────────────────────────────────────────────────────────────────

export const useSystemStateValue = (): SystemState => {
  return useSystemStore((s) => s.status.state);
};

// ─────────────────────────────────────────────────────────────────────────────
// useSystemStatus
// Returns the full SystemStatus object (state, progress, local, previous).
// ─────────────────────────────────────────────────────────────────────────────

export const useSystemStatusValue = (): SystemStatus => {
  return useSystemStore((s) => s.status);
};

// ─────────────────────────────────────────────────────────────────────────────
// useIsState
// Returns true if the system is currently in the specified state.
// ─────────────────────────────────────────────────────────────────────────────

export const useIsState = (state: SystemState): boolean => {
  return useSystemStore((s) => s.status.state === state);
};

// ─────────────────────────────────────────────────────────────────────────────
// useLocalProgress
// Returns the progress [0,1] within the current state.
// ─────────────────────────────────────────────────────────────────────────────

export const useLocalProgressValue = (): number => {
  return useSystemStore((s) => s.status.local);
};
