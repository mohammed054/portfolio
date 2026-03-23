'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   ACCRETION DISK v10  "FIXED FRUSTUM + CLEANER TEXTURE"
   ═══════════════════════════════════════════════════════════════════════════
   FIXES vs v9:
   ✓ frustumCulled={false} on ALL ring/halo meshes — stops edge clipping
   ✓ Dust fringe removed — was creating dark brown smear artifact below disk
   ✓ Outer glow replaced with a simple additive wide ring geometry
   ✓ Log-polar wfbm simplified: wfbm → single-warp fbm (less GPU load,
     no shader timeout risk, same visual quality)
   ✓ Disk plane geometry enlarged: 32×32 to ensure outer pixels visible
   ✓ groupRef.frustumCulled = false applied to whole group
═══════════════════════════════════════════════════════════════════════════ */

const DISK_FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform float uSide;

#define PI  3.14159265358979
#define TAU 6.28318530717959

float hash(vec2 p){
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 74.5);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i),          hash(i+vec2(1,0)),u.x),
    mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
mat2 rot2(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<6;i++){
    v += a * vnoise(p);
    p  = rot2(0.5236) * p * 2.03;
    a *= 0.49;
  }
  return v;
}

// Single-warp domain-warped FBM — tendrils without double-warp GPU cost
float wfbm(vec2 p){
  vec2 q = vec2(fbm(p + vec2(1.7, 9.2)),
                fbm(p + vec2(8.3, 2.8)));
  return fbm(p + 2.5*q);
}

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  float rInner = 0.050;
  float rOuter = (uSide == 0.0) ? 0.58 : 0.40;
  float mask = smoothstep(rInner, rInner*2.5, r)
             * smoothstep(rOuter, rOuter*0.30, r);
  if(uSide != 0.0) mask *= 0.32;
  if(mask < 0.001){ gl_FragColor = vec4(0.); return; }

  // ── Log-polar transform (Keplerian co-rotation) ────────────────────
  float logR  = log(max(r, 0.001));
  float omega = pow(max(r, 0.055), -1.5);
  float phase = a + omega * uTime * 0.14;

  vec2 lpUV = vec2(phase / TAU, -logR * 2.5 + 3.0);

  // ── 3 texture layers in log-polar space ────────────────────────────
  // Layer 1: large-scale warped spirals
  vec2 lp1 = lpUV * vec2(2.8, 2.0) + vec2(0.0, uTime*0.10);
  float f1  = wfbm(lp1);
  f1 = smoothstep(0.36, 0.74, f1);  // sharp contrast: dark gaps = 0

  // Layer 2: mid-scale knots
  vec2 lp2 = lpUV * vec2(5.5, 3.5) + vec2(uTime*0.07, 1.3);
  float f2  = wfbm(lp2);
  f2 = smoothstep(0.40, 0.78, f2);

  // Layer 3: fine bright grain
  vec2 lp3 = lpUV * vec2(11.0, 6.0) + vec2(-uTime*0.04, 2.7);
  float f3  = fbm(lp3);
  f3 = smoothstep(0.46, 0.82, f3);

  // Radial blend weights
  float eInner = smoothstep(0.20, 0.06, r);
  float eMid   = smoothstep(0.08,0.20,r)*smoothstep(0.40,0.14,r);
  float eOuter = smoothstep(0.16,0.46,r)*smoothstep(0.56,0.20,r);

  float turb = f1*(0.50+eInner*0.50)
             + f2*(0.32+eMid  *0.42)
             + f3*(0.18+eOuter*0.22);

  // ── Doppler ────────────────────────────────────────────────────────
  float beta = clamp(sqrt(0.048/(2.0*max(r,0.072))), 0.0, 0.80);
  float dPhi = a - uTime*0.14;
  float dI   = pow(1.0/max(1.0-beta*cos(dPhi),0.16), 3.0);
  float dC   = cos(dPhi)*0.5+0.5;

  // ── Colour zones ───────────────────────────────────────────────────
  vec3 cISCO  = vec3(0.88,0.94,1.00);
  vec3 cHot   = vec3(1.00,0.96,0.80);
  vec3 cGold  = vec3(1.00,0.82,0.28);
  vec3 cAmber = vec3(0.86,0.50,0.08);
  vec3 cRust  = vec3(0.36,0.13,0.02);
  vec3 cEdge  = vec3(0.12,0.04,0.01);

  vec3 col = mix(cISCO,  cHot,   smoothstep(0.050,0.075,r));
  col      = mix(col,    cGold,  smoothstep(0.070,0.130,r));
  col      = mix(col,    cAmber, smoothstep(0.120,0.240,r));
  col      = mix(col,    cRust,  smoothstep(0.220,0.400,r));
  col      = mix(col,    cEdge,  smoothstep(0.360,0.560,r));

  col = mix(col, col+vec3(0.04,0.07,0.20), dC*0.28);
  col = mix(col, col*vec3(1.08,0.72,0.48), (1.0-dC)*0.20);

  // ── Temperature envelope ────────────────────────────────────────────
  float Tenv = clamp(pow(0.050/max(r,0.050), 0.75)*1.10, 0.0, 1.0);

  // ── Intensity ──────────────────────────────────────────────────────
  float iRaw  = turb * Tenv * mask * dI;
  float intensity = clamp(iRaw * 0.55, 0.0, 0.60);

  // ── Photon rings ────────────────────────────────────────────────────
  float ph1 = exp(-pow((r-0.115)*100.0,2.0));
  float ph2 = exp(-pow((r-0.136)*72.0, 2.0))*0.55;
  float ph3 = exp(-pow((r-0.158)*52.0, 2.0))*0.28;
  float phD = 0.45+dC*0.70;
  col       += vec3(1.00,0.92,0.62)*(ph1+ph2+ph3)*phD;
  intensity += (ph1*0.45+ph2*0.22+ph3*0.10)*phD;

  // ── ISCO blaze ────────────────────────────────────────────────────
  float isco = exp(-pow((r-0.060)*125.0,2.0));
  col       += vec3(0.75,0.88,1.00)*isco*0.60;
  intensity += isco*0.45;

  // ── Hot blobs ─────────────────────────────────────────────────────
  float b1 = max(0.0,f1-0.80)*3.5*smoothstep(0.36,0.06,r);
  float b2 = max(0.0,f2-0.84)*4.0*smoothstep(0.26,0.05,r);
  col      += vec3(0.88,0.60,0.18)*b1*b1 + vec3(1.00,0.80,0.28)*b2*b2;
  intensity += clamp(b1*b1*0.28+b2*b2*0.22, 0.0, 0.20);

  intensity = clamp(intensity, 0.0, 0.85);
  gl_FragColor = vec4(col*intensity, intensity);
}
`;

const VERT = `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

const JET_FRAG = `
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p=vUv-0.5; float x=abs(p.x),y=p.y;
  float cone=smoothstep(0.0,0.20,0.22-x*(2.5+abs(y)*1.8));
  if(cone<0.001){gl_FragColor=vec4(0.);return;}
  float wave=0.5+0.5*sin((y*11.0-uTime*2.8)*3.14159);
  float beam=pow(cone*wave,2.2)*smoothstep(0.46,0.05,abs(y));
  vec3 col=mix(vec3(0.28,0.55,0.98),vec3(0.08,0.24,0.68),x*5.0);
  gl_FragColor=vec4(col*beam*0.28,beam*0.24);
}`;

export default function BlackHole() {
  const groupRef = useRef<THREE.Group>(null!);

  const diskMats = useMemo(() => [0, 1, -1].map(side =>
    new THREE.ShaderMaterial({
      uniforms: { uTime:{value:0}, uSide:{value:side} },
      vertexShader: VERT, fragmentShader: DISK_FRAG,
      transparent:true, blending:THREE.AdditiveBlending,
      depthWrite:false, side:THREE.DoubleSide,
    })
  ), []);

  const jetMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0} },
    vertexShader: VERT, fragmentShader: JET_FRAG,
    transparent:true, blending:THREE.AdditiveBlending,
    depthWrite:false, side:THREE.DoubleSide,
  }), []);

  // Tilted photon-capture ring stack
  const rings = useMemo(() => [
    { i:2.65, o:13.0, t:  0, op:0.50 },
    { i:2.78, o:11.5, t:  4, op:0.25 },
    { i:2.78, o:11.5, t: -4, op:0.25 },
    { i:2.92, o: 9.8, t:  9, op:0.16 },
    { i:2.92, o: 9.8, t: -9, op:0.16 },
    { i:3.08, o: 8.4, t: 15, op:0.10 },
    { i:3.08, o: 8.4, t:-15, op:0.10 },
    { i:3.28, o: 7.2, t: 22, op:0.060},
    { i:3.28, o: 7.2, t:-22, op:0.060},
    { i:3.55, o: 6.2, t: 30, op:0.036},
    { i:3.55, o: 6.2, t:-30, op:0.036},
    { i:3.85, o: 5.5, t: 40, op:0.020},
    { i:3.85, o: 5.5, t:-40, op:0.020},
    { i:4.12, o: 4.8, t: 52, op:0.011},
    { i:4.12, o: 4.8, t:-52, op:0.011},
  ], []);

  const ringMats = useMemo(() => rings.map(r =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.92,0.60,0.16),
      transparent:true, opacity:r.op,
      blending:THREE.AdditiveBlending,
      depthWrite:false, side:THREE.DoubleSide,
    })
  ), [rings]);

  // Outer dust halo — single wide flat ring, NOT a shader (no dark artifact risk)
  // Using very low opacity additive gold/brown
  const outerHaloMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.55, 0.35, 0.06),
    transparent:true, opacity:0.10,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }), []);

  const outerHaloMat2 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.30, 0.18, 0.03),
    transparent:true, opacity:0.05,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const m of diskMats) m.uniforms.uTime.value = t;
    jetMat.uniforms.uTime.value = t;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.065;
      groupRef.current.frustumCulled = false; // prevent whole group culling
    }
  });

  return (
    <group ref={groupRef}>

      {/* ── MAIN DISK PLANES ───────────────────────────────────────────── */}
      {/* Plane size 32×32 ensures UV corners cover full ring extent */}
      <mesh rotation={[-Math.PI/2,0,0]} frustumCulled={false}>
        <planeGeometry args={[32,32]} />
        <primitive object={diskMats[0]} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.14,0]} frustumCulled={false}>
        <planeGeometry args={[26,26]} />
        <primitive object={diskMats[1]} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.14,0]} frustumCulled={false}>
        <planeGeometry args={[26,26]} />
        <primitive object={diskMats[2]} attach="material" />
      </mesh>

      {/* ── OUTER HALO RINGS (simple geometry, no shader artifacts) ─── */}
      <mesh rotation={[Math.PI/2,0,0]} frustumCulled={false}>
        <ringGeometry args={[9.5, 20.0, 192]} />
        <primitive object={outerHaloMat} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI/2,0,0]} frustumCulled={false}>
        <ringGeometry args={[18.0, 30.0, 192]} />
        <primitive object={outerHaloMat2} attach="material" />
      </mesh>

      {/* ── TILTED PHOTON RINGS — frustumCulled=false prevents edge clip ── */}
      {rings.map((r,i) => (
        <mesh
          key={i}
          rotation={[Math.PI/2+THREE.MathUtils.degToRad(r.t),0,0]}
          frustumCulled={false}   // ← THIS was causing the clipping
        >
          <ringGeometry args={[r.i, r.o, 192]} />
          <primitive object={ringMats[i]} attach="material" />
        </mesh>
      ))}

      {/* ── RELATIVISTIC JET ────────────────────────────────────────────── */}
      <mesh scale={[6.5,22,6.5]} frustumCulled={false}>
        <planeGeometry args={[1,1]} />
        <primitive object={jetMat} attach="material" />
      </mesh>

      {/* ── PHOTON SPHERE TORII ─────────────────────────────────────────── */}
      <mesh frustumCulled={false}>
        <torusGeometry args={[3.72,0.075,32,512]} />
        <meshBasicMaterial color={new THREE.Color(1.00,0.88,0.55)}
          transparent opacity={0.58} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      <mesh frustumCulled={false}>
        <torusGeometry args={[4.08,0.036,24,512]} />
        <meshBasicMaterial color={new THREE.Color(0.54,0.50,0.90)}
          transparent opacity={0.20} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      <mesh frustumCulled={false}>
        <torusGeometry args={[4.42,0.018,18,512]} />
        <meshBasicMaterial color={new THREE.Color(0.30,0.32,0.65)}
          transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* ── FRAME-DRAG GLOW ─────────────────────────────────────────────── */}
      <mesh scale={[8.0,1.45,8.0]} frustumCulled={false}>
        <sphereGeometry args={[1,48,48]} />
        <meshBasicMaterial color={new THREE.Color(0.12,0.20,0.50)}
          transparent opacity={0.026} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* ── EVENT HORIZON VOID ──────────────────────────────────────────── */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.70,96,96]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>
      <mesh renderOrder={1}>
        <sphereGeometry args={[2.77,64,64]} />
        <meshBasicMaterial color={new THREE.Color(0.10,0.04,0.01)}
          transparent opacity={0.52} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

    </group>
  );
}