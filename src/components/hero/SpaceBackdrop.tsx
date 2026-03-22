'use client';

/**
 * SpaceBackdrop
 * Pure black deep space. Zero gradients, zero orange, zero side vignette.
 * Only a hair of blue galactic-core nebula at the absolute centre.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpaceBackdrop({ opacity }: { opacity: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: opacity } },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying vec3 vPos;
          void main() {
            // Absolute void
            vec3 col = vec3(0.0);
            // Tiny blue nebula at galactic core — no horizontal bleed
            float r = length(vPos.xz);
            float core = smoothstep(0.7, 0.0, r) * smoothstep(0.9, 0.0, abs(vPos.y));
            col += vec3(0.008, 0.018, 0.055) * core * 0.35;
            gl_FragColor = vec4(col, uOpacity);
          }
        `,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame(() => {
    if (mat.current) mat.current.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh>
      <sphereGeometry args={[280, 24, 24]} />
      <primitive object={material} ref={mat} attach="material" />
    </mesh>
  );
}
