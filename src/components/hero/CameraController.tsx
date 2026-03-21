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

  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 1.2, 22));

  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const t = scrollProgress.current;

    // ─── Camera path (designed, not linear) ───
    targetPos.current.set(
      0,
      1.2 - t * 0.5,
      22 - t * 18
    );

    // ─── Smooth interpolation (this is the KEY) ───
    currentPos.current.lerp(targetPos.current, 0.06);
    currentLookAt.current.lerp(lookAtTarget.current, 0.06);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}