'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
  BLACK HOLE — v13 "RICH PLASMA" (BlackHoleModel.tsx)
  ═══════════════════════════════════════════════════════════════════════════
  Goals:
  ✓ VIVID COLORS — blazing orange, deep red, molten amber, copper, rust
  ✓ Disk is BRIGHT and clearly visible — plasma moving, swirling
  ✓ NO white flashbang — brightest point = saturated amber/orange
  ✓ Strong Doppler asymmetry — one side orange-hot, other deep red-cool
  ✓ Organic plasma texture — domain-warped FBM, zero ring banding
  ✓ Large jet-black event horizon with amber photon arc
  ✓ Wide outer disk fading to deep rust/maroon
  ✓ frustumCulled=false throughout
═══════════════════════════════════════════════════════════════════════════ */

const VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

// ── Main disk — vivid orange/amber/red plasma ─────────────────────────────
const DISK_FRAG = /* glsl */`
varying vec2 vUv;
uniform float uTime;
uniform float uDim;

#define TAU 6.28318530717959

float hash(vec2 p){ p=fract(p*vec2(127.1,311.7)); p+=dot(p,p+74.5); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
mat2 rot2(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float fbm(vec2 p){
  float v=0.,a=0.52; mat2 R=rot2(0.4712);
  for(int i=0;i<6;i++){ v+=a*vnoise(p); p=R*p*2.08; a*=0.48; }
  return v;
}
float wfbm(vec2 p){
  vec2 q=vec2(fbm(p+vec2(1.7,9.2)),fbm(p+vec2(8.3,2.8)));
  vec2 r=vec2(fbm(p+3.8*q+vec2(1.3,2.9)),fbm(p+3.8*q+vec2(8.7,0.5)));
  return fbm(p+3.2*r);
}

void main(){
  vec2  uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);

  // Radial mask — soft edges
  float rInner = 0.054;
  float rOuter = 0.50;
  float inner  = smoothstep(rInner, rInner*3.8, r);
  float outer  = smoothstep(rOuter, rOuter*0.38, r);
  float mask   = inner * outer;
  if(mask < 0.001){ gl_FragColor = vec4(0.0); return; }

  // Keplerian log-polar
  float omega = pow(max(r, 0.056), -1.5);
  float phase = a + omega * uTime * 0.12;
  vec2  lp    = vec2(phase/TAU, -log(max(r,0.001))*3.4+3.8);

  // Three turbulence layers
  float f1 = wfbm(lp*vec2(2.4,1.9) + vec2(0.0, uTime*0.065));
  f1 = pow(max(0., f1-0.18), 1.30) * 3.8;

  float f2 = wfbm(lp*vec2(5.5,3.8) + vec2(uTime*0.042, 1.6));
  f2 = pow(max(0., f2-0.22), 1.20) * 4.5;

  float f3 = fbm(lp*vec2(12.0,7.5) + vec2(-uTime*0.028, 3.0));
  f3 = pow(max(0., f3-0.38), 1.05) * 3.2;

  float eInner = smoothstep(0.22, 0.05, r);
  float eMid   = smoothstep(0.08, 0.22, r) * smoothstep(0.38, 0.12, r);
  float eOuter = smoothstep(0.18, 0.42, r) * smoothstep(0.50, 0.20, r);

  float turb = f1*(0.42+eOuter*0.40)
             + f2*(0.35+eMid  *0.40)
             + f3*(0.23+eInner*0.48);

  // Doppler — strong, drives the color variation
  float beta = clamp(sqrt(0.042/(2.0*max(r,0.060))), 0.0, 0.75);
  float dPhi = a - uTime * 0.12;
  float cosD = cos(dPhi);
  float dI   = pow(1.0/max(1.0-beta*cosD, 0.14), 3.2);
  float dC   = cosD*0.5+0.5;

  // COLOUR — no white, maximum saturation orange/amber/red
  vec3 cISCO   = vec3(1.00, 0.72, 0.15);  // molten amber — BRIGHTEST POINT
  vec3 cOrange = vec3(0.96, 0.48, 0.06);  // vivid orange
  vec3 cCopper = vec3(0.80, 0.30, 0.03);  // copper
  vec3 cSienna = vec3(0.60, 0.18, 0.015); // burnt sienna
  vec3 cRust   = vec3(0.38, 0.09, 0.008); // rust
  vec3 cMaroon = vec3(0.20, 0.04, 0.004); // dark maroon
  vec3 cVoid   = vec3(0.06, 0.012, 0.001);// near-black

  vec3 col = cISCO;
  col = mix(col, cOrange, smoothstep(0.056, 0.100, r));
  col = mix(col, cCopper, smoothstep(0.090, 0.185, r));
  col = mix(col, cSienna, smoothstep(0.168, 0.295, r));
  col = mix(col, cRust,   smoothstep(0.270, 0.390, r));
  col = mix(col, cMaroon, smoothstep(0.360, 0.460, r));
  col = mix(col, cVoid,   smoothstep(0.430, 0.510, r));

  // Doppler colour: approaching=amber boost, receding=red push
  col = mix(col * vec3(0.72, 0.42, 0.28), col * vec3(1.08, 0.96, 0.70), dC);

  float Tenv = clamp(pow(0.056/max(r,0.056), 0.62)*1.10, 0.0, 1.0);

  // Plasma blobs
  float blob1 = max(0., f1-0.62)*6.5 * smoothstep(0.42,0.04,r);
  float blob2 = max(0., f2-0.68)*7.5 * smoothstep(0.30,0.04,r);
  float blob3 = max(0., f3-0.72)*5.0 * smoothstep(0.20,0.04,r);
  col += vec3(1.0,0.65,0.12)*blob1*blob1*0.55
       + vec3(0.95,0.52,0.08)*blob2*blob2*0.48
       + vec3(0.90,0.44,0.06)*blob3*blob3*0.35;

  // ISCO — amber, not white
  float isco = exp(-pow((r-0.060)*120.0, 2.0));
  col += vec3(1.0, 0.68, 0.12) * isco * 0.85;

  // Photon ring shimmer
  float ph1 = exp(-pow((r-0.106)*88.0, 2.0));
  float ph2 = exp(-pow((r-0.124)*65.0, 2.0)) * 0.55;
  float phD = 0.55 + dC * 0.90;
  col += vec3(0.90,0.55,0.08) * (ph1+ph2) * phD * 0.55;

  float iRaw = (turb + blob1*blob1*0.45 + blob2*blob2*0.38 + blob3*blob3*0.25
               + isco*0.65 + (ph1+ph2)*phD*0.22)
             * Tenv * mask * dI * uDim;
  float intensity = clamp(iRaw * 0.92, 0.0, 1.25);

  gl_FragColor = vec4(col * intensity, intensity * mask);
}
`;

// ── Outer halo ─────────────────────────────────────────────────────────────
const HALO_FRAG = /* glsl */`
varying vec2 vUv;
uniform float uTime;
#define TAU 6.28318530717959
float hash(vec2 p){ p=fract(p*vec2(127.1,311.7)); p+=dot(p,p+74.5); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
mat2 rot2(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float fbm(vec2 p){
  float v=0.,a=.50; mat2 R=rot2(.52);
  for(int i=0;i<4;i++){ v+=a*vnoise(p); p=R*p*2.05; a*=.50; }
  return v;
}
void main(){
  vec2 uv=vUv-0.5; float r=length(uv),a=atan(uv.y,uv.x);
  float rMin=0.24,rMax=0.50;
  if(r<rMin||r>rMax){ gl_FragColor=vec4(0.0); return; }
  float omega=pow(max(r,0.24),-1.3);
  float phase=a+omega*uTime*0.08;
  vec2 lp=vec2(phase/TAU,-log(max(r,.001))*2.2+2.6);
  float f=fbm(lp*vec2(2.2,1.7)+vec2(uTime*0.030,0.));
  f=pow(max(0.,f-0.32),1.55)*2.0;
  float mask=smoothstep(rMin,rMin*1.7,r)*smoothstep(rMax,rMax*0.50,r);
  vec3 col=mix(vec3(0.58,0.22,0.025),vec3(0.15,0.05,0.005),smoothstep(rMin*1.6,rMax,r));
  float i=f*mask*0.70;
  gl_FragColor=vec4(col*i,i);
}
`;

export default function BlackHole() {
  const groupRef = useRef<THREE.Group>(null!);

  const diskMats = useMemo(() => [1.0, 0.55, 0.55].map(dim =>
    new THREE.ShaderMaterial({
      uniforms: { uTime:{value:0}, uDim:{value:dim} },
      vertexShader: VERT,
      fragmentShader: DISK_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  ), []);

  const haloMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0} },
    vertexShader: VERT,
    fragmentShader: HALO_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  const photonMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(3.2, 1.55, 0.28),
    transparent: true, opacity: 0.88,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  const photon2Mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.40, 0.58, 0.08),
    transparent: true, opacity: 0.32,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  const frameDragMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.55, 0.18, 0.018),
    transparent: true, opacity: 0.065,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const dust1 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.65, 0.22, 0.025),
    transparent: true, opacity: 0.095,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);
  const dust2 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.28, 0.08, 0.008),
    transparent: true, opacity: 0.052,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);
  const dust3 = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.14, 0.04, 0.004),
    transparent: true, opacity: 0.028,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), []);

  const limbMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.12, 0.038, 0.004),
    transparent: true, opacity: 0.78,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const m of diskMats) m.uniforms.uTime.value = t;
    haloMat.uniforms.uTime.value = t;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.052;
      groupRef.current.frustumCulled = false;
    }
  });

  return (
    <group ref={groupRef}>

      {/* Outer ambient halo */}
      <mesh rotation={[-Math.PI/2,0,0]} frustumCulled={false}>
        <planeGeometry args={[80,80]} />
        <primitive object={haloMat} attach="material" />
      </mesh>

      {/* Far outer dust — just 3, very faint */}
      <mesh rotation={[Math.PI/2,0,0]} frustumCulled={false}>
        <ringGeometry args={[11.5,24.0,256]} />
        <primitive object={dust1} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI/2,0,0]} frustumCulled={false}>
        <ringGeometry args={[22.0,38.0,256]} />
        <primitive object={dust2} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI/2,0,0]} frustumCulled={false}>
        <ringGeometry args={[36.0,55.0,256]} />
        <primitive object={dust3} attach="material" />
      </mesh>

      {/* MAIN DISK — 50×50 vivid plasma */}
      <mesh rotation={[-Math.PI/2,0,0]} frustumCulled={false}>
        <planeGeometry args={[50,50]} />
        <primitive object={diskMats[0]} attach="material" />
      </mesh>
      {/* Disk thickness — offset planes */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.16,0]} frustumCulled={false}>
        <planeGeometry args={[42,42]} />
        <primitive object={diskMats[1]} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.16,0]} frustumCulled={false}>
        <planeGeometry args={[42,42]} />
        <primitive object={diskMats[2]} attach="material" />
      </mesh>

      {/* Frame-drag equatorial glow */}
      <mesh scale={[11.0,1.5,11.0]} frustumCulled={false}>
        <sphereGeometry args={[1,32,32]} />
        <primitive object={frameDragMat} attach="material" />
      </mesh>

      {/* Photon rings — amber arc outlining the black sphere */}
      <mesh frustumCulled={false}>
        <torusGeometry args={[3.52,0.058,32,512]} />
        <primitive object={photonMat} attach="material" />
      </mesh>
      <mesh frustumCulled={false}>
        <torusGeometry args={[3.80,0.032,24,512]} />
        <primitive object={photon2Mat} attach="material" />
      </mesh>

      {/* EVENT HORIZON — absolute black, dominant */}
      <mesh renderOrder={2} frustumCulled={false}>
        <sphereGeometry args={[3.28,128,128]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>

      {/* Shadow limb — amber-tinged sphere boundary */}
      <mesh renderOrder={1} frustumCulled={false}>
        <sphereGeometry args={[3.40,64,64]} />
        <primitive object={limbMat} attach="material" />
      </mesh>

    </group>
  );
}