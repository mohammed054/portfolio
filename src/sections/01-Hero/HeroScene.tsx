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

function CameraController({ progress }: { progress: number }) {
  const target = useMemo(() => new THREE.Vector3(-0.1, 0.18, 6.5), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(1.12, 0.08, 0.02), []);

  useFrame(({ camera }) => {
    if (prefersReducedMotion) {
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

function ScreenGlow({ progress }: { progress: number }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) {
      return;
    }

    const targetIntensity = prefersReducedMotion ? 1 : 1.5 - progress * 0.25;
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

function SceneContent() {
  const progress = useScrollProgress('#section-hero');

  return (
    <>
      <ambientLight intensity={0.2} color="#2b2148" />
      <spotLight
        position={[5.6, 6.2, 4.8]}
        intensity={3.8}
        angle={0.42}
        penumbra={1}
        color="#ffaa66"
        decay={1.5}
      />
      <pointLight position={[-4.6, 1.2, 2.4]} intensity={1.15} color="#5660ff" decay={2} />
      <pointLight position={[2.8, -0.6, -3.8]} intensity={0.65} color="#352f90" decay={2} />
      <pointLight position={[0.4, -3.2, 2.2]} intensity={0.45} color="#8458ff" decay={2} />

      <CameraController progress={progress} />
      <ScreenGlow progress={progress} />

      <Suspense fallback={null}>
        <SuperPETModel />
      </Suspense>

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={1.3}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0014, 0.0014)}
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
      camera={{ position: [-0.1, 0.18, 6.5], fov: 34 }}
      gl={{
        antialias: true,
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
      <SceneContent />
    </Canvas>
  );
}

export default HeroScene;
