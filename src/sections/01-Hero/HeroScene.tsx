import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei/core/Environment.js';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import SuperPETModel from './SuperPETModel';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { prefersReducedMotion } from '../../utils/motion';

interface HeroSceneProps {
  quality: 'high' | 'low';
}

function CameraController({
  animated,
  progress,
}: {
  animated: boolean;
  progress: number;
}) {
  const target = useMemo(() => new THREE.Vector3(-0.1, 0.18, 6.5), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(1.12, 0.08, 0.02), []);

  useFrame(({ camera }) => {
    if (!animated || prefersReducedMotion) {
      camera.position.set(-0.1, 0.18, 6.5);
      camera.lookAt(lookAtTarget);
      return;
    }

    target.set(
      THREE.MathUtils.lerp(-0.1, 0.72, progress),
      THREE.MathUtils.lerp(0.18, 0.6, progress),
      THREE.MathUtils.lerp(6.5, 3.1, progress),
    );

    camera.position.lerp(target, 0.06);
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function ScreenGlow({
  animated,
  progress,
}: {
  animated: boolean;
  progress: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) {
      return;
    }

    const targetIntensity =
      !animated || prefersReducedMotion ? 1.02 : 1.38 - progress * 0.22;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity,
      0.08,
    );
  });

  return (
    <pointLight
      ref={lightRef}
      position={[1.22, 0.78, 1.2]}
      intensity={1.4}
      distance={6}
      decay={1.8}
      color="#93f3ff"
    />
  );
}

function SceneContent({ quality }: HeroSceneProps) {
  const progress = useScrollProgress('#section-hero');
  const animated = quality === 'high' && !prefersReducedMotion;

  return (
    <>
      <ambientLight intensity={quality === 'high' ? 0.2 : 0.3} color="#2b2148" />
      <spotLight
        position={[5.6, 6.2, 4.8]}
        intensity={quality === 'high' ? 3.2 : 2.5}
        angle={0.42}
        penumbra={1}
        color="#ffaa66"
        decay={1.5}
      />
      <pointLight
        position={[-4.6, 1.2, 2.4]}
        intensity={quality === 'high' ? 1.15 : 0.8}
        color="#5660ff"
        decay={2}
      />
      <pointLight
        position={[2.8, -0.6, -3.8]}
        intensity={quality === 'high' ? 0.65 : 0.42}
        color="#352f90"
        decay={2}
      />
      <pointLight
        position={[0.4, -3.2, 2.2]}
        intensity={quality === 'high' ? 0.45 : 0.28}
        color="#8458ff"
        decay={2}
      />

      <CameraController animated={animated} progress={progress} />
      <ScreenGlow animated={animated} progress={progress} />

      <Suspense fallback={null}>
        <SuperPETModel animated={animated} />
      </Suspense>

      {quality === 'high' && <Environment preset="night" />}

      {quality === 'high' && (
        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.88}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

function HeroScene({ quality }: HeroSceneProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dpr: [number, number] =
    quality === 'low' ? [1, 1] : isMobile ? [1, 1.15] : [1, 1.35];

  return (
    <Canvas
      dpr={dpr}
      frameloop={quality === 'low' ? 'demand' : 'always'}
      aria-hidden="true"
      camera={{ position: [-0.1, 0.18, 6.5], fov: 34 }}
      gl={{
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#100818', 9, 24]} />
      <SceneContent quality={quality} />
    </Canvas>
  );
}

export default HeroScene;
