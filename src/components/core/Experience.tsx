'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { ScrollRig } from './ScrollRig';
import { SystemCamera } from './SystemCamera';
import { SystemStateObserver } from './SystemState';
import { AmbientSystem } from '@/components/environment/AmbientSystem';
import { Substrate } from '@/components/environment/Substrate';
import { ActivatingState } from '@/components/states/ActivatingState';
import { ExecutingState } from '@/components/states/ExecutingState';
import { IdentifyingState } from '@/components/states/IdentifyingState';
import { IdleState } from '@/components/states/IdleState';
import { ProcessingState } from '@/components/states/ProcessingState';
import { ResolvedState } from '@/components/states/ResolvedState';
import { RoutingState } from '@/components/states/RoutingState';
import { Effects } from '@/components/postprocessing/Effects';
import { Cursor } from '@/components/ui/Cursor';
import { Loader } from '@/components/ui/Loader';
import { Navigation } from '@/components/ui/Navigation';
import { StatusBar } from '@/components/ui/StatusBar';
import { SystemOverlay } from '@/components/ui/SystemOverlay';
import { useAudio } from '@/hooks/useAudio';
import { useCursorPosition } from '@/hooks/useCursorPosition';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

const DragonCanvas = dynamic(
  () => import('@/components/interactive/DragonCanvas').then((module) => module.DragonCanvas),
  {
    ssr: false,
  }
);

const ProjectModal = dynamic(
  () => import('@/components/ui/ProjectModal').then((module) => module.ProjectModal),
  {
    ssr: false,
  }
);

const SceneAudioDriver = () => {
  const audio = useAudio();

  useFrame(() => {
    const { progress, status } = useSystemStore.getState();
    audio.update(progress, status.state);
  });

  return null;
};

const SceneContent = () => (
  <>
    <SystemCamera />
    <SceneAudioDriver />
    <Substrate />
    <AmbientSystem />
    <IdleState />
    <ActivatingState />
    <IdentifyingState />
    <RoutingState />
    <ExecutingState />
    <ProcessingState />
    <ResolvedState />
    <Effects />
    <Preload all />
  </>
);

const ExperienceInner = () => {
  useCursorPosition();
  const setLoaded = useSystemStore((state) => state.setLoaded);

  return (
    <>
      <ScrollRig>
        <Canvas
          aria-hidden="true"
          role="presentation"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          camera={{
            fov: MOTION.cameraFovDefault,
            near: MOTION.cameraNear,
            far: MOTION.cameraFar,
            position: [0, 2, 45],
          }}
          dpr={[1, 1.8]}
          onCreated={({ gl }) => {
            gl.setClearColor(0x050507, 1);
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
            });
          }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>

        <DragonCanvas />
        <SystemOverlay />
      </ScrollRig>

      <Navigation />
      <StatusBar />
      <Cursor />
      <Loader onComplete={() => setLoaded(true)} />
      <ProjectModal />
      <SystemStateObserver />
    </>
  );
};

export const Experience = () => <ExperienceInner />;
