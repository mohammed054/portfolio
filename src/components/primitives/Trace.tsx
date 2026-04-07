'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/colorSystem';
import { DataPacket } from './DataPacket';

export interface TraceProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: number;
  speed?: number;
  active?: boolean;
  packets?: number;
}

export const Trace = ({
  start,
  end,
  color = COLORS.blue,
  speed = 1,
  active = true,
  packets = 4,
}: TraceProps) => {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [end, start]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: active ? 0.26 : 0.06,
      }),
    [active, color]
  );
  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  useFrame((_, delta) => {
    material.opacity = THREE.MathUtils.damp(
      material.opacity,
      active ? 0.26 : 0.06,
      8,
      delta
    );
  });

  return (
    <group>
      <primitive object={line} />
      <DataPacket start={start} end={end} speed={speed} color={color} count={packets} active={active} />
    </group>
  );
};
