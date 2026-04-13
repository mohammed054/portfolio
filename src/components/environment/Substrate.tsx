'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useGridMaterial } from './GridMaterial';

export const Substrate = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useGridMaterial();

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.25, -6]}
      renderOrder={-10}
      frustumCulled={false}
    >
      <planeGeometry args={[220, 220, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
