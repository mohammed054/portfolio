import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useExperience } from '../core/ExperienceProvider'
import {
  STATES,
  CAMERA_MOUSE,
  INTERACTION_STATE,
} from '../config/variables'

// ─────────────────────────────────────────────────────────────────────────────
// Camera Path Keyframes
//
// The camera travels primarily along Z (100 → ~8), with controlled X/Y offsets
// for structural framing. Each keyframe specifies:
//
//   p          → progress value (0–1)
//   x, y, z    → camera world position
//   lx, ly, lz → lookAt target world position
//   fov        → field of view in degrees
//   dPos       → position lerp alpha  (higher = faster follow, less inertia)
//   dRot       → rotation slerp alpha (higher = faster rotation follow)
//
// Z distance budget per state (camera advances faster in IDENTIFYING):
//   IDLE        0.00–0.05 :  100→96   (4 units / 5%  = slow)
//   ACTIVATING  0.05–0.15 :   96→86  (10 units / 10% = moderate)
//   IDENTIFYING 0.15–0.30 :   86→68  (18 units / 15% = aggressive)
//   ROUTING     0.30–0.50 :   68→46  (22 units / 20% = moderate)
//   EXECUTING   0.50–0.75 :   46→18  (28 units / 25% = continuous)
//   PROCESSING  0.75–0.90 :   18→9   ( 9 units / 15% = slow/stable)
//   RESOLVED    0.90–1.00 :    9→12  (pullback +3 units — system returns control)
//
// Text (IdentifyingState) sits at Z = 77.
// Camera crosses Z=77 at progress ≈ 0.225, which is normalized t ≈ 0.50
// within IDENTIFYING (0.15–0.30). SCAN_PEAK_T in IdentifyingState = 0.50.
// ─────────────────────────────────────────────────────────────────────────────

const KEYFRAMES = [
  // ── IDLE ─────────────────────────────────────────────────────────────────
  // Camera barely moves. Maximum damping. No mouse influence (INTERACTION = 0).
  { p: 0.00, x:  0,    y:  0.5, z: 100, lx:  0,    ly: 0.5, lz:  95, fov: 45, dPos: 0.040, dRot: 0.030 },
  { p: 0.05, x:  0,    y:  0.5, z:  96, lx:  0,    ly: 0.5, lz:  91, fov: 45, dPos: 0.050, dRot: 0.040 },

  // ── ACTIVATING ───────────────────────────────────────────────────────────
  // Panels are emerging. Camera advances slowly. Damping still high.
  { p: 0.15, x:  0,    y:  0,   z:  86, lx:  0,    ly: 0,   lz:  81, fov: 45, dPos: 0.070, dRot: 0.055 },

  // ── IDENTIFYING ──────────────────────────────────────────────────────────
  // Aggressive forward push. Camera passes through typography at Z≈77.
  // Slight upward look bias when approaching text (p=0.21), normalises after pass-through.
  // Damping is reduced (higher alpha) so camera follows target aggressively.
  { p: 0.21, x:  0,    y:  0.6, z:  77, lx:  0,    ly: 1.8, lz:  72, fov: 40, dPos: 0.130, dRot: 0.100 },
  { p: 0.30, x:  0,    y:  0,   z:  68, lx:  0,    ly: 0,   lz:  63, fov: 42, dPos: 0.090, dRot: 0.075 },

  // ── ROUTING ──────────────────────────────────────────────────────────────
  // Camera performs a controlled lateral sweep to expose node topology.
  // Slight rightward drift first, then cross to left, then re-centres.
  { p: 0.38, x:  3.5,  y:  0,   z:  56, lx: -3.5,  ly: 0,   lz:  51, fov: 48, dPos: 0.080, dRot: 0.065 },
  { p: 0.45, x: -3.0,  y:  0,   z:  50, lx:  3.0,  ly: 0,   lz:  45, fov: 46, dPos: 0.080, dRot: 0.065 },
  { p: 0.50, x:  0,    y:  0,   z:  46, lx:  0,    ly: 0,   lz:  41, fov: 45, dPos: 0.080, dRot: 0.065 },

  // ── EXECUTING ────────────────────────────────────────────────────────────
  // Guided traversal through execution environments. Brief rightward bias mid-way
  // simulates camera inspecting a specific execution system before re-centring.
  { p: 0.60, x:  1.5,  y:  0,   z:  36, lx: -1.5,  ly: 0,   lz:  31, fov: 45, dPos: 0.085, dRot: 0.070 },
  { p: 0.68, x:  0,    y:  0.5, z:  28, lx:  0,    ly: 0,   lz:  23, fov: 44, dPos: 0.085, dRot: 0.070 },
  { p: 0.75, x:  0,    y:  0,   z:  18, lx:  0,    ly: 0,   lz:  13, fov: 45, dPos: 0.080, dRot: 0.065 },

  // ── PROCESSING ───────────────────────────────────────────────────────────
  // Deepest layer. Camera nearly stops. Maximum damping returns. FOV expands.
  // Mouse influence is zero — no disturbance during peak precision moment.
  { p: 0.85, x:  0,    y:  0,   z:  12, lx:  0,    ly: 0,   lz:   7, fov: 50, dPos: 0.038, dRot: 0.030 },
  { p: 0.90, x:  0,    y:  0,   z:   9, lx:  0,    ly: 0,   lz:   4, fov: 52, dPos: 0.035, dRot: 0.028 },

  // ── RESOLVED ─────────────────────────────────────────────────────────────
  // System returns to stable state. Camera pulls back slightly — rare reverse Z motion.
  // Widest FOV. Relaxed damping. Mouse influence at maximum (system hands back presence).
  { p: 0.95, x:  0,    y:  1.0, z:  12, lx:  0,    ly: 0.5, lz:   7, fov: 55, dPos: 0.060, dRot: 0.050 },
  { p: 1.00, x:  0,    y:  0.5, z:  10, lx:  0,    ly: 0,   lz:   5, fov: 55, dPos: 0.070, dRot: 0.058 },
]

// ─────────────────────────────────────────────────────────────────────────────
// resolveState
// Returns the STATES key for the given progress value.
// ─────────────────────────────────────────────────────────────────────────────

function resolveState(progress) {
  const entries = Object.entries(STATES)
  for (let i = 0; i < entries.length; i++) {
    const [name, range] = entries[i]
    if (progress >= range.start && progress <= range.end) return name
  }
  return 'IDLE'
}

// ─────────────────────────────────────────────────────────────────────────────
// interpolateKeyframes
// Finds the two surrounding keyframes for `progress` and linearly interpolates
// all camera parameters between them.
// Linear interpolation is intentional — smoothness is produced by the per-frame
// damping (lerp/slerp), not by the interpolation curve itself.
// ─────────────────────────────────────────────────────────────────────────────

function interpolateKeyframes(progress) {
  const p = Math.max(0, Math.min(1, progress))

  let lo = KEYFRAMES[0]
  let hi = KEYFRAMES[KEYFRAMES.length - 1]

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].p && p < KEYFRAMES[i + 1].p) {
      lo = KEYFRAMES[i]
      hi = KEYFRAMES[i + 1]
      break
    }
  }

  const span = hi.p - lo.p
  const t    = span < 0.0001 ? 0 : (p - lo.p) / span

  const L = (a, b) => a + (b - a) * t

  return {
    x:    L(lo.x,    hi.x),
    y:    L(lo.y,    hi.y),
    z:    L(lo.z,    hi.z),
    lx:   L(lo.lx,   hi.lx),
    ly:   L(lo.ly,   hi.ly),
    lz:   L(lo.lz,   hi.lz),
    fov:  L(lo.fov,  hi.fov),
    dPos: L(lo.dPos, hi.dPos),
    dRot: L(lo.dRot, hi.dRot),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistent working objects — allocated once to avoid GC pressure in useFrame
// ─────────────────────────────────────────────────────────────────────────────

const _targetPos    = new THREE.Vector3()
const _targetLookAt = new THREE.Vector3()
const _smoothPos    = new THREE.Vector3(0, 0.5, 100)   // matches first keyframe
const _smoothLookAt = new THREE.Vector3(0, 0.5,  95)   // matches first lookAt
const _smoothMouse  = new THREE.Vector2(0, 0)
const _up           = new THREE.Vector3(0, 1, 0)
const _lookMatrix   = new THREE.Matrix4()
const _targetQuat   = new THREE.Quaternion()

// ─────────────────────────────────────────────────────────────────────────────
// CameraRig
//
// The only component in the system that writes to the camera.
// State layers and all other systems are READ-ONLY relative to camera state.
//
// Per-frame pipeline:
//   1. Interpolate keyframes → compute target position, lookAt, fov, damping
//   2. Apply smoothed mouse offset (additive, scaled by INTERACTION_STATE)
//   3. Lerp smooth position → target position  (dPos alpha)
//   4. Lerp smooth lookAt  → target lookAt     (dRot alpha)
//   5. Compute look matrix from smoothed pos→lookAt → slerp camera quaternion
//   6. Lerp camera FOV with a fixed slow alpha (prevents jarring FOV snaps)
// ─────────────────────────────────────────────────────────────────────────────

export function CameraRig() {
  const { camera } = useThree()
  const { progress, mouse } = useExperience()

  // Refs ensure useFrame always sees latest values without needing re-renders
  const progressRef = useRef(progress)
  const mouseRef    = useRef(mouse)
  progressRef.current = progress
  mouseRef.current    = mouse

  useFrame(() => {
    const p = progressRef.current
    const m = mouseRef.current

    // ── 1. Target from keyframes ──────────────────────────────────────────
    const kf = interpolateKeyframes(p)

    _targetPos.set(kf.x, kf.y, kf.z)
    _targetLookAt.set(kf.lx, kf.ly, kf.lz)

    // ── 2. Mouse micro-disturbance ────────────────────────────────────────
    // Mouse is smoothed independently (CAMERA_MOUSE.damping = 0.05).
    // Its influence on camera position is scaled by the current state's
    // interaction multiplier — zero in IDLE/PROCESSING, max in RESOLVED.
    _smoothMouse.x += (m.x - _smoothMouse.x) * CAMERA_MOUSE.damping
    _smoothMouse.y += (m.y - _smoothMouse.y) * CAMERA_MOUSE.damping

    const stateName     = resolveState(p)
    const mouseStrength = INTERACTION_STATE[stateName] ?? 0

    // Mouse offsets are additive on the target position only — they never
    // override the camera path, they perturb it.
    _targetPos.x += _smoothMouse.x * CAMERA_MOUSE.strengthX * mouseStrength
    _targetPos.y += _smoothMouse.y * CAMERA_MOUSE.strengthY * mouseStrength

    // ── 3. Smooth position toward target ─────────────────────────────────
    // dPos varies per state (low in IDLE/PROCESSING, high in IDENTIFYING).
    // This is the primary "feel" control — higher dPos = more aggressive.
    _smoothPos.lerp(_targetPos, kf.dPos)
    _smoothLookAt.lerp(_targetLookAt, kf.dRot)

    // ── 4. Apply position ─────────────────────────────────────────────────
    camera.position.copy(_smoothPos)

    // ── 5. Smooth rotation via quaternion slerp ───────────────────────────
    // Avoids gimbal lock and produces cleaner interpolation than Euler angles.
    // We build a look matrix from the SMOOTHED position toward the SMOOTHED
    // lookAt, so both positional lag and rotational lag compound correctly.
    _lookMatrix.lookAt(_smoothPos, _smoothLookAt, _up)
    _targetQuat.setFromRotationMatrix(_lookMatrix)

    // Rotation follows slightly faster than position (× 1.25) so the camera
    // "orients" into a new direction before fully arriving — mechanical feel.
    camera.quaternion.slerp(_targetQuat, kf.dRot * 1.25)

    // ── 6. FOV — always lerped at a fixed slow rate ───────────────────────
    // FOV target comes from keyframes. Using a fixed alpha (0.035) decoupled
    // from dPos ensures FOV transitions are always gradual regardless of
    // positional damping state.
    const fovDelta = kf.fov - camera.fov
    if (Math.abs(fovDelta) > 0.005) {
      camera.fov += fovDelta * 0.035
      camera.updateProjectionMatrix()
    }
  })

  // CameraRig renders nothing — it only drives the camera
  return null
}
