'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT RAYS v2  "BLENDER QUALITY"
   ───────────────────────────────────────────────────────────────────────────
   ✓ Two independent ray families (14 primary + 9 secondary at offset angle)
   ✓ Per-ray brightness variation (no uniform flat bands)
   ✓ Three-zone colour: warm amber inner → white mid → cool cyan outer
   ✓ Volumetric scattering falloff (more realistic depth)
   ✓ Time-varying ray rotation at slightly different speeds (differential drag)
   ✓ Subtle ray-edge chromatic fringe (dispersion near BH)
   ✓ Radial intensity turbulence (rays not perfectly smooth)
═══════════════════════════════════════════════════════════════════════════ */

const FRAG = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
#define PI 3.14159265358979

// Simple hash for per-ray brightness variation
float hash1(float n){ return fract(sin(n) * 43758.5453); }

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  // Clip inner void and outer fade
  if(r < 0.028 || r > 0.48){ gl_FragColor = vec4(0.); return; }

  // ── Ray family A (14 primary rays) ────────────────────────────────────
  float nA   = 14.0;
  float rotA = a + uTime * 0.048;
  // Wrap angle to [0,2π] then find nearest ray
  float fracA = mod(rotA * nA / (PI * 2.0), 1.0);
  float rayA  = pow(max(0.0, cos(fracA * PI * 2.0)), 18.0);
  float rayA2 = pow(max(0.0, cos(fracA * PI * 2.0)), 38.0) * 0.42;

  // ── Ray family B (9 secondary rays, offset rotation speed) ────────────
  float nB   = 9.0;
  float rotB = a + uTime * 0.072 + PI / nB;  // phase offset + different speed
  float fracB = mod(rotB * nB / (PI * 2.0), 1.0);
  float rayB  = pow(max(0.0, cos(fracB * PI * 2.0)), 24.0) * 0.55;

  // ── Per-ray brightness variation using hash on nearest ray index ───────
  float rayIdxA = floor(mod(rotA * nA / (PI * 2.0), nA));
  float rayIdxB = floor(mod(rotB * nB / (PI * 2.0), nB));
  float brightA = 0.72 + 0.28 * hash1(rayIdxA + 0.5);
  float brightB = 0.60 + 0.40 * hash1(rayIdxB + 7.3);

  // ── Radial falloff (volumetric scattering profile) ─────────────────────
  // Inner ramp: rays emerge from edge of accretion disk (not from void)
  // Outer ramp: rays fade as photons escape gravity well
  float fallInner = smoothstep(0.028, 0.11, r);   // ramp up from inner edge
  float fallOuter = smoothstep(0.48, 0.11, r);    // ramp down at outer edge
  float fall      = fallInner * fallOuter;

  // ── Combined ray intensity ─────────────────────────────────────────────
  float rayTotal = ((rayA + rayA2) * brightA + rayB * brightB) * fall;

  // ── Radial turbulence (rays not perfectly smooth along radius) ─────────
  float turb = 0.88 + 0.12 * sin(r * 38.0 - uTime * 1.8)
                    + 0.06 * sin(r * 72.0 - uTime * 3.1 + a * 2.0);
  rayTotal *= turb;

  float intensity = rayTotal * uStrength;
  if(intensity < 0.001){ gl_FragColor = vec4(0.); return; }

  // ── Three-zone colour ─────────────────────────────────────────────────
  // Inner: amber/orange (synchrotron from disk)
  // Mid:   white-hot
  // Outer: cyan/teal (scattered starlight + relativistic beaming)
  vec3 warm = vec3(1.10, 0.75, 0.30);
  vec3 white= vec3(1.00, 0.95, 0.85);
  vec3 cool = vec3(0.42, 0.70, 1.05);

  float t1 = smoothstep(0.028, 0.18, r);  // warm → white
  float t2 = smoothstep(0.15, 0.40, r);   // white → cool
  vec3 col  = mix(warm, white, t1);
  col       = mix(col,  cool,  t2);

  // ── Chromatic fringe (dispersion): outermost edge gets bluer ──────────
  float fringe = smoothstep(0.32, 0.46, r) * 0.25;
  col = mix(col, vec3(0.25, 0.62, 1.20), fringe);

  gl_FragColor = vec4(col * intensity, intensity * 0.90);
}`;

const VERT = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

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