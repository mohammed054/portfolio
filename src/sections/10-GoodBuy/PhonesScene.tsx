import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial, BoxGeometry } from 'three';

function Phones() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.15, 0.8]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.75} metalness={0.1} />
      </mesh>

      <mesh position={[-0.4, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.2]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.75} metalness={0.1} />
      </mesh>

      <mesh position={[0.4, 0, 0.1]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.75} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.3, -0.2]}>
        <boxGeometry args={[0.25, 0.5, 0.15]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.75} metalness={0.1} />
      </mesh>
    </group>
  );
}

function PhonesScene() {
  return (
    <Canvas>
      <spotLight position={[0, 5, 3]} intensity={2} angle={0.4} penumbra={0.5} color="#ffffff" />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#ffaa66" />
      <ambientLight intensity={0.2} />
      <Phones />
    </Canvas>
  );
}

export default PhonesScene;