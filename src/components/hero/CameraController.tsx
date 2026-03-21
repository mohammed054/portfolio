'use client';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// MH initials live at z = -11. Camera must end up aimed squarely at them.
const PTS = [
  new THREE.Vector3( 0,   1.2,  22.0),  // 0.00  far establishing
  new THREE.Vector3( 0,   0.7,  14.0),  // 0.10
  new THREE.Vector3( 0,   0.3,   8.5),  // 0.24
  new THREE.Vector3( 0,   0.05,  4.2),  // 0.38  close approach
  new THREE.Vector3( 0.3, 0.15,  2.6),  // 0.48  banking
  new THREE.Vector3( 0.7, 0.55,  1.85), // 0.56  skirting horizon
  new THREE.Vector3( 0.9, 1.3,   0.8),  // 0.63  arcing above-right
  new THREE.Vector3( 0.2, 2.1,  -0.6),  // 0.70  cresting
  new THREE.Vector3(-0.3, 2.0,  -2.5),  // 0.78  inside, banking left
  new THREE.Vector3( 0,   1.2,  -4.5),  // 0.86  straightening
  new THREE.Vector3( 0,   0.5,  -6.2),  // 0.93  approaching MH
  new THREE.Vector3( 0,   0.3,  -7.5),  // 1.00  settled — MH is at z=-11, 3.5 units ahead
];

const SPLINE = new THREE.CatmullRomCurve3(PTS, false, 'catmullrom', 0.5);

// The exact world position of MH initials (must match MHInitials.tsx)
const MH_POS = new THREE.Vector3(0, 0.2, -11.0);

interface Props {
  scrollProgress: React.MutableRefObject<number>;
}

export default function CameraController({ scrollProgress }: Props) {
  const { camera } = useThree();
  const smooth      = useRef(0);
  const lookTarget  = useRef(new THREE.Vector3(0, 0, 0));
  const lookGoal    = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    camera.position.copy(PTS[0]);
    (camera as THREE.PerspectiveCamera).fov = 60;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    smooth.current += (scrollProgress.current - smooth.current) * 0.055;
    const t = Math.max(0, Math.min(1, smooth.current));

    const target = SPLINE.getPoint(t);
    camera.position.lerp(target, 0.09);

    // ── Look-at target ───────────────────────────────────────────────
    // 0.00–0.55: look at BH origin
    // 0.55–0.72: arc over BH, sweep look ahead
    // 0.72–1.00: look directly at MH — lock on
    if (t < 0.55) {
      lookGoal.current.set(0, 0, 0);
    } else if (t < 0.72) {
      const f = (t - 0.55) / 0.17;
      lookGoal.current.set(0, f * 0.5, -f * 5.0);
    } else {
      // Aim straight at MH world position
      lookGoal.current.copy(MH_POS);
    }

    // Use slower lerp inside so camera doesn't shake
    const lerpSpeed = t > 0.72 ? 0.055 : 0.045;
    lookTarget.current.lerp(lookGoal.current, lerpSpeed);
    camera.lookAt(lookTarget.current);

    // ── Dynamic FOV ─────────────────────────────────────────────────
    const p = camera as THREE.PerspectiveCamera;
    let fovTarget: number;
    if      (t < 0.30) fovTarget = 60;
    else if (t < 0.58) fovTarget = 60 + (t - 0.30) / 0.28 * 22; // → 82
    else if (t < 0.70) fovTarget = 82 + (t - 0.58) / 0.12 * 12; // → 94 peak
    else if (t < 0.82) fovTarget = 94 - (t - 0.70) / 0.12 * 22; // → 72
    else               fovTarget = 72 - (t - 0.82) / 0.18 * 10; // → 62 settle
    p.fov += (fovTarget - p.fov) * 0.065;
    p.updateProjectionMatrix();
  });

  return null;
}