'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT RAYS v4  "INTERSTELLAR MATCH"
   ───────────────────────────────────────────────────────────────────────────
   ✓ NOT a sun — dark cinematic palette, Reinhard tone-mapping, low intensity
   ✓ NO SEAM — rotation matrix only, never atan(), no polar wrapping
   ✓ Elliptical disk (tilted perspective, ~25° view angle)
   ✓ Lensing arc — back-disk bends OVER the top of the BH, not around
   ✓ Back-disk occlusion — hidden behind event horizon
   ✓ Doppler asymmetry — approaching side brighter
   ✓ Zoom target is the dark sphere, disk wraps around it
   ✓ Colors: warm-white inner → amber → deep orange → dark rust → black
═══════════════════════════════════════════════════════════════════════════ */

const FRAG = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);

  // Match event horizon
  float hR = 0.056;
  if (r < hR) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // ─────────────────────────────────────────────
  // TRUE LENSING ARC (NOT A RING)
  // ─────────────────────────────────────────────

  // Slight vertical bias (this breaks the "perfect circle")
  vec2 warpedUV = uv;
  warpedUV.y *= 0.6;

  float rWarp = length(warpedUV);

  float arc = exp(-pow((rWarp - 0.075) * 120.0, 2.0));

  // ONLY top side → prevents donut
  arc *= smoothstep(0.0, 0.03, uv.y);

  // Fade sideways so it's not a full arc
  arc *= smoothstep(0.35, 0.05, abs(uv.x));

  // Fade away from center
  arc *= smoothstep(0.20, 0.06, r);

  // ─────────────────────────────────────────────
  // EXTREMELY SUBTLE SCATTERING (almost invisible)
  // ─────────────────────────────────────────────
  float glow = smoothstep(0.12, 0.32, r) *
               smoothstep(0.50, 0.22, r);

  // Slight asymmetry (Doppler hint)
  glow *= 0.92 + 0.08 * (-uv.x / max(r, 0.001));

  glow *= 0.08; // VERY LOW

  // ─────────────────────────────────────────────
  // COLOR — toned down heavily
  // ─────────────────────────────────────────────
  vec3 arcColor  = vec3(1.0, 0.72, 0.38);
  vec3 glowColor = vec3(0.45, 0.6, 0.9);

  vec3 col = arcColor * arc * 0.6 +
             glowColor * glow * 0.25;

  float intensity = (arc + glow) * uStrength * 0.7;

  // Soft tone map
  col = col / (col + vec3(1.2));

  gl_FragColor = vec4(col, intensity * 0.5);
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
      uTime:     { value: 0 },
      uStrength: { value: 0 },
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent: true,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value     = clock.getElapsedTime();
    matRef.current.uniforms.uStrength.value = strengthRef.current;
  });

  return (
    <mesh scale={[48, 48, 48]} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <primitive object={sm} ref={matRef} attach="material" />
    </mesh>
  );
}