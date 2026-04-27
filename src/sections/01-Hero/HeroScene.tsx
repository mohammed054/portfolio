import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei/core/Environment.js';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import * as THREE from 'three';
import SuperPETModel from './SuperPETModel';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { prefersReducedMotion } from '../../utils/motion';

function FogCloud({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const count = 180;
    const buffer = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      buffer[index * 3] = (Math.random() - 0.5) * 14;
      buffer[index * 3 + 1] = (Math.random() - 0.7) * 8;
      buffer[index * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }

    return buffer;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;

    if (!prefersReducedMotion) {
      pointsRef.current.rotation.y = time * 0.008;
      pointsRef.current.position.x = Math.sin(time * 0.04) * 0.3;
    }

    materialRef.current.opacity = prefersReducedMotion
      ? 0.35
      : Math.max(0, 0.35 * (1 - progress * 1.5));
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
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

function CameraController({ progress }: { progress: number }) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 7), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(1.4, -0.4, 0), []);

  useFrame(({ camera }) => {
    if (prefersReducedMotion) {
      camera.position.set(0, 0, 7);
      camera.lookAt(lookAtTarget);
      return;
    }

    target.set(
      THREE.MathUtils.lerp(0, 0.8, progress),
      THREE.MathUtils.lerp(0, 0.2, progress),
      THREE.MathUtils.lerp(7, 1.5, progress),
    );

    camera.position.lerp(target, 0.05);
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function SceneContent() {
  const progress = useScrollProgress('#section-hero');

  return (
    <>
      <ambientLight intensity={0.12} color="#2a1f5e" />
      <spotLight
        position={[6, 7, 5]}
        intensity={3.5}
        angle={0.35}
        penumbra={1}
        color="#ffaa66"
        decay={1.5}
      />
      <pointLight position={[-7, 2, 3]} intensity={1.8} color="#4455dd" decay={2} />
      <pointLight position={[4, 0, -4]} intensity={0.8} color="#2244aa" decay={2} />
      <pointLight position={[0, -4, 2]} intensity={0.5} color="#6633aa" decay={2} />

      <CameraController progress={progress} />
      <FogCloud progress={progress} />

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

function HeroScene() {
  const dpr: [number, number] =
    typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      dpr={dpr}
      aria-hidden="true"
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#0d0820', 10, 28]} />
      <SceneContent />
    </Canvas>
  );
}

export default HeroScene;
