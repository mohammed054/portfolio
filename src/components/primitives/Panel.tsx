'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, getStateThreeColor, THREE_COLORS } from '@/lib/colorSystem';
import { useSystemStore } from '@/store/systemStore';

export interface PanelProps {
  width: number;
  height: number;
  depth?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  edgeIntensity?: number;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const Panel = ({
  width,
  height,
  depth = 0.05,
  position,
  rotation = [0, 0, 0],
  edgeIntensity = 0.35,
  active = false,
  onClick,
  children,
}: PanelProps) => {
  const activeStrength = useRef(0);
  const hoverStrength = useRef(0);
  const isHovering = useRef(false);
  const setCursorContext = useSystemStore((state) => state.setCursorContext);

  const geometry = useMemo(() => new THREE.BoxGeometry(width, height, depth), [depth, height, width]);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  const surfaceMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.panel,
        transparent: true,
        opacity: 0,
      }),
    []
  );
  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: COLORS.panelEdge,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useFrame((_, delta) => {
    const state = useSystemStore.getState().status.state;
    const accent = getStateThreeColor(state);
    const baseColor = THREE_COLORS.panel.clone();
    const accentMix = (active ? 0.12 : 0) + hoverStrength.current * 0.08;

    activeStrength.current = THREE.MathUtils.damp(
      activeStrength.current,
      active ? 1 : 0,
      7,
      delta
    );
    hoverStrength.current = THREE.MathUtils.damp(
      hoverStrength.current,
      isHovering.current ? 1 : 0,
      10,
      delta
    );

    baseColor.lerp(accent, accentMix);
    surfaceMaterial.color.copy(baseColor);
    surfaceMaterial.opacity = 0.08 + activeStrength.current * 0.78 + hoverStrength.current * 0.08;

    edgeMaterial.color.copy(THREE_COLORS.panelEdge).lerp(
      accent,
      activeStrength.current * edgeIntensity + hoverStrength.current * 0.18
    );
    edgeMaterial.opacity = 0.16 + activeStrength.current * 0.62 + hoverStrength.current * 0.18;
  });

  return (
    <group position={position} rotation={rotation as unknown as THREE.Euler}>
      <mesh
        geometry={geometry}
        material={surfaceMaterial}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.();
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          isHovering.current = true;
          if (onClick) {
            setCursorContext('view');
          }
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          isHovering.current = false;
          setCursorContext('default');
        }}
      />
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} />
      {children ? <group position={[0, 0, depth * 0.6]}>{children}</group> : null}
    </group>
  );
};
