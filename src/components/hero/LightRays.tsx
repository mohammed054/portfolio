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
varying vec2  vUv;

#define PI 3.14159265359

// ── Noise utilities ──────────────────────────────────────────────────────
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 74.5);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),            hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i+vec2(0.,1.)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

mat2 rot2(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

// 5-octave FBM — Cartesian space, no seam possible
float fbm(vec2 p) {
  float v = 0.0, a = 0.52;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p  = rot2(0.47) * p * 2.07;
    a *= 0.48;
  }
  return v;
}

// Domain-warped FBM for richer plasma tendrils
float wfbm(vec2 p) {
  vec2 q = vec2(fbm(p + vec2(2.1, 8.4)),
                fbm(p + vec2(7.8, 1.6)));
  return fbm(p + 2.2 * q);
}

void main() {
  vec2 uv = vUv - 0.5;
  float r  = length(uv);

  // ── Absolute black event horizon ──────────────────────────────────────
  // hR corresponds to BH sphere radius 2.70 / plane scale 48 ≈ 0.056
  float hR = 0.056;
  if (r < hR) { gl_FragColor = vec4(0.0); return; }

  // ── Elliptical disk — tilted perspective ──────────────────────────────
  // Squash Y to simulate viewing the disk at ~25° above equatorial plane.
  // This is how the reference image looks: wide across, narrow top-bottom.
  float SQUASH = 0.36;
  vec2  dUV = vec2(uv.x, uv.y / SQUASH);
  float rD  = length(dUV);

  float dInner = 0.060;
  float dOuter = 0.500;

  float diskMask = smoothstep(dInner, dInner * 2.4, rD)
                 * smoothstep(dOuter, dOuter * 0.40, rD);

  // ── Lensing arc — back disk bends OVER the top, not around the sides ─
  // Real GR: photons from the far side of the disk are bent over the BH
  // and appear as a bright arc visible ABOVE the event horizon.
  float arcR    = 0.080;              // radius of arc in UV space
  float arcW    = 0.016;              // arc width (tight = realistic)
  float arcDist = abs(r - arcR);
  float lensArc = exp(-pow(arcDist / arcW, 2.0))
                * smoothstep(-0.008, 0.038, uv.y)   // top half only
                * smoothstep(0.26,   0.055, r);      // near sphere only

  // Early bail — nothing to draw
  if (diskMask < 0.001 && lensArc < 0.001) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // ── SEAMLESS rotating fiber texture (rotation matrix, ZERO atan) ──────
  // Keplerian differential rotation: inner orbits faster
  float base1 = 0.040 / max(rD, dInner);
  float base2 = 0.066 / max(rD, dInner);

  vec2 s1 = rot2(uTime * base1)         * dUV;   // main rotation
  vec2 s2 = rot2(uTime * base2 + 1.10)  * dUV;   // counter-phase
  vec2 s3 = rot2(uTime * base1 * 0.55)  * dUV;   // slow outer arm

  // Multi-scale plasma streaks
  float n1 = wfbm(s1 * 7.5  + vec2(1.3, 2.7));
  float n2 = fbm (s2 * 13.5 + vec2(5.1, 3.2));
  float n3 = fbm (s3 * 4.5  + vec2(0.0, 7.1));

  float fibers = pow(max(0.0, n1 - 0.26), 1.40) * 3.2
               + pow(max(0.0, n2 - 0.36), 1.25) * 1.8
               + pow(max(0.0, n3 - 0.30), 1.70) * 1.5;

  // ── Doppler asymmetry ─────────────────────────────────────────────────
  // In the reference: left side (approaching) is noticeably brighter
  float dopplerCos = uv.x / max(r, 0.001);
  float doppler    = 0.68 + 0.52 * (-dopplerCos);

  // ── Back-disk occlusion (bottom close to center) ──────────────────────
  // The part of the disk DIRECTLY behind the BH should be hidden.
  // Only the lensing arc reveals that region, bent over the top.
  float behindBH = smoothstep(0.0, 0.18, -uv.y)
                 * smoothstep(hR * 5.5, hR * 1.4, r);
  float vis = 1.0 - behindBH * 0.92;

  // ── Radial turbulence (breaks up uniform look) ────────────────────────
  float turb = 0.86 + 0.14 * sin(rD * 32.0 - uTime * 1.6)
                    + 0.06 * sin(rD * 68.0 - uTime * 2.8);

  // ── Color palette — matches reference image ───────────────────────────
  // Thin hot inner rim → amber → orange → dark rust → near-black edge
  vec3 cHot    = vec3(1.00, 0.94, 0.74);   // white-amber inner rim
  vec3 cAmber  = vec3(0.92, 0.60, 0.14);   // amber
  vec3 cOrange = vec3(0.64, 0.26, 0.04);   // deep orange
  vec3 cRust   = vec3(0.26, 0.08, 0.01);   // dark rust
  vec3 cEdge   = vec3(0.06, 0.01, 0.00);   // near-black outer edge

  float t  = clamp((rD - dInner) / (dOuter - dInner), 0.0, 1.0);
  vec3 col = mix(cHot,    cAmber,  smoothstep(0.0,  0.18, t));
  col      = mix(col,     cOrange, smoothstep(0.15, 0.46, t));
  col      = mix(col,     cRust,   smoothstep(0.40, 0.74, t));
  col      = mix(col,     cEdge,   smoothstep(0.68, 0.96, t));

  // ── Disk intensity — DARK and cinematic, NOT a sun ────────────────────
  float diskI = fibers * diskMask * doppler * vis * turb * uStrength;
  diskI = clamp(diskI * 0.22, 0.0, 0.78);   // << key multiplier, keep low

  // ── Lens arc — thin and bright but not overwhelming ───────────────────
  vec3  arcCol = mix(cHot, cAmber, 0.5);
  float arcI   = clamp(lensArc * 0.72 * uStrength, 0.0, 0.68);

  // ── Final composite ───────────────────────────────────────────────────
  vec3 finalCol = col * diskI + arcCol * arcI;

  // Reinhard tone-mapping per-channel — prevents any sun / bloom blowout
  finalCol = finalCol / (finalCol + vec3(0.52));

  float alpha = clamp(max(diskI, arcI) * 0.90, 0.0, 1.0);

  // Soft shadow at the very inner edge (ISCO)
  float innerGlow = smoothstep(dInner * 2.6, dInner * 1.0, rD);
  finalCol += vec3(0.55, 0.28, 0.06) * innerGlow * 0.12 * uStrength;

  gl_FragColor = vec4(finalCol, alpha);
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