'use client';
/**
 * CameraController
 *
 * Scroll range: 0 → 1.5
 *  • 0 → 1.0 : approach along CatmullRom spline (existing)
 *  • 1.0 → 1.5: dive — camera rushes forward through the singularity
 *
 * The dive portion is pure linear Z movement so it feels like
 * flying through a tunnel at increasing speed.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function CameraController({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const { camera } = useThree();

  // Approach path: orbit + descend toward disk
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.0,  7.5, 30.0),
    new THREE.Vector3( 2.4,  5.8, 24.0),
    new THREE.Vector3(-1.8,  4.0, 17.5),
    new THREE.Vector3( 1.2,  2.4, 12.0),
    new THREE.Vector3(-0.5,  1.2,  8.0),
    new THREE.Vector3( 0.3,  0.5,  5.5),
    new THREE.Vector3( 0.0,  0.2,  4.0),  // stop here at t=1 — safe outside rings
  ], false, 'catmullrom', 0.5), []);

  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.0, -0.6,  0.0),
    new THREE.Vector3( 0.1, -0.5, -1.0),
    new THREE.Vector3(-0.1, -0.3, -1.5),
    new THREE.Vector3( 0.0, -0.1, -2.0),
    new THREE.Vector3( 0.0,  0.0, -2.5),
    new THREE.Vector3( 0.0,  0.0, -3.0),
    new THREE.Vector3( 0.0,  0.0, -3.5),
  ], false, 'catmullrom', 0.5), []);

  const posS  = useRef(new THREE.Vector3(0, 7.5, 30));
  const lookS = useRef(new THREE.Vector3(0, -0.6, 0));
  const posT  = useRef(new THREE.Vector3());
  const lookT = useRef(new THREE.Vector3());

  useFrame(() => {
    const raw = scrollRef.current; // 0 → 1.5

    if (raw <= 1.0) {
      // ── APPROACH (0→1): spline traversal ──────────────────────────────
      const s = THREE.MathUtils.smootherstep(raw, 0, 1);
      const t = THREE.MathUtils.clamp(s * s * (3 - 2 * s), 0, 1);

      posCurve.getPointAt(t,  posT.current);
      lookCurve.getPointAt(t, lookT.current);

      // Focus on MH position as we near horizon
      const mhF = THREE.MathUtils.smootherstep(raw, 0.72, 0.92);
      if (mhF > 0) {
        lookT.current.lerp(new THREE.Vector3(0, 0.2, -4.0), mhF);
      }

    } else {
      // ── DIVE (1→1.5): rush straight through singularity ───────────────
      const dp = THREE.MathUtils.clamp((raw - 1.0) / 0.5, 0, 1); // 0→1
      const eased = dp * dp; // accelerate

      // Camera rushes from z=4 → z=-20 (through the black hole)
      const z = THREE.MathUtils.lerp(4.0, -20.0, eased);
      // Slight upward drift — feels like being sucked in
      const y = THREE.MathUtils.lerp(0.2, -0.5, eased);

      posT.current.set(0, y, z);
      // Always look ahead toward singularity
      lookT.current.set(0, y - 0.1, z - 8);
    }

    // Smooth follow — tighter lerp during dive for snappier feel
    const lerpSpeed = raw > 1.0 ? 0.08 : 0.052;
    posS.current.lerp(posT.current,   lerpSpeed);
    lookS.current.lerp(lookT.current, lerpSpeed);

    camera.position.copy(posS.current);
    camera.lookAt(lookS.current);

    // Gravity roll: subtle tilt during approach, zero during dive
    const dive = THREE.MathUtils.smootherstep(THREE.MathUtils.clamp(raw, 0, 1), 0.68, 1.0);
    camera.rotation.z = dive * 0.018;
  });

  return null;
}
