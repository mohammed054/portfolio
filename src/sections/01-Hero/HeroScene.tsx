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
  const target = useMemo(() => new THREE.Vector3(0.08, 0.22, 6.18), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(1.18, 0.16, 0.08), []);

  useFrame(({ camera }) => {
    const easedProgress = THREE.MathUtils.smootherstep(progress, 0, 1);

    if (!animated || prefersReducedMotion) {
      camera.position.set(0.08, 0.22, 6.18);
      camera.lookAt(lookAtTarget);
      return;
    }

    target.set(
      THREE.MathUtils.lerp(0.08, 1.06, easedProgress),
      THREE.MathUtils.lerp(0.22, 0.76, easedProgress),
      THREE.MathUtils.lerp(6.18, 2.46, easedProgress),
    );

    lookAtTarget.set(
      THREE.MathUtils.lerp(1.18, 1.54, easedProgress),
      THREE.MathUtils.lerp(0.16, 0.68, easedProgress),
      THREE.MathUtils.lerp(0.08, 0.64, easedProgress),
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
  const animated = !prefersReducedMotion;

  return (
    <>
      <ambientLight intensity={quality === 'high' ? 0.22 : 0.26} color="#2b2148" />
      <spotLight
        position={[4.9, 6.4, 4.2]}
        intensity={quality === 'high' ? 3.7 : 2.9}
        angle={0.46}
        penumbra={1}
        color="#ffbc7a"
        decay={1.5}
      />
      <pointLight
        position={[-4.8, 1.4, 2.8]}
        intensity={quality === 'high' ? 1.05 : 0.72}
        color="#596dff"
        decay={2}
      />
      <pointLight
        position={[2.4, -0.4, -3.8]}
        intensity={quality === 'high' ? 0.58 : 0.38}
        color="#3f39a0"
        decay={2}
      />
      <pointLight
        position={[0.8, -2.4, 2.6]}
        intensity={quality === 'high' ? 0.5 : 0.3}
        color="#9272ff"
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
      frameloop="always"
      aria-hidden="true"
      camera={{ position: [0.08, 0.22, 6.18], fov: 34 }}
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
