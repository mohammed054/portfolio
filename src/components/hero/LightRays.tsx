'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FRAG = `
uniform float uStrength;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);

  // Event horizon cutoff
  float hR = 0.056;
  if (r < hR) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // ─────────────────────────────
  // LENSING ARC (optimized)
  // ─────────────────────────────

  vec2 w = uv;
  w.y *= 0.62; // slight ellipse

  float rw = length(w);
  float d  = (rw - 0.075) * 120.0;

  float arc = exp(-(d * d));

  // top-only (clean cutoff)
  arc *= smoothstep(0.0, 0.025, uv.y);

  // horizontal taper (less spread)
  arc *= smoothstep(0.32, 0.06, abs(uv.x));

  // radial containment
  arc *= smoothstep(0.18, 0.065, r);

  // sharpen slightly
  arc = pow(arc, 1.15);

  // ─────────────────────────────
  // SUBTLE SCATTER
  // ─────────────────────────────

  float glow = smoothstep(0.14, 0.30, r) *
               smoothstep(0.48, 0.24, r);

  float invR = 1.0 / max(r, 0.001);

  // stable doppler bias
  float doppler = clamp(-uv.x * invR * 0.5 + 0.5, 0.0, 1.0);

  glow *= mix(0.88, 1.05, doppler);
  glow *= 0.06; // lower than before

  // ─────────────────────────────
  // COLOR
  // ─────────────────────────────

  vec3 arcColor  = vec3(1.0, 0.70, 0.36);
  vec3 glowColor = vec3(0.42, 0.55, 0.85);

  vec3 col = arcColor * arc * 0.55 +
             glowColor * glow * 0.22;

  float intensity = (arc + glow) * uStrength;

  // Reinhard tone mapping (tighter)
  col = col / (col + vec3(1.0));

  // cleaner alpha falloff (prevents bloom stacking)
  float alpha = intensity * 0.45;

  gl_FragColor = vec4(col, alpha);
}
`;

const VERT = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function LightRays({ strengthRef }: { strengthRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const sm = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uStrength: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uStrength.value = strengthRef.current;
  });

  return (
    <mesh scale={[48, 48, 48]} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <primitive object={sm} ref={matRef} attach="material" />
    </mesh>
  );
}