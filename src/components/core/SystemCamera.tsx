'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { interpolateCameraState, MOUSE_INFLUENCE } from '@/lib/cameraPath';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

const STATIC_PROGRESS = 0.18;

export const SystemCamera = () => {
  const { camera } = useThree();
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const { progress, cursor, reducedMotion } = useSystemStore.getState();
    const frame = interpolateCameraState(reducedMotion ? STATIC_PROGRESS : progress);
    const damping = 1 - Math.exp(-delta * 6);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    targetPosition.set(...frame.position);
    targetLookAt.set(...frame.target);

    if (!reducedMotion) {
      targetPosition.x += cursor.x * MOUSE_INFLUENCE.x;
      targetPosition.y += cursor.y * MOUSE_INFLUENCE.y;
      targetLookAt.x += cursor.x * 0.5;
      targetLookAt.y += cursor.y * 0.24;
    }

    camera.position.lerp(targetPosition, damping);
    lookAt.lerp(targetLookAt, damping);
    camera.lookAt(lookAt);

    const nextFov = reducedMotion ? MOTION.cameraFovDefault : frame.fov;
    perspectiveCamera.fov = THREE.MathUtils.damp(
      perspectiveCamera.fov,
      nextFov,
      7,
      delta
    );
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
};
