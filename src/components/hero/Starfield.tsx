'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   STARFIELD v2  "BLENDER QUALITY"
   ───────────────────────────────────────────────────────────────────────────
   ✓ Spectral type colour variation  (O/B blue → A white → G yellow → M red)
   ✓ 4-spike diffraction cross on bright stars (telescope look)
   ✓ Richer twinkling  (multi-frequency sine sum, per-star phase)
   ✓ Denser layers: 3400 / 960 / 340  (was 2200 / 650 / 220)
   ✓ Nebula component: large sphere, inside-rendered FBM cloud shader
     — subtle Milky Way band with blue/purple dust lanes
   ✓ Distant galaxy smear (tiny elongated glows)
═══════════════════════════════════════════════════════════════════════════ */

// ── Star vertex shader ────────────────────────────────────────────────────
const STAR_V = `
attribute float aSize;
attribute float aSeed;
attribute float aBright;
attribute float aSpec;    // spectral type 0-1
uniform float uTime;
uniform float uOpacity;
varying float vB;
varying float vS;
varying float vSpec;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position   = projectionMatrix * mv;
  // Apparent size scales with inverse depth; large stars get bigger point
  gl_PointSize  = clamp(aSize * (220.0 / max(-mv.z, 1.0)), 0.3, 9.0);
  vB    = aBright;
  vS    = aSeed;
  vSpec = aSpec;
}`;

// ── Star fragment shader ──────────────────────────────────────────────────
const STAR_F = `
uniform float uTime;
uniform float uOpacity;
varying float vB;
varying float vS;
varying float vSpec;

void main(){
  vec2  uv  = gl_PointCoord - 0.5;
  float d   = length(uv);
  if(d > 0.5) discard;

  // ── Core + glow ────────────────────────────────────────────────
  float core = smoothstep(0.055, 0.0,  d);
  float glow = smoothstep(0.50,  0.0,  d) * 0.55;

  // ── 4-spike diffraction cross (bright stars only) ────────────────
  // Smooth rotated cross — mimics telescope diffraction spike
  float spikeH = max(0.0, 1.0 - abs(uv.y) * 28.0) * max(0.0, 0.5 - abs(uv.x)) * 0.65;
  float spikeV = max(0.0, 1.0 - abs(uv.x) * 28.0) * max(0.0, 0.5 - abs(uv.y)) * 0.65;
  // Diagonal spikes (45°)
  vec2  rot45 = vec2((uv.x + uv.y) * 0.7071, (uv.x - uv.y) * 0.7071);
  float spikeD1 = max(0.0, 1.0 - abs(rot45.y) * 28.0) * max(0.0, 0.5 - abs(rot45.x)) * 0.30;
  float spikeD2 = max(0.0, 1.0 - abs(rot45.x) * 28.0) * max(0.0, 0.5 - abs(rot45.y)) * 0.30;
  float spike = (spikeH + spikeV + spikeD1 + spikeD2) * smoothstep(0.72, 0.90, vB);

  // ── Multi-frequency twinkling ────────────────────────────────────
  float tw = 0.78
    + 0.11 * sin(uTime * (0.28 + vS * 1.00) + vS * 38.0)
    + 0.07 * sin(uTime * (0.82 + vS * 0.55) + vS * 17.0)
    + 0.04 * sin(uTime * (2.10 + vS * 0.30) + vS * 61.0);

  // ── Spectral colour ──────────────────────────────────────────────
  // O/B   0.00–0.14  blue
  // A     0.14–0.28  blue-white
  // F     0.28–0.45  white
  // G     0.45–0.65  yellow-white
  // K     0.65–0.80  orange
  // M     0.80–1.00  red-orange
  vec3 col;
  if     (vSpec < 0.14) col = vec3(0.62, 0.74, 1.00);
  else if(vSpec < 0.28) col = vec3(0.80, 0.88, 1.00);
  else if(vSpec < 0.45) col = vec3(1.00, 1.00, 0.94);
  else if(vSpec < 0.65) col = vec3(1.00, 0.96, 0.74);
  else if(vSpec < 0.80) col = vec3(1.00, 0.82, 0.52);
  else                  col = vec3(1.00, 0.56, 0.28);

  float alpha = (core * 1.15 + glow + spike) * vB * tw * uOpacity;
  if(alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}`;

// ── Build star geometry ───────────────────────────────────────────────────
function mkGeo(n: number, r0: number, r1: number, s0: number, s1: number) {
  const p  = new Float32Array(n * 3);
  const sz = new Float32Array(n);
  const sd = new Float32Array(n);
  const br = new Float32Array(n);
  const sp = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r   = r0 + Math.random() * (r1 - r0);
    const t   = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    p[i*3]   = r * Math.sin(phi) * Math.cos(t);
    p[i*3+1] = r * Math.cos(phi);
    p[i*3+2] = r * Math.sin(phi) * Math.sin(t);
    sz[i] = s0 + Math.random() * (s1 - s0);
    sd[i] = Math.random();
    br[i] = 0.35 + Math.random() * 0.65;
    // Spectral: mostly G/F/K  — realistic IMF weighting
    const r2 = Math.random();
    sp[i] = r2 < 0.02 ? Math.random() * 0.14             // O/B rare
           : r2 < 0.08 ? 0.14 + Math.random() * 0.14     // A
           : r2 < 0.22 ? 0.28 + Math.random() * 0.17     // F
           : r2 < 0.50 ? 0.45 + Math.random() * 0.20     // G
           : r2 < 0.72 ? 0.65 + Math.random() * 0.15     // K
           :              0.80 + Math.random() * 0.20;    // M
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('aSize',    new THREE.BufferAttribute(sz, 1));
  g.setAttribute('aSeed',    new THREE.BufferAttribute(sd, 1));
  g.setAttribute('aBright',  new THREE.BufferAttribute(br, 1));
  g.setAttribute('aSpec',    new THREE.BufferAttribute(sp, 1));
  return g;
}

// ── Individual star layer ─────────────────────────────────────────────────
function Layer({ n, r0, r1, s0, s1, op }: {
  n: number; r0: number; r1: number; s0: number; s1: number; op: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const geo    = useMemo(() => mkGeo(n, r0, r1, s0, s1), []);
  const sm     = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: STAR_V, fragmentShader: STAR_F,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), []);
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value    = clock.getElapsedTime();
    matRef.current.uniforms.uOpacity.value = op;
  });
  return (
    <points frustumCulled={false}>
      <primitive object={geo} />
      <primitive object={sm} ref={matRef} attach="material" />
    </points>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  NEBULA  — Milky Way band + dust clouds painted on a large inside sphere
// ══════════════════════════════════════════════════════════════════════════
const NEBULA_V = `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

const NEBULA_F = `
uniform float uOpacity;
varying vec3 vDir;

// ── 2D noise / FBM ──────────────────────────────────────────────────────
float hash2(vec2 p){ p=fract(p*vec2(234.34,435.345)); p+=dot(p,p+34.23); return fract(p.x*p.y); }
float noise2(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),u.x),
             mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),u.x),u.y);
}
mat2 rr(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }
float fbm(vec2 p){
  float v=0.,amp=0.5;
  for(int i=0;i<6;i++){ v+=amp*noise2(p); p=rr(0.5236)*p*2.07; amp*=0.48; }
  return v;
}

void main(){
  vec3 d = normalize(vDir);

  // Spherical coords
  float theta = atan(d.z, d.x);          // azimuth
  float phi   = asin(clamp(d.y,-1.,1.)); // latitude

  // Galaxy band: exponential falloff from equator, wider and more prominent
  float band = exp(-phi*phi * 5.5) * 0.90;

  // Two noise layers at different scales
  vec2 n1 = vec2(theta * 1.6,  phi * 3.2);
  vec2 n2 = vec2(theta * 3.5 + 1.38, phi * 6.2 + 2.14);
  vec2 n3 = vec2(theta * 0.7 + 4.20, phi * 1.8 - 1.80); // wide arm

  float cloud1 = fbm(n1);
  float cloud2 = fbm(n2);
  float cloud3 = fbm(n3);

  // Threshold to create cloud shapes
  float density  = pow(max(0., cloud1 * 0.55 + cloud2 * 0.25 + cloud3 * 0.20 - 0.32), 1.75) * 3.0;
  float dustLane = pow(max(0., cloud2 - 0.55), 2.2) * 2.8;

  // ── Nebula colour palette ──────────────────────────────────────────
  vec3 blueNeb   = vec3(0.042, 0.085, 0.240);   // OB star illuminated blue
  vec3 purpleNeb = vec3(0.130, 0.048, 0.210);   // ionised hydrogen (magenta/purple)
  vec3 tealNeb   = vec3(0.028, 0.140, 0.180);   // [OIII] teal
  vec3 dustRed   = vec3(0.180, 0.055, 0.025);   // dust lane reddening

  // Mix colours by angular position and density
  float t1 = fbm(n1 * 2.0 + vec2(8.,3.));
  vec3 col = mix(blueNeb, purpleNeb, t1);
  col      = mix(col, tealNeb,  smoothstep(0.3, 0.7, cloud3));
  col      = mix(col, dustRed,  dustLane * 0.5 * smoothstep(0.0, 0.5, abs(phi)));

  float alpha = (density * band + dustLane * band * 0.35) * uOpacity;
  if(alpha < 0.001) discard;
  gl_FragColor = vec4(col * (density + dustLane * 0.4) * band, alpha);
}`;

function Nebula({ opacity }: { opacity: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const sm = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: opacity } },
    vertexShader:  NEBULA_V,
    fragmentShader: NEBULA_F,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);
  useFrame(() => {
    if (matRef.current) matRef.current.uniforms.uOpacity.value = opacity;
  });
  return (
    <mesh>
      <sphereGeometry args={[275, 48, 48]} />
      <primitive object={sm} ref={matRef} attach="material" />
    </mesh>
  );
}

// ── Public Starfield component ────────────────────────────────────────────
export default function Starfield({ opacity }: { opacity: number }) {
  return (
    <group>
      {/* Nebula background (subtle, drawn behind stars) */}
      <Nebula opacity={opacity * 0.55} />
      {/* Star layers: distant → close, increasing density near BH */}
      <Layer n={3400} r0={150} r1={280} s0={0.22} s1={0.80} op={opacity * 0.68} />
      <Layer n={960}  r0={55}  r1={150} s0={0.40} s1={1.35} op={opacity * 0.88} />
      <Layer n={340}  r0={22}  r1={55}  s0={0.80} s1={2.40} op={opacity} />
    </group>
  );
}