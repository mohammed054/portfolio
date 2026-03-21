'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';

export default function CameraController({
  scrollProgress
}: {
  scrollProgress: MutableRefObject<number>;
}) {
  const { camera } = useThree();

  const pos = useRef(new THREE.Vector3(0, 1.2, 22));
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3(0, 0, 0));

  const velocity = useRef(0);

  useFrame(() => {
    const t = scrollProgress.current;

    // 🎯 NON-LINEAR acceleration (this is EVERYTHING)
    const accel = Math.pow(t, 2.2);

    // 🎥 camera path
    target.current.set(
      Math.sin(t * 2.5) * 0.6,                 // subtle orbit
      1.2 - accel * 1.4,                       // falling feeling
      22 - accel * 26                          // aggressive pull
    );

    // ⚡ velocity (for impact feeling)
    velocity.current += (accel * 2 - velocity.current) * 0.08;

    // smooth movement
    pos.current.lerp(target.current, 0.08);

    // 🎯 look shifts slightly for realism
    look.current.set(
      Math.sin(t * 1.5) * 0.2,
      0,
      0
    );

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}