import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei/core/Environment.js';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import SuperPETModel from './SuperPETModel';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { prefersReducedMotion } from '../../utils/motion';

interface HeroSceneProps {
  quality: 'high' | 'low';
}

type HeroDebugState = 'intro' | 'landing' | 'focus' | null;

function getHeroDebugState(): HeroDebugState {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get('heroState');
  return value === 'intro' || value === 'landing' || value === 'focus' ? value : null;
}

function CameraController({
  animated,
  progress,
  debugState,
}: {
  animated: boolean;
  progress: number;
  debugState: HeroDebugState;
}) {
  const introProgress = useRef({ value: prefersReducedMotion ? 1 : 0 });
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
  const introStartPosition = useMemo(() => new THREE.Vector3(3.54, 0.68, -1.2), []);
  const introStartLookAt = useMemo(() => new THREE.Vector3(3.06, 0.66, -1.64), []);
  const landingPosition = useMemo(() => new THREE.Vector3(8.25, 0.98, 2.64), []);
  const landingLookAt = useMemo(() => new THREE.Vector3(0.48, -0.08, -0.82), []);
  const scrollEndPosition = useMemo(() => new THREE.Vector3(3.58, 0.69, -1.14), []);
  const scrollEndLookAt = useMemo(() => new THREE.Vector3(3.06, 0.66, -1.64), []);

  useEffect(() => {
    if (!animated || prefersReducedMotion) {
      introProgress.current.value = 1;
      return;
    }

    introProgress.current.value = 0;

    const tween = gsap.to(introProgress.current, {
      value: 1,
      duration: 1.45,
      delay: 0.08,
      ease: 'power3.out',
    });

    return () => {
      tween.kill();
    };
  }, [animated]);

  useFrame(({ camera }) => {
    const focusProgress = THREE.MathUtils.clamp((progress - 0.02) / 0.88, 0, 1);
    const resolvedFocusProgress =
      debugState === 'focus' ? 1 : debugState === 'intro' || debugState === 'landing' ? 0 : focusProgress;
    const easedProgress = THREE.MathUtils.smootherstep(resolvedFocusProgress, 0, 1);
    const easedLookProgress = THREE.MathUtils.smootherstep(
      THREE.MathUtils.clamp(resolvedFocusProgress / 0.42, 0, 1),
      0,
      1,
    );
    const intro =
      debugState === 'intro' ? 0 : debugState === 'landing' || debugState === 'focus' ? 1 : introProgress.current.value;

    if (!animated || prefersReducedMotion) {
      camera.position.copy(landingPosition);
      camera.lookAt(landingLookAt);
      return;
    }

    target.copy(introStartPosition).lerp(landingPosition, intro);
    target.lerp(scrollEndPosition, easedProgress);

    lookAtTarget.copy(introStartLookAt).lerp(landingLookAt, intro);
    lookAtTarget.lerp(scrollEndLookAt, easedLookProgress);

    if (debugState) {
      camera.position.copy(target);
      camera.lookAt(lookAtTarget);
      return;
    }

    camera.position.lerp(target, 0.08);
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
      !animated || prefersReducedMotion ? 0.48 : 0.62 - progress * 0.1;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity,
      0.08,
    );
  });

  return (
    <pointLight
      ref={lightRef}
      position={[3.1, 0.66, -1.42]}
      intensity={0.58}
      distance={4.4}
      decay={1.8}
      color="#8de8e1"
    />
  );
}

function SceneContent({ quality }: HeroSceneProps) {
  const progress = useScrollProgress('#section-hero');
  const animated = !prefersReducedMotion;
  const debugState = useMemo(() => getHeroDebugState(), []);

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

      <CameraController animated={animated} progress={progress} debugState={debugState} />
      <ScreenGlow animated={animated} progress={progress} />

      <Suspense fallback={null}>
        <SuperPETModel animated={animated} />
      </Suspense>

      {quality === 'high' && <Environment preset="night" />}

      {quality === 'high' && (
        <EffectComposer>
          <Bloom
            intensity={0.46}
            luminanceThreshold={0.78}
            luminanceSmoothing={0.9}
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
      camera={{ position: [8.25, 0.98, 2.64], fov: 34 }}
      gl={{
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#100818', 9, 24]} />
      <SceneContent quality={quality} />
    </Canvas>
  );
}

export default HeroScene;
