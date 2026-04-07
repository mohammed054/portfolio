'use client';

import { Panel } from '@/components/primitives/Panel';
import { SystemText } from '@/components/primitives/SystemText';
import { Trace } from '@/components/primitives/Trace';
import { COLORS } from '@/lib/colorSystem';
import { getLocalProgress } from '@/lib/systemStates';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

const NODES: [number, number, number][] = [
  [-4.4, 1.1, -0.2],
  [4.4, 1.1, -0.2],
  [-4.2, -1.2, -3.4],
  [4.2, -1.2, -3.4],
  [0, 0.1, -6.1],
  [-2.7, -0.1, -8.8],
  [2.7, -0.1, -8.8],
];

const EDGES: [number, number, number][] = [
  [0, 1, 0.1],
  [0, 2, 0.2],
  [1, 3, 0.2],
  [2, 4, 0.33],
  [3, 4, 0.33],
  [0, 4, 0.42],
  [1, 4, 0.42],
  [4, 5, 0.56],
  [4, 6, 0.56],
];

const LABELS = ['DESIGN SYSTEMS', 'WEB EXPERIENCES', 'MOTION', '3D'];

export const RoutingState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const local = getLocalProgress(progress, SystemState.Routing);
  const isVisible =
    status.state === SystemState.Routing ||
    (status.state === SystemState.Executing && status.local < 0.1);

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      {NODES.map((position, index) => (
        <Panel
          key={`node-${index}`}
          position={position}
          width={index < 4 ? 2.45 : 1.55}
          height={index < 4 ? 1.22 : 0.84}
          active={local > 0.06 + index * 0.05}
          edgeIntensity={0.3}
        />
      ))}

      {LABELS.map((label, index) => (
        <SystemText
          key={`label-${index}`}
          text={label}
          position={[NODES[index][0], NODES[index][1] + 0.04, NODES[index][2] + 0.08]}
          fontSize={0.13}
          letterSpacing={0.12}
          visible={local > 0.25 + index * 0.05}
          opacity={0.34}
        />
      ))}

      {EDGES.map(([from, to, threshold], index) => (
        <Trace
          key={`edge-${index}`}
          start={NODES[from]}
          end={NODES[to]}
          color={COLORS.blue}
          speed={1.2}
          active={local > threshold}
          packets={3}
        />
      ))}
    </group>
  );
};
