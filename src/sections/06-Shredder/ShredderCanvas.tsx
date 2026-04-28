import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MODEL_PATHS } from '../../utils/constants';

interface ShredderCanvasProps {
  active: boolean;
}

function Machine({ active }: ShredderCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATHS.shredderMachine);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) {
        return;
      }

      const mesh = child as THREE.Mesh;
      const baseMaterial = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
      const materials = Array.isArray(baseMaterial) ? baseMaterial : [baseMaterial];

      mesh.material = materials.map((material) => {
        const clone = material.clone();
        const name = clone.name.toLowerCase();

        if (name.includes('glass') || name.includes('slot')) {
          clone.color = new THREE.Color('#17141c');
          clone.roughness = 0.2;
          clone.metalness = 0.15;
        } else if (name.includes('chrome')) {
          clone.color = new THREE.Color('#d8cdb8');
          clone.roughness = 0.28;
          clone.metalness = 1;
        } else if (name.includes('black')) {
          clone.color = new THREE.Color('#211d26');
          clone.roughness = 0.62;
          clone.metalness = 0.08;
        } else {
          clone.color = new THREE.Color('#d4c0a0');
          clone.roughness = 0.56;
          clone.metalness = 0.12;
        }

        clone.envMapIntensity = 0.8;
        return clone;
      });
    });
  }, [model]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const time = clock.elapsedTime;
    const shake = active ? 0.025 : 0.008;

    groupRef.current.position.y = -0.42 + Math.sin(time * 1.4) * 0.04;
    groupRef.current.position.x = active ? Math.sin(time * 36) * shake : 0;
    groupRef.current.position.z = active ? Math.cos(time * 32) * shake * 0.4 : 0;
    groupRef.current.rotation.z = active ? Math.sin(time * 28) * 0.01 : 0;
    groupRef.current.rotation.y = -0.2 + Math.sin(time * 0.55) * 0.04;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.2, 0]} scale={2.2}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.shredderMachine);

function ShredderCanvas({ active }: ShredderCanvasProps) {
  const dpr: [number, number] =
    typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      camera={{ position: [0, 0.45, 6.5], fov: 26 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <ambientLight intensity={0.9} color="#f8ecd2" />
      <directionalLight position={[4, 5, 5]} intensity={2.3} color="#fff5df" />
      <pointLight position={[-4, 1, 3]} intensity={0.9} color="#f3b26a" />
      <pointLight position={[2, -2, 2]} intensity={0.55} color="#4732aa" />
      <Machine active={active} />
    </Canvas>
  );
}

export default ShredderCanvas;
