'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS } from '@/lib/projectData';
import { COLORS } from '@/lib/colorSystem';
import { getLocalProgress } from '@/lib/systemStates';
import { Panel } from '@/components/primitives/Panel';
import { SystemText } from '@/components/primitives/SystemText';
import { Trace } from '@/components/primitives/Trace';
import { useProjectStore } from '@/store/projectStore';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

const PROJECT_POSITIONS: [number, number, number][] = [
  [-4.2, 0.9, -5.5],
  [3.3, -0.6, -8],
  [-2.6, -1.4, -11.5],
  [3.8, 1.2, -13.5],
];

useTexture.preload(PROJECTS.map((project) => project.thumbnail));

export const ExecutingState = () => {
  const progress = useSystemStore((state) => state.progress);
  const status = useSystemStore((state) => state.status);
  const openProject = useProjectStore((state) => state.openProject);
  const textures = useTexture(PROJECTS.map((project) => project.thumbnail));
  const { gl } = useThree();

  useEffect(() => {
    const anisotropy = gl.capabilities.getMaxAnisotropy();

    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    });
  }, [gl, textures]);

  const local = getLocalProgress(progress, SystemState.Executing);
  const isVisible =
    status.state === SystemState.Executing ||
    (status.state === SystemState.Processing && status.local < 0.1);

  if (!isVisible && local === 0) {
    return null;
  }

  return (
    <group>
      {PROJECTS.map((project, index) => (
        <group key={project.id}>
          <Panel
            position={PROJECT_POSITIONS[index]}
            width={3.2}
            height={2.05}
            depth={0.12}
            active={local > 0.1 + index * 0.1}
            edgeIntensity={0.38}
            onClick={() => openProject(project)}
          >
            <mesh position={[0, 0.08, 0]}>
              <planeGeometry args={[2.82, 1.6]} />
              <meshBasicMaterial
                map={textures[index]}
                transparent
                opacity={0.74}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, -0.72, 0.01]}>
              <planeGeometry args={[2.82, 0.38]} />
              <meshBasicMaterial
                color={COLORS.panel}
                transparent
                opacity={0.82}
                toneMapped={false}
              />
            </mesh>
          </Panel>

          <SystemText
            text={project.title}
            position={[
              PROJECT_POSITIONS[index][0],
              PROJECT_POSITIONS[index][1] - 0.77,
              PROJECT_POSITIONS[index][2] + 0.13,
            ]}
            fontSize={0.14}
            letterSpacing={0}
            visible={local > 0.2 + index * 0.1}
            opacity={0.92}
          />

          <SystemText
            text={`${project.category.join(' / ')}   ${project.year}`}
            position={[
              PROJECT_POSITIONS[index][0],
              PROJECT_POSITIONS[index][1] - 1.03,
              PROJECT_POSITIONS[index][2] + 0.13,
            ]}
            fontSize={0.08}
            letterSpacing={0.12}
            visible={local > 0.24 + index * 0.1}
            opacity={0.34}
          />
        </group>
      ))}

      {PROJECT_POSITIONS.slice(0, -1).map((position, index) => (
        <Trace
          key={`trace-${index}`}
          start={position}
          end={PROJECT_POSITIONS[index + 1]}
          color={COLORS.blue}
          speed={1.8}
          active={local > 0.32}
          packets={4}
        />
      ))}

      <Trace
        start={PROJECT_POSITIONS[0]}
        end={PROJECT_POSITIONS[3]}
        color={COLORS.blue}
        speed={1.35}
        active={local > 0.42}
        packets={3}
      />
    </group>
  );
};
