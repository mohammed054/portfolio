// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM TYPES
// Core type definitions for the computational system state model.
// ─────────────────────────────────────────────────────────────────────────────

export enum SystemState {
  Idle        = 'IDLE',
  Activating  = 'ACTIVATING',
  Identifying = 'IDENTIFYING',
  Routing     = 'ROUTING',
  Executing   = 'EXECUTING',
  Processing  = 'PROCESSING',
  Resolved    = 'RESOLVED',
}

export interface StateRange {
  state: SystemState;
  start: number; // progress value [0,1]
  end:   number;
}

export interface SystemStatus {
  state:    SystemState;
  progress: number;      // global [0,1]
  local:    number;      // progress within current state [0,1]
  previous: SystemState;
}

export interface CameraKeyframe {
  progress: number;
  position: [number, number, number]; // [x, y, z]
  target:   [number, number, number]; // look-at point
  fov:      number;
}

export type CursorContext = 'default' | 'hover' | 'drag' | 'view';

export interface CursorState {
  x:       number;
  y:       number;
  context: CursorContext;
}
