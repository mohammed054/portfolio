'use client';
/**
 * InsideScene — the interior of the black hole.
 * Rendered behind ALL portfolio sections.
 *
 * Visual layers:
 *  1. Deep blue-black ambient  → set via scene.background
 *  2. Singularity point        → bright white-blue sphere far ahead
 *  3. Singularity halo rings   → concentric rings like gravitational waves
 *  4. Tunnel particles         → 2400 pts streaming toward singularity
 *  5. Hawking glow             → soft radial gradient from singularity
 *  6. Slow orbital drift       → camera gentle orbit tied to body scroll
 */
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TUNNEL_V = `
attribute float aSeed;
attribute float aAngle;
attribute float aRadius;
uniform float uTime;
uniform float uOpacity;
varying float vSeed;

void main(){
  float spd = 2.8 + aSeed * 5.5;
  float z   = mod(position.z - uTime * spd + 50.0, 100.0) - 50.0;
  float pull = smoothstep(12., -12., z);
  float r    = aRadius * (1.0 - pull * 0.88);
  float ang  = aAngle + uTime * 0.12 * (1.0 + aSeed * 0.4);
  vec3 pos   = vec3(cos(ang)*r, sin(ang)*r*0.55, z);
  vec4 mv    = modelViewMatrix * vec4(pos, 1.0);
  float sz   = (0.45 + aSeed * 1.6) * (160.0 / max(-mv.z, 1.0));
  gl_PointSize = clamp(sz, 0.4, 9.0);
  gl_Position  = projectionMatrix * mv;
  vSeed = aSeed;
}`;

const TUNNEL_F = `
uniform float uTime;
uniform float uOpacity;
varying float vSeed;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d  = length(uv);
  if(d > 0.5) discard;
  float core = smoothstep(0.06, 0.0, d);
  float glow = smoothstep(0.50, 0.0, d) * 0.58;
  vec3 col   = mix(vec3(0.38, 0.62, 1.0), vec3(0.82, 0.92, 1.0), core);
  // rare warm particles for depth variation
  col = mix(col, vec3(0.9, 0.7, 1.0), step(0.92, vSeed) * 0.4);
  float alpha = (core + glow) * (0.38 + vSeed * 0.62) * uOpacity;
  gl_FragColor = vec4(col, alpha);
}`;

interface Props {
  visible:    boolean;
  bodyScroll: React.MutableRefObject<number>; // 0→1 through portfolio
}

export default function InsideScene({ visible, bodyScroll }: Props) {
  const { scene, camera } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null!);

  // Set scene background to true black once
  useMemo(() => { scene.background = new THREE.Color(0, 0, 0); }, [scene]);

  // ── TUNNEL GEOMETRY ───────────────────────────────────────────────────────
  const geo = useMemo(()=>{
    const N=2400;
    const pos=new Float32Array(N*3),sd=new Float32Array(N),ang=new Float32Array(N),rad=new Float32Array(N);
    for(let i=0;i<N;i++){
      const r=1.2+Math.random()*10,a=Math.random()*Math.PI*2;
      pos[i*3]=Math.cos(a)*r; pos[i*3+1]=(Math.random()-.5)*r*.55; pos[i*3+2]=Math.random()*100-50;
      sd[i]=Math.random(); ang[i]=a; rad[i]=r;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    g.setAttribute('aSeed',   new THREE.BufferAttribute(sd,1));
    g.setAttribute('aAngle',  new THREE.BufferAttribute(ang,1));
    g.setAttribute('aRadius', new THREE.BufferAttribute(rad,1));
    return g;
  },[]);

  // ── GRAVITATIONAL WAVE RINGS ──────────────────────────────────────────────
  const rings = useMemo(()=>[
    {r:4,  z:-12, op:0.08},
    {r:7,  z:-18, op:0.06},
    {r:11, z:-26, op:0.04},
    {r:16, z:-36, op:0.03},
    {r:22, z:-48, op:0.02},
  ],[]);

  const ringMats = useMemo(()=>rings.map(()=>new THREE.MeshBasicMaterial({
    color:new THREE.Color(0.28,0.50,1.20), transparent:true, opacity:0.07,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  })),[rings]);

  useFrame(({ clock }) => {
    if(!mat.current) return;
    const t = clock.getElapsedTime();
    mat.current.uniforms.uTime.value    = t;
    mat.current.uniforms.uOpacity.value = visible ? 1.0 : 0.0;

    if(!visible) return;

    // Gentle camera orbit — tied to body scroll for premium feel
    const ip = bodyScroll.current; // 0→1
    const cx  = Math.sin(t * 0.07 + ip * 1.8) * 2.2;
    const cy  = Math.cos(t * 0.05) * 0.7 + 0.3;
    const cz  = -1.5 - ip * 6;  // camera drifts deeper as you scroll

    camera.position.set(cx, cy, cz);
    // Always look toward singularity
    camera.lookAt(0, 0, -30 - ip * 20);
  });

  if(!visible) return null;

  return (
    <group>
      {/* Tunnel particles */}
      <points frustumCulled={false}>
        <primitive object={geo}/>
        <shaderMaterial ref={mat}
          vertexShader={TUNNEL_V} fragmentShader={TUNNEL_F}
          uniforms={{ uTime:{value:0}, uOpacity:{value:1} }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
      </points>

      {/* Gravitational wave rings */}
      {rings.map((r,i)=>(
        <mesh key={i} rotation={[Math.PI/2,0,0]} position={[0,0,r.z]}>
          <ringGeometry args={[r.r, r.r+0.05, 200]}/>
          <primitive object={ringMats[i]} attach="material"/>
        </mesh>
      ))}

      {/* Singularity — bright white-blue core */}
      <mesh position={[0,0,-42]}>
        <sphereGeometry args={[0.9,24,24]}/>
        <meshBasicMaterial color={new THREE.Color(4,4,5.5)} transparent opacity={0.95}
          blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* Singularity inner glow */}
      <mesh position={[0,0,-42]} scale={[5,5,5]}>
        <sphereGeometry args={[1,16,16]}/>
        <meshBasicMaterial color={new THREE.Color(0.4,0.6,1.4)} transparent opacity={0.10}
          blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* Singularity outer halo */}
      <mesh position={[0,0,-42]} scale={[18,18,18]}>
        <sphereGeometry args={[1,16,16]}/>
        <meshBasicMaterial color={new THREE.Color(0.18,0.32,0.85)} transparent opacity={0.045}
          blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* Hawking radiation — dim blue glow surrounding tunnel */}
      <mesh position={[0,0,-22]} scale={[28,28,1]}>
        <planeGeometry args={[1,1]}/>
        <meshBasicMaterial color={new THREE.Color(0.08,0.15,0.55)} transparent opacity={0.035}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}/>
      </mesh>
    </group>
  );
}
