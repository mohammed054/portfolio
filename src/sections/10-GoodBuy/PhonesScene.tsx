import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { Environment } from '@react-three/drei/core/Environment.js';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const PHONE_MODEL = '/models/shader-phones.glb';

function PhoneFallback() {
  return (
    <group>
      <mesh position={[0, -0.28, 0]} scale={[1.8, 0.22, 1.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#eee5d4" roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh position={[-0.58, 0.18, 0.04]} rotation={[0, 0, -0.18]} scale={[0.32, 1.2, 0.26]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f2eadb" roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh position={[0.54, 0.02, 0.12]} rotation={[0, 0.12, 0]} scale={[0.58, 0.22, 0.86]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ddd4c4" roughness={0.68} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.34, -0.2]} rotation={[0.14, 0, 0]} scale={[0.32, 0.8, 0.22]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f1e8d7" roughness={0.64} metalness={0.04} />
      </mesh>
    </group>
  );
}

function Phones() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(PHONE_MODEL);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) {
        return;
      }

      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        material.side = THREE.FrontSide;
      });
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
  }, [clone]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = -0.18 + Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    groupRef.current.position.y = -0.18 + Math.sin(state.clock.elapsedTime * 0.32) * 0.018;
  });

  return (
    <group ref={groupRef} position={[0.9, 0, -3.5]}>
      <primitive object={clone} scale={1.1} rotation={[0.3, Math.PI, 0]} position={[0, -4, -3]} />
    </group>
  );
}

function PhonesScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 65 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
      }}
    >
      <ambientLight intensity={2.4} color="#f2eadc" />
      <spotLight position={[0, 4.8, 2.6]} intensity={5.8} angle={0.42} penumbra={0.72} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={300} color="#ffccdd" />
      <pointLight position={[-2.4, 0.8, 1.8]} intensity={0.56} color="#d5e6ff" />
      <Suspense fallback={<PhoneFallback />}>
        <Phones />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(PHONE_MODEL);

export default PhonesScene;
