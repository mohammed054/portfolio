'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/colorSystem';

interface DataPacketProps {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: number;
  count?: number;
  active?: boolean;
}

export const DataPacket = ({
  start,
  end,
  speed = 1,
  color = COLORS.blue,
  count = 4,
  active = true,
}: DataPacketProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const startVector = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVector = useMemo(() => new THREE.Vector3(...end), [end]);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.visible = active;
    if (!active) {
      return;
    }

    const elapsed = clock.getElapsedTime() * speed * 0.22;

    for (let index = 0; index < count; index += 1) {
      const offset = index / count;
      const progress = (elapsed + offset) % 1;

      point.lerpVectors(startVector, endVector, progress);
      dummy.position.copy(point);
      dummy.scale.setScalar(1 - index * 0.05);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.08, 0.08, 0.08]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
};
