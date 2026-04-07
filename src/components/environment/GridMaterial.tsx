'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THREE_COLORS } from '@/lib/colorSystem';
import { useSystemStore } from '@/store/systemStore';
import gridFragmentShader from '@/shaders/grid.frag';
import gridVertexShader from '@/shaders/grid.vert';

export const useGridMaterial = (): THREE.ShaderMaterial => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: gridVertexShader,
        fragmentShader: gridFragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uGridColor: { value: THREE_COLORS.bgGrid.clone() },
          uBgColor: { value: THREE_COLORS.bg.clone() },
        },
        depthWrite: true,
        depthTest: true,
        transparent: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uProgress.value = useSystemStore.getState().progress;
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return material;
};
