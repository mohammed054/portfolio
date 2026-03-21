'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function BlackHoleModel() {
  const group = useRef<THREE.Group>(null!);

  // load your GLB
  const { scene } = useGLTF('/blackhole.glb');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 2;
        child.material.emissiveIntensity = 3;
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();


  });

  return (
    <group ref={group} scale={2.5}>
      <primitive object={scene} />
    </group>
  );
}

// preload for performance
useGLTF.preload('/blackhole.glb');