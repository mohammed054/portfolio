'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SystemText } from '@/components/primitives/SystemText';
import { Trace } from '@/components/primitives/Trace';
import { Volume } from '@/components/primitives/Volume';
import { COLORS } from '@/lib/colorSystem';
import { getLocalProgress } from '@/lib/systemStates';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

const PROCESSING_LOGS = [
  '> COMPILING DEPENDENCIES...',
  '> OPTIMIZING RENDER PIPELINE...',
  '> RESOLVING MODULE GRAPH...',
  '> BUILDING STATIC ASSETS...',
  '> RUNNING TYPE CHECKS...',
  '> ANALYZING BUNDLE SIZE...',
  '> FINALIZING OUTPUT...',
];

export const ProcessingState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const lightRef = useRef<THREE.PointLight>(null);
  const local = getLocalProgress(progress, SystemState.Processing);
  const isVisible =
    status.state === SystemState.Processing ||
    (status.state === SystemState.Resolved && status.local < 0.1);

  useFrame(({ clock }) => {
    if (!lightRef.current) {
      return;
    }

    const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.8) * 0.18;
    lightRef.current.intensity = local * 1.2 * pulse;
  });

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 2.2, -13]} color={COLORS.amber} intensity={0} distance={22} decay={2} />

      <Volume position={[-4.1, 0, -14]} width={1.4} height={6.4} depth={8.4} rotation={[0, 0.18, 0]} color={COLORS.panel} opacity={local * 0.18} />
      <Volume position={[4.1, 0, -14]} width={1.4} height={6.4} depth={8.4} rotation={[0, -0.18, 0]} color={COLORS.panel} opacity={local * 0.18} />
      <Volume position={[0, -2.2, -16.5]} width={10.2} height={1.3} depth={6.1} color={COLORS.panel} opacity={local * 0.14} />

      <Trace start={[-4.1, 0, -10.6]} end={[-4.1, 0, -20]} color={COLORS.amber} speed={2.2} active={local > 0.18} packets={5} />
      <Trace start={[4.1, 0, -10.6]} end={[4.1, 0, -20]} color={COLORS.amber} speed={2.3} active={local > 0.18} packets={5} />
      <Trace start={[-4.1, 0, -15]} end={[4.1, 0, -15]} color={COLORS.amber} speed={2.7} active={local > 0.36} packets={4} />

      {PROCESSING_LOGS.map((log, index) => (
        <SystemText
          key={log}
          text={log}
          position={[-5.2, 1.5 - index * 0.34, -11.1 - index * 0.28]}
          fontSize={0.105}
          letterSpacing={0.08}
          color="#FF6B00"
          visible={local > index * 0.1}
          opacity={0.52}
          anchorX="left"
        />
      ))}
    </group>
  );
};
