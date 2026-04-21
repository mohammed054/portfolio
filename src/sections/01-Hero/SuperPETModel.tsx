// ============================================================
// SHADER REBUILD — SuperPET Model
// src/sections/01-Hero/SuperPETModel.tsx
//
// Spec: 02-hero.md + 15-3d-asset-specs.md
// Loads the Commodore PET GLB, applies emissive screen material,
// and runs a subtle idle float + gentle rotation.
// ============================================================

import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_PATH = '/models/70s_retro_computer_asset_-_old_commodore_pet.glb';

function SuperPETModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      const name = mesh.name.toLowerCase();
      const isScreen =
        name.includes('screen') ||
        name.includes('monitor') ||
        name.includes('display') ||
        name.includes('crt');

      if (isScreen) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#001133'),
          emissive: new THREE.Color('#003a8c'),
          emissiveIntensity: 1.2,
          metalness: 0.9,
          roughness: 0.1,
        });
      } else {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => {
            const mat = (m as THREE.MeshStandardMaterial).clone?.() ?? m;
            (mat as THREE.MeshStandardMaterial).envMapIntensity = 0.8;
            return mat;
          });
        } else if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.envMapIntensity = 0.8;
          mesh.material = mat;
        }
      }

      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });

    if (groupRef.current) {
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clone);
    }
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = -0.4 + Math.sin(t * 0.5) * 0.06;
    groupRef.current.rotation.y = -0.25 + Math.sin(t * 0.3) * 0.06;
  });

  return (
    <group
      ref={groupRef}
      position={[1.4, -0.4, 0]}
      rotation={[0.04, -0.25, 0]}
      scale={[2.2, 2.2, 2.2]}
    />
  );
}

useGLTF.preload(MODEL_PATH);

export default SuperPETModel;