import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_PATH = '/models/70s_retro_computer_asset_-_old_commodore_pet.glb';

export function SuperPETComputer() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true) as THREE.Group;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Idle float + subtle sway
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.04;
    groupRef.current.rotation.y = -0.2 + Math.sin(t * 0.28) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0.7, -0.5, 0]} scale={1.2}>
      <primitive object={clonedScene} />
      {/* Screen glow */}
      <pointLight position={[0, 0.9, 0.9]} color="#33ff88" intensity={1.0} distance={3} decay={2} />
    </group>
  );
}

// Preload outside component
SuperPETComputer.preload = () => useGLTF.preload(MODEL_PATH);
