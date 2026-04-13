import { SystemState, SystemStatus, StateRange } from '@/types/system';

// ─────────────────────────────────────────────────────────────────────────────
// STATE RANGES
// Maps global progress [0,1] to the 7 system states.
// ─────────────────────────────────────────────────────────────────────────────

export const STATE_RANGES: StateRange[] = [
  { state: SystemState.Idle,        start: 0.00, end: 0.05 },
  { state: SystemState.Activating,  start: 0.05, end: 0.15 },
  { state: SystemState.Identifying, start: 0.15, end: 0.30 },
  { state: SystemState.Routing,     start: 0.30, end: 0.50 },
  { state: SystemState.Executing,   start: 0.50, end: 0.75 },
  { state: SystemState.Processing,  start: 0.75, end: 0.90 },
  { state: SystemState.Resolved,    start: 0.90, end: 1.00 },
];

// UI display strings for each state
export const STATE_LABELS: Record<SystemState, string> = {
  [SystemState.Idle]:        '> STANDBY',
  [SystemState.Activating]:  '> INIT',
  [SystemState.Identifying]: '> IDENTIFY',
  [SystemState.Routing]:     '> ROUTING',
  [SystemState.Executing]:   '> EXECUTING',
  [SystemState.Processing]:  '> PROCESSING',
  [SystemState.Resolved]:    '> RESOLVED',
};

// State sequence in order — used for previous/next lookups
export const STATE_SEQUENCE: SystemState[] = [
  SystemState.Idle,
  SystemState.Activating,
  SystemState.Identifying,
  SystemState.Routing,
  SystemState.Executing,
  SystemState.Processing,
  SystemState.Resolved,
];

// ─────────────────────────────────────────────────────────────────────────────
// RESOLVER
// Given global progress [0,1], returns SystemStatus with:
//   state    — the current SystemState enum value
//   progress — raw global progress
//   local    — normalized progress within current state [0,1]
//   previous — the state before this one
// ─────────────────────────────────────────────────────────────────────────────

export const resolveSystemState = (progress: number): SystemStatus => {
  const clamped = Math.max(0, Math.min(1, progress));

  const range =
    STATE_RANGES.find((r) => clamped >= r.start && clamped <= r.end) ??
    STATE_RANGES[STATE_RANGES.length - 1];

  const rangeWidth = range.end - range.start;
  const local =
    rangeWidth > 0 ? Math.max(0, Math.min(1, (clamped - range.start) / rangeWidth)) : 0;

  const stateIndex = STATE_SEQUENCE.indexOf(range.state);
  const previous =
    stateIndex > 0 ? STATE_SEQUENCE[stateIndex - 1] : SystemState.Idle;

  return {
    state: range.state,
    progress: clamped,
    local,
    previous,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true if progress is within a given state's range */
export const isInState = (progress: number, state: SystemState): boolean => {
  const range = STATE_RANGES.find((r) => r.state === state);
  if (!range) return false;
  return progress >= range.start && progress <= range.end;
};

/** Returns local progress [0,1] within a specific state, or 0 if outside */
export const getLocalProgress = (progress: number, state: SystemState): number => {
  const range = STATE_RANGES.find((r) => r.state === state);
  if (!range) return 0;
  if (progress < range.start) return 0;
  if (progress > range.end) return 1;
  const width = range.end - range.start;
  return width > 0 ? (progress - range.start) / width : 0;
};

/** Returns the StateRange for a given state */
export const getStateRange = (state: SystemState): StateRange => {
  return (
    STATE_RANGES.find((r) => r.state === state) ??
    STATE_RANGES[STATE_RANGES.length - 1]
  );
};
