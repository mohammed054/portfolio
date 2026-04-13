'use client';

import { Panel } from '@/components/primitives/Panel';
import { SystemText } from '@/components/primitives/SystemText';
import { getLocalProgress } from '@/lib/systemStates';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

export const IdentifyingState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const local = getLocalProgress(progress, SystemState.Identifying);
  const isVisible =
    status.state === SystemState.Identifying ||
    (status.state === SystemState.Routing && status.local < 0.12);

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      <Panel position={[-5.4, 0.12, -0.9]} width={1.3} height={3.8} active={local > 0.18} edgeIntensity={0.42} />
      <Panel position={[5.4, 0.12, -0.9]} width={1.3} height={3.8} active={local > 0.28} edgeIntensity={0.42} />

      <SystemText
        text="HASSOUN"
        position={[0, 1.05, 0]}
        fontSize={2.4}
        letterSpacing={-0.05}
        visible={local > 0.08}
        opacity={1}
      />

      <SystemText
        text="COMPUTATIONAL DESIGNER & DEVELOPER"
        position={[0, -0.65, 0.12]}
        fontSize={0.24}
        letterSpacing={0.11}
        visible={local > 0.2}
        opacity={0.55}
      />
    </group>
  );
};
