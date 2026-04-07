import { CameraKeyframe } from '@/types/system';

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA PATH
// Predefined keyframes that drive the camera through the system.
// The camera moves along a Z-axis path with subtle X/Y drift.
// Mouse adds a maximum ±2 unit offset — never overrides the path.
// ─────────────────────────────────────────────────────────────────────────────

export const CAMERA_PATH: CameraKeyframe[] = [
  // State: Idle — camera far back, looking at distant substrate
  { progress: 0.00, position: [0,  2,  45], target: [0, 0,  0], fov: 60 },
  { progress: 0.05, position: [0,  2,  45], target: [0, 0,  0], fov: 60 },

  // State: Activating — camera begins descending toward system
  { progress: 0.10, position: [0,  1,  30], target: [0, 0,  0], fov: 58 },
  { progress: 0.15, position: [0,  0,  20], target: [0, 0,  0], fov: 55 },

  // State: Identifying — camera slows, system declares identity
  { progress: 0.20, position: [-1, 0,  14], target: [0, 0,  0], fov: 52 },
  { progress: 0.30, position: [0,  0,   8], target: [0, 0,  0], fov: 50 },

  // State: Routing — camera at working distance, topology visible
  { progress: 0.40, position: [2, -1,   4], target: [0, -1, 0], fov: 52 },
  { progress: 0.50, position: [0,  0,   0], target: [0,  0,-5], fov: 55 },

  // State: Executing — camera inside the system
  { progress: 0.60, position: [-2, 1,  -4], target: [0,  0,-10], fov: 58 },
  { progress: 0.75, position: [0,  0,  -8], target: [0,  0,-15], fov: 60 },

  // State: Processing — deepest layer
  { progress: 0.82, position: [1, -1, -12], target: [0,  0,-18], fov: 55 },
  { progress: 0.90, position: [0,  0, -10], target: [0,  0, -5], fov: 52 },

  // State: Resolved — camera pulls back to rest, system complete
  { progress: 1.00, position: [0,  2,  -5], target: [0,  0,  0], fov: 50 },
];

// Max mouse influence offset (units)
export const MOUSE_INFLUENCE = { x: 2.0, y: 1.2 };

// ─────────────────────────────────────────────────────────────────────────────
// MATH UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const lerpVec3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Smoothstep easing (same as GLSL smoothstep) */
export const smoothstep = (t: number): number => t * t * (3 - 2 * t);

/** Ease in-out cubic */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA INTERPOLATION
// Given a global progress value [0,1], find the two surrounding keyframes
// and interpolate between them.
// ─────────────────────────────────────────────────────────────────────────────

export const interpolateCameraState = (progress: number): CameraKeyframe => {
  const frames = CAMERA_PATH;
  const clamped = Math.max(0, Math.min(1, progress));

  // Find surrounding keyframes
  let a = frames[0];
  let b = frames[1];

  for (let i = 0; i < frames.length - 1; i++) {
    if (clamped >= frames[i].progress && clamped <= frames[i + 1].progress) {
      a = frames[i];
      b = frames[i + 1];
      break;
    }
  }

  const span = b.progress - a.progress;
  const t = span > 0 ? (clamped - a.progress) / span : 0;
  const smooth = easeInOut(t);

  return {
    progress: clamped,
    position: lerpVec3(a.position, b.position, smooth),
    target:   lerpVec3(a.target,   b.target,   smooth),
    fov:      lerp(a.fov, b.fov, smooth),
  };
};
