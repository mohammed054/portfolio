'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlackHoleModel() {
  const group = useRef<THREE.Group>(null!);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },

      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,

      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;

        // ───────── NOISE ─────────
        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
        }

        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);

          float a = hash(i);
          float b = hash(i + vec2(1.,0.));
          float c = hash(i + vec2(0.,1.));
          float d = hash(i + vec2(1.,1.));

          vec2 u = f*f*(3.-2.*f);

          return mix(a,b,u.x) +
                 (c-a)*u.y*(1.-u.x) +
                 (d-b)*u.x*u.y;
        }

        float fbm(vec2 p){
          float v = 0.;
          float a = .5;
          for(int i=0;i<5;i++){
            v += a * noise(p);
            p *= 2.;
            a *= .5;
          }
          return v;
        }

        void main(){
          vec2 uv = vUv - 0.5;

          float r = length(uv);
          float angle = atan(uv.y, uv.x);

          // ───────── GRAVITY WELL (stronger core) ─────────
          float gravity = 0.25 / (r + 0.04);
          angle += gravity;

          // ───────── ROTATION FIELD ─────────
          float spin = angle + r * 12.0 - uTime * 2.2;

          // ───────── TURBULENCE ─────────
          float turb = fbm(vec2(spin * 2.2, r * 9.0 - uTime * 0.6));

          // ───────── ACCRETION DISK ─────────
          float disk =
            smoothstep(0.65, 0.28, r) *
            smoothstep(0.07, 0.22, r);

          // ───────── PHOTON RING (sharper + brighter) ─────────
          float photon =
            smoothstep(0.21, 0.17, r) *
            smoothstep(0.17, 0.23, r) * 2.2;

          // ───────── RELATIVISTIC DOPPLER ─────────
          float doppler = sin(angle + uTime * 1.8);

          vec3 blue = vec3(0.3, 0.7, 1.2);
          vec3 red  = vec3(1.3, 0.5, 0.2);

          vec3 dopplerCol = mix(red, blue, doppler * 0.5 + 0.5);

          // ───────── BASE COLOR ─────────
          vec3 base = mix(vec3(1.0,0.85,0.5), dopplerCol, turb);

          // ───────── INTENSITY ─────────
          float intensity =
            disk * (0.8 + turb * 1.6) +
            photon;

          intensity *= smoothstep(0.8, 0.2, r);

          gl_FragColor = vec4(base * intensity, intensity);
        }
      `,

      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <primitive object={material} attach="material" />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.4, 128, 128]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}