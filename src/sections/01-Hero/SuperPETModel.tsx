import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';

function SuperPETModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.4, -0.3]}>
        <boxGeometry args={[1.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#252525" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.4, 0.25]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshStandardMaterial
          color="#001133"
          emissive="#003366"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, -0.3, 0.9]}>
        <boxGeometry args={[2.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

export default SuperPETModel;