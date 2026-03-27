'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
══════════════════════════════════════════════════════════════════
BLACKHOLE DISK — SEAMLESS / NO GLOW / NO RINGS
══════════════════════════════════════════════════════════════════
*/

const FRAG = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

/* hash */
float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

/* noise */
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);

  return mix(
    mix(hash(i), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

/* MOBILE SAFE FBM */
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for(int i=0;i<3;i++){
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main(){

  vec2 uv = vUv - 0.5;
  float r = length(uv);

  float inner = 0.16;
  float outer = 0.55;

  if(r < inner || r > outer){
    gl_FragColor = vec4(0.0);
    return;
  }

  /* ---------- SEAMLESS FLOW (NO ANGLE WRAP) ---------- */
  vec2 flow = normalize(uv);

  /* tangential direction */
  vec2 tangent = vec2(-flow.y, flow.x);

  /* rotation without polar seam */
  float speed = 0.12 / (r + 0.2);
  vec2 p = uv + tangent * uTime * speed;

  /* domain scale */
  p *= 3.0;

  float n = fbm(p);
  float streak = smoothstep(0.45, 0.75, n);

  /* radial fade */
  float fadeInner = smoothstep(inner, inner + 0.03, r);
  float fadeOuter = smoothstep(outer, outer - 0.05, r);
  float mask = fadeInner * fadeOuter;

  /* dark cinematic palette */
  vec3 c1 = vec3(0.28, 0.10, 0.02);
  vec3 c2 = vec3(0.55, 0.20, 0.04);
  vec3 c3 = vec3(0.75, 0.32, 0.08);

  vec3 col = mix(c1, c2, smoothstep(inner, 0.35, r));
  col = mix(col, c3, smoothstep(0.30, outer, r));

  float intensity = streak * mask * 0.65;

  vec3 finalCol = col * intensity;

  /* filmic clamp (no glow) */
  finalCol = finalCol / (1.0 + finalCol);

  gl_FragColor = vec4(finalCol, intensity * 0.8);
}
`;

const VERT = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

export default function LightRays({
  strengthRef
}: {
  strengthRef: React.MutableRefObject<number>
}) {

  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const material = useMemo(() =>
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0 }
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    }), []
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
      matRef.current.uniforms.uStrength.value = strengthRef.current;
    }
  });

  return (
    <mesh scale={[60,60,60]} renderOrder={1}>
      <planeGeometry args={[1,1]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}