'use client';

import { Panel } from '@/components/primitives/Panel';
import { Trace } from '@/components/primitives/Trace';
import { getLocalProgress } from '@/lib/systemStates';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

const PANEL_CONFIGS: [number, number, number, number, number, number][] = [
  [-3.2, 0.6, 0, 2.6, 1.45, 0.08],
  [3.2, 0.6, 0, 2.6, 1.45, 0.18],
  [-2.15, -0.92, -0.9, 1.85, 1.05, 0.36],
  [2.15, -0.92, -0.9, 1.85, 1.05, 0.5],
  [0, 1.35, -2.4, 3.1, 0.9, 0.68],
  [0, -1.55, -2.8, 2.3, 0.68, 0.84],
];

export const ActivatingState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const local = getLocalProgress(progress, SystemState.Activating);
  const isVisible =
    status.state === SystemState.Activating ||
    (status.state === SystemState.Identifying && status.local < 0.12);

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      {PANEL_CONFIGS.map(([x, y, z, width, height, threshold], index) => (
        <Panel
          key={index}
          position={[x, y, z]}
          width={width}
          height={height}
          active={local >= threshold}
          edgeIntensity={0.24}
        />
      ))}

      {local > 0.28 ? (
        <>
          <Trace start={[-3.2, 0.6, 0]} end={[3.2, 0.6, 0]} active={false} speed={0} />
          <Trace start={[-3.2, 0.6, 0]} end={[-2.15, -0.92, -0.9]} active={false} speed={0} />
          <Trace start={[3.2, 0.6, 0]} end={[2.15, -0.92, -0.9]} active={false} speed={0} />
        </>
      ) : null}
    </group>
  );
};
