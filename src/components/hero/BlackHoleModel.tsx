'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────────────
   DISK FRAGMENT SHADER  v3
   Philosophy: start from v1's proven smooth base; add richness without
   domain-warping (which caused the "Minecraft" pixelated look in v2).

   Improvements over v1:
   ✓ Second turbulence layer at different angular freq — more fibrous detail
   ✓ Relativistic Doppler brightness boost (power 1.8, not harsh 3.0)
   ✓ Three colour zones: white-hot inner → gold mid → amber outer
   ✓ exp() photon ring (smoother peak than smoothstep)
   ✓ ISCO blue-white jet at inner edge
   ✓ Hot-spot blobs (smooth, no sinusoidal bands)
   NO domain warping  ← that was the Minecraft culprit
   NO density bands   ← also looked pixelated
───────────────────────────────────────────────────────────────────────── */
const DISK_FRAG = `
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
// Standard smooth FBM — simple p*=2.1, no rotation matrix
float fbm(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=.5; }
  return v;
}
// Finer grain layer (4 octaves, offset seed)
float fbm2(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<4;i++){ v+=a*noise(p+vec2(31.4,17.8)); p*=2.2; a*=.48; }
  return v;
}

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  // Disk mask — same smooth shape as v1
  float disk = smoothstep(0.062, 0.130, r) * smoothstep(0.50, 0.24, r);
  if(disk < 0.001){ gl_FragColor=vec4(0.); return; }

  // ── Primary spiral turbulence (v1 formula — proven smooth) ───────────
  float spin  = a + r*11.0 - uTime*1.9;
  float turb  = fbm(vec2(spin*2.4, r*8.5 - uTime*0.42));

  // ── Fine detail layer at higher angular frequency ─────────────────────
  float spin2 = a*1.4 + r*16.5 - uTime*2.55;
  float turb2 = fbm2(vec2(spin2*1.7, r*10.5 - uTime*0.50));

  float turbF = turb*0.72 + turb2*0.28;

  // ── Relativistic Doppler (power 1.8 — visible but not harsh) ─────────
  float dopCos   = cos(a - uTime*0.18);
  float dopplerB = pow(max(0.01, 1.0 + dopCos*0.58), 1.8);
  float dopplerC = dopCos*0.5 + 0.5; // 0=receding, 1=approaching

  // ── Colour palette ────────────────────────────────────────────────────
  vec3 white  = vec3(2.30, 1.95, 1.35);          // white-hot core
  vec3 gold   = vec3(2.10, 1.30, 0.38);          // golden mid
  vec3 amber  = vec3(1.25, 0.58, 0.14);          // warm amber
  vec3 rust   = vec3(0.82, 0.32, 0.08)*1.4;      // cool outer edge

  // Radial temperature gradient (inner hot → outer cool)
  vec3 col = mix(white, gold,  smoothstep(0.08, 0.20, r));
  col       = mix(col,  amber, smoothstep(0.15, 0.34, r));
  col       = mix(col,  rust,  smoothstep(0.32, 0.46, r));

  // Doppler colour tint — approaching side gets bluer/brighter
  vec3 blueBoost = vec3(0.28, 0.62, 1.00)*2.4;
  col = mix(col, blueBoost, dopplerC * 0.22);

  // ── Intensity ─────────────────────────────────────────────────────────
  float intensity = disk * (0.60 + turbF*1.65) * smoothstep(0.48, 0.10, r) * dopplerB;

  // ── Photon sphere ring — exp() for smooth crisp peak ─────────────────
  float ph = exp(-pow((r - 0.126)*56.0, 2.0)) * 8.0;
  col      += vec3(0.6, 0.4, 0.2) * ph;
  intensity += ph * 0.22;

  // ── ISCO inner-edge blue-white plasma jet ─────────────────────────────
  float isco = exp(-pow((r - 0.070)*78.0, 2.0)) * 4.0;
  col      += vec3(1.0, 1.8, 3.5) * isco * 0.22;
  intensity += isco * 0.10;

  // ── Smooth hot-spot blobs (no sinusoidal banding) ─────────────────────
  float spot = max(0., turb - 0.72) * 3.0 * smoothstep(0.26, 0.09, r);
  col      += vec3(1.6, 1.0, 0.5) * (spot*spot);
  intensity += (spot*spot) * 0.45;

  gl_FragColor = vec4(col * intensity, intensity);
}`;

export default function BlackHole() {
  const groupRef = useRef<THREE.Group>(null!);

  const diskMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: DISK_FRAG,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  // Stacked tilted rings — same counts as v1 but slightly tuned
  const rings = useMemo(() => [
    { inner: 2.80, outer: 11.0, tilt:  0,   op: 0.52 },
    { inner: 3.00, outer:  9.5, tilt:  7,   op: 0.27 },
    { inner: 3.00, outer:  9.5, tilt: -7,   op: 0.27 },
    { inner: 3.40, outer:  7.6, tilt: 14,   op: 0.14 },
    { inner: 3.40, outer:  7.6, tilt:-14,   op: 0.14 },
    { inner: 3.80, outer:  5.8, tilt: 22,   op: 0.07 },
    { inner: 3.80, outer:  5.8, tilt:-22,   op: 0.07 },
    { inner: 4.20, outer:  5.0, tilt: 31,   op: 0.04 },
    { inner: 4.20, outer:  5.0, tilt:-31,   op: 0.04 },
  ], []);

  const ringMats = useMemo(() => rings.map(r => new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.60, 0.80, 0.26),
    transparent: true, opacity: r.op,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  })), [rings]);

  // Faint wide outer halo (like dust/corona)
  const haloMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.85, 0.52, 0.16),
    transparent: true, opacity: 0.055,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    diskMat.uniforms.uTime.value = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.075;
  });

  return (
    <group ref={groupRef}>
      {/* Main disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <primitive object={diskMat} attach="material" />
      </mesh>

      {/* Tilted rings */}
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + THREE.MathUtils.degToRad(r.tilt), 0, 0]}>
          <ringGeometry args={[r.inner, r.outer, 128]} />
          <primitive object={ringMats[i]} attach="material" />
        </mesh>
      ))}

      {/* Wide outer dust halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.5, 17, 128]} />
        <primitive object={haloMat} attach="material" />
      </mesh>

      {/* Photon sphere bright torus */}
      <mesh>
        <torusGeometry args={[3.74, 0.062, 20, 256]} />
        <meshBasicMaterial color={new THREE.Color(2.4, 2.1, 1.9)} transparent opacity={0.50}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Secondary photon arc */}
      <mesh>
        <torusGeometry args={[4.10, 0.028, 14, 256]} />
        <meshBasicMaterial color={new THREE.Color(1.6, 1.4, 2.2)} transparent opacity={0.18}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Oblate frame-dragging glow */}
      <mesh scale={[7.8, 1.6, 7.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={new THREE.Color(0.38, 0.55, 1.15)} transparent opacity={0.048}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Absolute void */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.70, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}