import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh, MeshPhysicalMaterial, Group } from 'three';

function Tie() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshPhysicalMaterial
          color="#c9a84c"
          metalness={0.85}
          roughness={0.15}
          reflectivity={1}
        />
      </mesh>

      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.12, 0.6, 4]} />
        <meshPhysicalMaterial
          color="#c9a84c"
          metalness={0.85}
          roughness={0.15}
          reflectivity={1}
        />
      </mesh>

      <mesh position={[0, -0.9, 0]}>
        <coneGeometry args={[0.25, 0.8, 4]} />
        <meshPhysicalMaterial
          color="#c9a84c"
          metalness={0.85}
          roughness={0.15}
          reflectivity={1}
        />
      </mesh>
    </group>
  );
}

function TieScene() {
  return (
    <Canvas>
      <spotLight position={[0, 5, 2]} intensity={2} angle={0.3} penumbra={1} color="#ffdd88" />
      <ambientLight intensity={0.1} />
      <Tie />
    </Canvas>
  );
}

export default TieScene;