'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   BLACK HOLE MODEL v11  "INTERSTELLAR"
   ═══════════════════════════════════════════════════════════════════════════
   Visual targets (matching reference image):
   ✓ Blazing orange → gold → white-hot accretion disk with plasma streaming
   ✓ 4× brighter overall — no more dull/dark disk
   ✓ Domain-warped FBM fiber tendrils (Interstellar plasma streamlines)
   ✓ Very prominent ISCO super-blaze at inner edge
   ✓ Strong Doppler asymmetry — one side blazing, other dimmed
   ✓ Photon ring stack visible and glowing
   ✓ Wide outer dust halo fading to deep rust/brown
   ✓ Absolute black event horizon — maximum contrast
   ✓ Relativistic jet bright blue-white
   ✓ frustumCulled=false throughout — no edge clipping
   ✓ 6-octave FBM max for performance — no GPU stall
═══════════════════════════════════════════════════════════════════════════ */

// ── Shared vertex shader ──────────────────────────────────────────────────
const VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`;

// ── Accretion disk fragment shader — Interstellar quality ─────────────────
const DISK_FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform float uSide;

#define PI  3.14159265358979
#define TAU 6.28318530717959

// ── Noise utilities ──────────────────────────────────────────────────────
float hash(vec2 p){
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 74.5);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),          hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)), u.x), u.y);
}
mat2 rot2(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }
float fbm(vec2 p){
  float v=0., a=0.52;
  for(int i=0;i<6;i++){
    v += a * vnoise(p);
    p  = rot2(0.4712) * p * 2.08;
    a *= 0.48;
  }
  return v;
}
// Single-warp domain FBM — plasma tendrils, cheaper than double-warp
float wfbm(vec2 p){
  vec2 q = vec2(fbm(p + vec2(2.4, 8.1)),
                fbm(p + vec2(7.2, 1.9)));
  return fbm(p + 3.0 * q);
}

void main(){
  vec2  uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  // Disk radial mask — plane is 48×48; horizon ≈ UV r 0.056
  float rInner = 0.054;
  float rOuter = (uSide == 0.0) ? 0.62 : 0.40;

  float mask = smoothstep(rInner, rInner * 2.6, r)
             * smoothstep(rOuter, rOuter * 0.22, r);
  if(uSide != 0.0) mask *= 0.28;
  if(mask < 0.001){ gl_FragColor = vec4(0.0); return; }

  // ── Keplerian co-rotation in log-polar space ──────────────────────────
  float logR  = log(max(r, 0.001));
  float omega = pow(max(r, 0.055), -1.5);
  float phase = a + omega * uTime * 0.13;
  vec2  lpUV  = vec2(phase / TAU, -logR * 3.0 + 3.6);

  // ── Texture layers ────────────────────────────────────────────────────
  // Layer 1: large warped spiral arms
  vec2  lp1 = lpUV * vec2(3.2, 2.6) + vec2(0.0, uTime * 0.085);
  float f1   = wfbm(lp1);
  f1 = pow(max(0.0, f1 - 0.25), 1.30) * 3.4;

  // Layer 2: streaming plasma tendrils
  vec2  lp2 = lpUV * vec2(7.5, 4.8) + vec2(uTime * 0.052, 1.7);
  float f2   = wfbm(lp2);
  f2 = pow(max(0.0, f2 - 0.28), 1.15) * 4.0;

  // Layer 3: fine hot grain / knots
  vec2  lp3 = lpUV * vec2(16.0, 10.0) + vec2(-uTime * 0.038, 3.1);
  float f3   = fbm(lp3);
  f3 = pow(max(0.0, f3 - 0.40), 1.0) * 3.0;

  float eInner = smoothstep(0.26, 0.05, r);
  float eMid   = smoothstep(0.08, 0.24, r) * smoothstep(0.46, 0.12, r);
  float eOuter = smoothstep(0.22, 0.54, r) * smoothstep(0.62, 0.24, r);

  float turb = f1 * (0.50 + eInner * 0.50)
             + f2 * (0.28 + eMid   * 0.50)
             + f3 * (0.22 + eOuter * 0.30);

  // ── Doppler brightening — very pronounced for Interstellar look ────────
  float beta = clamp(sqrt(0.050 / (2.0 * max(r, 0.065))), 0.0, 0.88);
  float dPhi = a - uTime * 0.13;
  float dI   = pow(1.0 / max(1.0 - beta * cos(dPhi), 0.08), 4.2);
  float dC   = cos(dPhi) * 0.5 + 0.5;

  // ── Colour — Interstellar warm palette ────────────────────────────────
  // Inner: near-white hot → golden → amber → deep orange → rust → dark edge
  vec3 cCore   = vec3(1.00, 1.00, 0.95);   // white-hot core
  vec3 cWHot   = vec3(1.00, 0.96, 0.80);   // warm white
  vec3 cGold   = vec3(1.00, 0.84, 0.42);   // gold
  vec3 cAmber  = vec3(1.00, 0.64, 0.14);   // bright amber
  vec3 cOrange = vec3(0.88, 0.42, 0.06);   // deep orange
  vec3 cBurnt  = vec3(0.55, 0.20, 0.03);   // burnt sienna
  vec3 cRust   = vec3(0.28, 0.09, 0.01);   // deep rust
  vec3 cEdge   = vec3(0.12, 0.04, 0.00);   // near-black edge

  vec3 col = mix(cCore,   cWHot,   smoothstep(0.054, 0.078, r));
  col      = mix(col,     cGold,   smoothstep(0.072, 0.130, r));
  col      = mix(col,     cAmber,  smoothstep(0.118, 0.230, r));
  col      = mix(col,     cOrange, smoothstep(0.210, 0.360, r));
  col      = mix(col,     cBurnt,  smoothstep(0.340, 0.480, r));
  col      = mix(col,     cRust,   smoothstep(0.450, 0.580, r));
  col      = mix(col,     cEdge,   smoothstep(0.540, 0.640, r));

  // Doppler colour shift: approaching = bluer/brighter; receding = redder/darker
  col = mix(col, col * vec3(1.10, 0.76, 0.42), (1.0 - dC) * 0.38);
  col = mix(col, col + vec3(0.04, 0.08, 0.22), dC * 0.22);

  // ── Temperature envelope ──────────────────────────────────────────────
  float Tenv = clamp(pow(0.055 / max(r, 0.055), 0.70) * 1.35, 0.0, 1.0);

  // ── Intensity — 4× brighter than previous version ─────────────────────
  float iRaw    = turb * Tenv * mask * dI;
  float intensity = clamp(iRaw * 1.55, 0.0, 1.60);

  // ── Photon rings — bright and prominent ───────────────────────────────
  float ph1 = exp(-pow((r - 0.108) * 100.0, 2.0));
  float ph2 = exp(-pow((r - 0.128) *  72.0, 2.0)) * 0.65;
  float ph3 = exp(-pow((r - 0.150) *  52.0, 2.0)) * 0.38;
  float phD = 0.65 + dC * 0.95;
  col       += vec3(1.00, 0.94, 0.70) * (ph1 + ph2 + ph3) * phD * 1.60;
  intensity += (ph1 * 0.80 + ph2 * 0.42 + ph3 * 0.24) * phD;

  // ── ISCO super-blaze — white-hot inner ring ────────────────────────────
  float isco = exp(-pow((r - 0.060) * 130.0, 2.0));
  col       += vec3(1.00, 0.98, 0.94) * isco * 2.00;
  intensity += isco * 1.30;

  // ── Hot plasma blobs / prominences ────────────────────────────────────
  float b1 = max(0.0, f1 - 0.65) * 7.0 * smoothstep(0.44, 0.05, r);
  float b2 = max(0.0, f2 - 0.70) * 8.0 * smoothstep(0.32, 0.05, r);
  float b3 = max(0.0, f3 - 0.75) * 6.0 * smoothstep(0.22, 0.04, r);
  col += vec3(1.00, 0.88, 0.52) * b1 * b1
       + vec3(1.00, 0.92, 0.68) * b2 * b2
       + vec3(1.00, 0.98, 0.90) * b3 * b3;
  intensity += clamp(b1*b1*0.55 + b2*b2*0.48 + b3*b3*0.38, 0.0, 0.65);

  intensity = clamp(intensity, 0.0, 2.00);
  gl_FragColor = vec4(col * intensity, intensity);
}
`;

// ── Outer disk glow shader — wide hazy halo ───────────────────────────────
const HALO_FRAG = `
varying vec2 vUv;
uniform float uTime;

#define TAU 6.28318530717959

float hash(vec2 p){ p = fract(p * vec2(127.1,311.7)); p += dot(p,p+74.5); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
mat2 rot2(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }
float fbm(vec2 p){
  float v=0.,a=0.5;
  for(int i=0;i<4;i++){ v+=a*vnoise(p); p=rot2(0.5)*p*2.1; a*=0.50; }
  return v;
}

void main(){
  vec2  uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  float rMin = 0.20, rMax = 0.50;
  if(r < rMin || r > rMax){ gl_FragColor = vec4(0.0); return; }

  float omega = pow(max(r, 0.2), -1.4);
  float phase = a + omega * uTime * 0.10;
  vec2  lp    = vec2(phase / TAU, -log(max(r,0.001)) * 2.5 + 2.8);
  float f     = fbm(lp * vec2(2.5, 2.0) + vec2(uTime * 0.04, 0.0));
  f = pow(max(0.0, f - 0.32), 1.5) * 2.2;

  float mask = smoothstep(rMin, rMin*1.5, r) * smoothstep(rMax, rMax*0.55, r);

  // Deep amber/rust outer halo colour
  vec3 col = mix(vec3(0.72, 0.34, 0.06), vec3(0.32, 0.12, 0.02),
                 smoothstep(rMin*1.4, rMax, r));

  float intensity = f * mask * 0.55;
  intensity = clamp(intensity, 0.0, 0.55);
  gl_FragColor = vec4(col * intensity, intensity);
}
`;

// ── Relativistic jet shader ───────────────────────────────────────────────
const JET_FRAG = `
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5;
  float x = abs(p.x), y = p.y;
  float cone  = smoothstep(0.0, 0.20, 0.22 - x * (2.8 + abs(y) * 2.0));
  if(cone < 0.001){ gl_FragColor = vec4(0.0); return; }
  float wave  = 0.5 + 0.5 * sin((y * 14.0 - uTime * 3.2) * 3.14159);
  float beam  = pow(cone * wave, 2.4) * smoothstep(0.46, 0.04, abs(y));
  vec3  col   = mix(vec3(0.55, 0.78, 1.00), vec3(0.18, 0.40, 0.90), x * 5.0);
  // Blue-white core
  col = mix(col, vec3(0.90, 0.96, 1.00), smoothstep(0.06, 0.0, x));
  gl_FragColor = vec4(col * beam * 0.45, beam * 0.38);
}
`;

export default function BlackHole() {
  const groupRef = useRef<THREE.Group>(null!);

  // Main disk + two offset planes for depth
  const diskMats = useMemo(() => [0, 1, -1].map(side =>
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSide: { value: side } },
      vertexShader: VERT, fragmentShader: DISK_FRAG,
      transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    })
  ), []);

  // Outer halo disk
  const haloMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT, fragmentShader: HALO_FRAG,
    transparent: true, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide,
  }), []);

  const jetMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT, fragmentShader: JET_FRAG,
    transparent: true, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide,
  }), []);

  // Tilted photon-capture ring stack — brighter and more rings
  const rings = useMemo(() => [
    { i: 2.62, o: 14.0, t:   0, op: 0.65 },
    { i: 2.75, o: 12.0, t:   5, op: 0.35 },
    { i: 2.75, o: 12.0, t:  -5, op: 0.35 },
    { i: 2.90, o: 10.2, t:  11, op: 0.22 },
    { i: 2.90, o: 10.2, t: -11, op: 0.22 },
    { i: 3.05, o:  8.8, t:  18, op: 0.14 },
    { i: 3.05, o:  8.8, t: -18, op: 0.14 },
    { i: 3.22, o:  7.5, t:  26, op: 0.08 },
    { i: 3.22, o:  7.5, t: -26, op: 0.08 },
    { i: 3.45, o:  6.5, t:  36, op: 0.048 },
    { i: 3.45, o:  6.5, t: -36, op: 0.048 },
    { i: 3.70, o:  5.8, t:  48, op: 0.026 },
    { i: 3.70, o:  5.8, t: -48, op: 0.026 },
  ], []);

  // Warm amber rings — match the reference
  const ringMats = useMemo(() => rings.map(r =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.20, 0.72, 0.18),
      transparent: true, opacity: r.op,
      blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide,
    })
  ), [rings]);

  // Outer dust halos — wide, warm, additive
  const outerHalo1 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.90, 0.45, 0.08),
    transparent: true, opacity: 0.18,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);
  const outerHalo2 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.55, 0.22, 0.04),
    transparent: true, opacity: 0.10,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);
  const outerHalo3 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.30, 0.10, 0.02),
    transparent: true, opacity: 0.055,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const m of diskMats) m.uniforms.uTime.value = t;
    haloMat.uniforms.uTime.value = t;
    jetMat.uniforms.uTime.value  = t;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.062;
      groupRef.current.frustumCulled = false;
    }
  });

  return (
    <group ref={groupRef}>

      {/* ── MAIN DISK — 48×48 plane for wide outer disk ─────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[48, 48]} />
        <primitive object={diskMats[0]} attach="material" />
      </mesh>

      {/* Upper / lower offset planes — give thickness + depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]} frustumCulled={false}>
        <planeGeometry args={[38, 38]} />
        <primitive object={diskMats[1]} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} frustumCulled={false}>
        <planeGeometry args={[38, 38]} />
        <primitive object={diskMats[2]} attach="material" />
      </mesh>

      {/* ── OUTER HALO — wide dust lane beyond main disk ──────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[80, 80]} />
        <primitive object={haloMat} attach="material" />
      </mesh>

      {/* ── GEOMETRY OUTER HALOS — simple rings for outer extent ──────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} frustumCulled={false}>
        <ringGeometry args={[11.0, 24.0, 256]} />
        <primitive object={outerHalo1} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} frustumCulled={false}>
        <ringGeometry args={[22.0, 38.0, 256]} />
        <primitive object={outerHalo2} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} frustumCulled={false}>
        <ringGeometry args={[36.0, 55.0, 256]} />
        <primitive object={outerHalo3} attach="material" />
      </mesh>

      {/* ── TILTED PHOTON RINGS — frustumCulled=false prevents edge clip ──── */}
      {rings.map((r, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2 + THREE.MathUtils.degToRad(r.t), 0, 0]}
          frustumCulled={false}
        >
          <ringGeometry args={[r.i, r.o, 256]} />
          <primitive object={ringMats[i]} attach="material" />
        </mesh>
      ))}

      {/* ── RELATIVISTIC JET ────────────────────────────────────────────────── */}
      <mesh scale={[7.5, 28.0, 7.5]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <primitive object={jetMat} attach="material" />
      </mesh>

      {/* ── PHOTON SPHERE — primary bright torus ──────────────────────────── */}
      <mesh frustumCulled={false}>
        <torusGeometry args={[3.68, 0.10, 32, 512]} />
        <meshBasicMaterial
          color={new THREE.Color(2.00, 1.40, 0.55)}
          transparent opacity={0.72}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Secondary photon ring */}
      <mesh frustumCulled={false}>
        <torusGeometry args={[4.02, 0.048, 24, 512]} />
        <meshBasicMaterial
          color={new THREE.Color(0.80, 0.62, 1.20)}
          transparent opacity={0.28}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Tertiary faint ring */}
      <mesh frustumCulled={false}>
        <torusGeometry args={[4.36, 0.022, 18, 512]} />
        <meshBasicMaterial
          color={new THREE.Color(0.42, 0.38, 0.80)}
          transparent opacity={0.12}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* ── FRAME-DRAG GLOW — oblate warm sphere around horizon ─────────────── */}
      <mesh scale={[9.0, 1.60, 9.0]} frustumCulled={false}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color={new THREE.Color(0.30, 0.14, 0.03)}
          transparent opacity={0.065}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Inner orange warmth glow */}
      <mesh scale={[5.8, 1.20, 5.8]} frustumCulled={false}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0.80, 0.35, 0.06)}
          transparent opacity={0.055}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* ── EVENT HORIZON — absolute black void ──────────────────────────────── */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.70, 96, 96]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>
      {/* Shadow limb — slight dark haze at boundary */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[2.78, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0.06, 0.02, 0.00)}
          transparent opacity={0.65}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

    </group>
  );
}