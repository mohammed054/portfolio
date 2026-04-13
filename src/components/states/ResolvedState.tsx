'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel } from '@/components/primitives/Panel';
import { SystemText } from '@/components/primitives/SystemText';
import { COLORS } from '@/lib/colorSystem';
import { getLocalProgress } from '@/lib/systemStates';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

const CONTACT_EMAIL = 'hello@hassoun.work';

export const ResolvedState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const flashStrength = useRef(0);
  const flashed = useRef(false);
  const lightRef = useRef<THREE.PointLight>(null);
  const local = getLocalProgress(progress, SystemState.Resolved);
  const isVisible = status.state === SystemState.Resolved;

  useEffect(() => {
    if (isVisible && !flashed.current) {
      flashed.current = true;
      flashStrength.current = 1;
    }
  }, [isVisible]);

  useFrame((_, delta) => {
    flashStrength.current = THREE.MathUtils.damp(flashStrength.current, 0, 10, delta);
    if (lightRef.current) {
      lightRef.current.intensity = flashStrength.current * 4 + local * 0.18;
    }
  });

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 1, -4.8]} color={COLORS.green} intensity={0} distance={18} decay={2} />

      <Panel position={[0, 0, -4.9]} width={6.5} height={3.9} active={local > 0.08} edgeIntensity={0.2} />

      <SystemText
        text="CONTACT CHANNEL"
        position={[0, 0.95, -4.78]}
        fontSize={0.2}
        letterSpacing={0.18}
        visible={local > 0.18}
        opacity={0.34}
      />

      <SystemText
        text={CONTACT_EMAIL}
        position={[0, 0.18, -4.76]}
        fontSize={0.48}
        letterSpacing={-0.02}
        visible={local > 0.28}
        opacity={1}
        onClick={() => {
          window.location.href = `mailto:${CONTACT_EMAIL}`;
        }}
        cursorContext="view"
      />

      <SystemText
        text="Open to full-time and selected freelance work."
        position={[0, -0.62, -4.76]}
        fontSize={0.15}
        letterSpacing={0.02}
        visible={local > 0.42}
        opacity={0.55}
      />

      <SystemText
        text="github.com/hassoun    linkedin.com/in/hassoun"
        position={[0, -1.05, -4.76]}
        fontSize={0.1}
        letterSpacing={0.09}
        visible={local > 0.58}
        opacity={0.28}
      />
    </group>
  );
};
