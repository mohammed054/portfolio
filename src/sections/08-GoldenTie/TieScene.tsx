import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

interface TieSceneProps {
  activated: boolean;
}

function CameraRig({ progress }: { progress: number }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.1, 3.15), []);
  const lookAt = useMemo(() => new THREE.Vector3(0, -0.45, 0), []);

  useFrame(({ camera }) => {
    const angle = progress * Math.PI * 0.4 - Math.PI * 0.2;
    target.set(Math.sin(angle) * 1.15, 0.18, 3.0 - Math.cos(angle) * 0.22);
    camera.position.lerp(target, 0.06);
    camera.lookAt(lookAt);
  });

  return null;
}

function GoldenTie({ activated }: { activated: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, basePositions } = useMemo(() => {
    const nextGeometry = new THREE.PlaneGeometry(1.08, 3.45, 30, 88);
    const positions = nextGeometry.attributes.position as THREE.BufferAttribute;
    const widthBase = 0.54;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const depth = THREE.MathUtils.clamp((1.725 - y) / 3.45, 0, 1);

      let halfWidth = depth < 0.14
        ? THREE.MathUtils.lerp(0.14, 0.2, depth / 0.14)
        : THREE.MathUtils.lerp(0.2, 0.47, Math.min(1, (depth - 0.14) / 0.68));

      if (depth > 0.84) {
        halfWidth = THREE.MathUtils.lerp(0.47, 0.06, (depth - 0.84) / 0.16);
      }

      const normalisedX = Math.abs(x) / widthBase;
      positions.setX(index, Math.sign(x || 1) * halfWidth * normalisedX);
      positions.setZ(index, THREE.MathUtils.lerp(0.02, -0.08, depth));
    }

    nextGeometry.computeVertexNormals();

    return {
      geometry: nextGeometry,
      basePositions: Float32Array.from(positions.array as ArrayLike<number>),
    };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const time = clock.elapsedTime;
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const swayStrength = activated ? 1 : 0.55;

    for (let index = 0; index < positions.count; index += 1) {
      const baseX = basePositions[index * 3];
      const baseY = basePositions[index * 3 + 1];
      const baseZ = basePositions[index * 3 + 2];
      const depth = THREE.MathUtils.clamp((1.725 - baseY) / 3.45, 0, 1);
      const falloff = depth * depth;

      positions.setX(
        index,
        baseX + Math.sin(time * 1.25 + depth * 4.5) * 0.15 * falloff * swayStrength,
      );
      positions.setZ(
        index,
        baseZ + Math.cos(time * 1.05 + depth * 3.6) * 0.05 * falloff * swayStrength,
      );
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    groupRef.current.rotation.z = Math.sin(time * 0.85) * 0.05 * swayStrength;
    groupRef.current.rotation.x = -0.04 + Math.cos(time * 0.55) * 0.02 * swayStrength;
  });

  return (
    <group ref={groupRef} position={[0, -0.65, 0]} scale={0.42}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#c8940a"
          metalness={0.18}
          roughness={0.24}
          clearcoat={0.9}
          clearcoatRoughness={0.16}
          reflectivity={1}
          sheen={0.72}
          sheenColor="#ffd36e"
          sheenRoughness={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 1.86, 0.07]} rotation={[0, 0, Math.PI * 0.25]}>
        <boxGeometry args={[0.34, 0.34, 0.12]} />
        <meshPhysicalMaterial
          color="#d3a118"
          metalness={0.24}
          roughness={0.22}
          clearcoat={0.8}
          reflectivity={1}
          sheen={0.52}
          sheenColor="#ffe091"
        />
      </mesh>

      <mesh position={[0, 1.38, -0.08]}>
        <planeGeometry args={[0.22, 1.05, 6, 12]} />
        <meshPhysicalMaterial
          color="#8f6810"
          metalness={0.16}
          roughness={0.34}
          sheen={0.42}
          sheenColor="#d9a637"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function TieScene({ activated }: TieSceneProps) {
  const progress = useScrollProgress('#section-golden-tie');
  const dpr: [number, number] =
    typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      camera={{ position: [0, 0.12, 4.1], fov: 24 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
    >
      <ambientLight intensity={0.18} />
      <spotLight
        position={[0, 5.5, 1.2]}
        intensity={42}
        angle={0.28}
        penumbra={0.75}
        color="#ffe49a"
      />
      <pointLight position={[-1.8, 0.4, 2.2]} intensity={2.2} color="#ffcf73" />
      <pointLight position={[1.8, 0.6, 1.8]} intensity={1.8} color="#f0d69c" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]}>
        <circleGeometry args={[1.18, 48]} />
        <meshBasicMaterial color="#5e4a26" transparent opacity={0.22} />
      </mesh>
      <CameraRig progress={progress} />
      <GoldenTie activated={activated} />
    </Canvas>
  );
}

export default TieScene;
