'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '@/lib/colorSystem';

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME
// An extruded rectangular channel form.
// Semi-transparent fill + wireframe edges — feels hollow, structural.
// Used in ProcessingState for deep-layer channels.
// ─────────────────────────────────────────────────────────────────────────────

export interface VolumeProps {
  width:    number;
  height:   number;
  depth:    number;
  position: [number, number, number];
  rotation?: [number, number, number];
  color?:   number;
  opacity?: number;
}

export const Volume = ({
  width,
  height,
  depth,
  position,
  rotation = [0, 0, 0],
  color   = COLORS.panel,
  opacity = 0.15,
}: VolumeProps) => {
  const geometry  = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);
  const edgeGeom  = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  const fillMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.BackSide, // inside visible
      }),
    [color, opacity]
  );

  const wireMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color:       COLORS.panelEdge,
        transparent: true,
        opacity:     0.4,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation as unknown as THREE.Euler}>
      {/* Inner face fill */}
      <mesh geometry={geometry} material={fillMat} />
      {/* Edge wireframe */}
      <lineSegments geometry={edgeGeom} material={wireMat} />
    </group>
  );
};
