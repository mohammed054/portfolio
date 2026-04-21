// ============================================================
// SHADER REBUILD — Hero R3F Scene
// src/sections/01-Hero/HeroScene.tsx
//
// Spec: 02-hero.md
// - Atmospheric fog (purple-gray drift)
// - Warm key light (top-right) + cool fill (left) + purple ambient
// - Bloom + chromatic aberration postprocessing
// - Fog particle cloud
// ============================================================

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import * as THREE from 'three';
import SuperPETModel from './SuperPETModel';
import { Suspense } from 'react';

// ─── FOG PARTICLE CLOUD ──────────────────────────────────────

function FogCloud() {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.7) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.008;
    meshRef.current.position.x = Math.sin(t * 0.04) * 0.3;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#5a3a8a"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── SCENE CONTENT ───────────────────────────────────────────

function SceneContent() {
  return (
    <>
      {/* Ambient — very dark purple */}
      <ambientLight intensity={0.12} color="#2a1f5e" />

      {/* Key light — warm orange-white, top-right */}
      <spotLight
        position={[6, 7, 5]}
        intensity={3.5}
        angle={0.35}
        penumbra={1}
        color="#ffaa66"
        decay={1.5}
        castShadow={false}
      />

      {/* Fill — cool blue-purple, left */}
      <pointLight
        position={[-7, 2, 3]}
        intensity={1.8}
        color="#4455dd"
        decay={2}
      />

      {/* Rim — cool blue, behind right — separates from bg */}
      <pointLight
        position={[4, 0, -4]}
        intensity={0.8}
        color="#2244aa"
        decay={2}
      />

      {/* Ground fog — slight purple wash from below */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.5}
        color="#6633aa"
        decay={2}
      />

      <FogCloud />

      <Suspense fallback={null}>
        <SuperPETModel />
      </Suspense>

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0015, 0.0015)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}

// ─── CANVAS WRAPPER ──────────────────────────────────────────────

function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" color="#0d0820" near={10} far={28} />
      <SceneContent />
    </Canvas>
  );
}

export default HeroScene;