'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/colorSystem';
import { useSystemStore } from '@/store/systemStore';

const PANEL_CONFIGS = [
  { position: [-12, 3, -34] as [number, number, number], rotation: [0.12, 0.42, 0] as [number, number, number], scale: [6, 2.2, 0.04] as [number, number, number] },
  { position: [11, 1.5, -28] as [number, number, number], rotation: [0.08, -0.35, 0] as [number, number, number], scale: [5, 1.8, 0.04] as [number, number, number] },
  { position: [-15, -2, -46] as [number, number, number], rotation: [0.04, 0.25, 0] as [number, number, number], scale: [8, 2.6, 0.04] as [number, number, number] },
  { position: [14, -1.2, -52] as [number, number, number], rotation: [-0.02, -0.3, 0] as [number, number, number], scale: [7, 2.4, 0.04] as [number, number, number] },
  { position: [0, 5, -64] as [number, number, number], rotation: [0.18, 0, 0] as [number, number, number], scale: [12, 2.8, 0.04] as [number, number, number] },
];

const STRUT_CONFIGS = [
  { position: [-7.5, -1.1, -22] as [number, number, number], scale: [0.06, 4.5, 14] as [number, number, number] },
  { position: [7.5, -0.8, -24] as [number, number, number], scale: [0.06, 4.1, 16] as [number, number, number] },
  { position: [0, 2.5, -40] as [number, number, number], scale: [14, 0.04, 0.04] as [number, number, number] },
];

export const AmbientSystem = () => {
  const { scene } = useThree();

  const panelMaterials = useMemo(
    () =>
      PANEL_CONFIGS.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: COLORS.panelEdge,
            transparent: true,
            opacity: 0,
          })
      ),
    []
  );

  const strutMaterials = useMemo(
    () =>
      STRUT_CONFIGS.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: COLORS.panelEdge,
            transparent: true,
            opacity: 0,
          })
      ),
    []
  );

  useEffect(() => {
    const fog = new THREE.Fog(COLORS.bg, 22, 95);
    scene.fog = fog;

    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const progress = useSystemStore.getState().progress;
    const ambientStrength = THREE.MathUtils.smoothstep(progress, 0.02, 0.75);
    const deepStrength = THREE.MathUtils.smoothstep(progress, 0.3, 1);

    panelMaterials.forEach((material, index) => {
      const target = (0.03 + index * 0.012) * ambientStrength;
      material.opacity = THREE.MathUtils.damp(material.opacity, target, 4.5, delta);
    });

    strutMaterials.forEach((material, index) => {
      const target = (0.02 + index * 0.01) * deepStrength;
      material.opacity = THREE.MathUtils.damp(material.opacity, target, 5, delta);
    });
  });

  return (
    <group>
      {PANEL_CONFIGS.map((config, index) => (
        <mesh
          key={`ambient-panel-${index}`}
          position={config.position}
          rotation={config.rotation}
          scale={config.scale}
          material={panelMaterials[index]}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}

      {STRUT_CONFIGS.map((config, index) => (
        <mesh
          key={`ambient-strut-${index}`}
          position={config.position}
          scale={config.scale}
          material={strutMaterials[index]}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
};
