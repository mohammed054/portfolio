'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT RAYS v4  "HIGH CONTRAST"
   ─────────────────────────────────────────────────────────────────────────
   Rays are bright where they exist, but the GAPS between rays must be 0.
   Keeps the bright-on-dark look consistent with the disk redesign.

   ✓ Wide rays:  16 primary + 9 secondary, pow(cos,16) keeps them narrow
   ✓ Inner burst: bright concentrated flash near disk rim
   ✓ Corona pass: 7 slow ultra-wide rays, low opacity
   ✓ Strength multiplier toned to 1.2× (was 1.8×) — no oversaturation
═══════════════════════════════════════════════════════════════════════════ */

const FRAG_WIDE = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
#define PI 3.14159265358979

float hash1(float n){ return fract(sin(n)*43758.5453); }

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);
  if(r < 0.025 || r > 0.50){ gl_FragColor = vec4(0.); return; }

  float nA    = 16.0;
  float rotA  = a + uTime*0.044;
  float fracA = mod(rotA*nA/(PI*2.0),1.0);
  float rayA  = pow(max(0.0,cos(fracA*PI*2.0)),16.0);
  float wingA = pow(max(0.0,cos(fracA*PI*2.0)), 5.0)*0.22;

  float nB    = 9.0;
  float rotB  = a + uTime*0.066 + PI/nB;
  float fracB = mod(rotB*nB/(PI*2.0),1.0);
  float rayB  = pow(max(0.0,cos(fracB*PI*2.0)),22.0)*0.45;

  float brtA = 0.68 + 0.32*hash1(floor(mod(rotA*nA/(PI*2.0),nA))+0.5);
  float brtB = 0.52 + 0.48*hash1(floor(mod(rotB*nB/(PI*2.0),nB))+7.3);

  float rise = smoothstep(0.025,0.10,r);
  float fall = smoothstep(0.50,0.09,r);
  float turb = 0.84
    + 0.10*sin(r*42.0-uTime*2.1)
    + 0.06*sin(r*90.0-uTime*4.3+a*1.5);

  float ray = ((rayA+wingA)*brtA + rayB*brtB)*rise*fall*turb;
  float intensity = ray * uStrength * 1.20;
  if(intensity < 0.0015){ gl_FragColor = vec4(0.); return; }

  vec3 c0=vec3(0.80,0.25,0.04), c1=vec3(0.95,0.52,0.08);
  vec3 c2=vec3(1.00,0.78,0.20), c3=vec3(1.00,0.96,0.65);
  vec3 c4=vec3(0.78,0.90,1.00), c5=vec3(0.32,0.65,0.98);

  vec3 col = mix(c0,c1,smoothstep(0.025,0.11,r));
  col = mix(col,c2,smoothstep(0.09,0.20,r));
  col = mix(col,c3,smoothstep(0.17,0.30,r));
  col = mix(col,c4,smoothstep(0.25,0.40,r));
  col = mix(col,c5,smoothstep(0.34,0.50,r));
  col = mix(col,vec3(0.18,0.55,1.00),smoothstep(0.34,0.49,r)*0.35);

  gl_FragColor = vec4(col*intensity, intensity*0.92);
}`;

const FRAG_INNER = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
#define PI 3.14159265358979

float hash1(float n){ return fract(sin(n)*43758.5453); }

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);
  if(r < 0.030 || r > 0.22){ gl_FragColor = vec4(0.); return; }

  float n   = 16.0;
  float rot = a + uTime*0.044;
  float frac = mod(rot*n/(PI*2.0),1.0);
  float ray  = pow(max(0.0,cos(frac*PI*2.0)),12.0);
  float brt  = 0.70 + 0.30*hash1(floor(mod(rot*n/(PI*2.0),n))+2.9);

  float profile = smoothstep(0.030,0.07,r)*smoothstep(0.22,0.06,r);
  float intensity = ray*brt*profile*uStrength*1.10;
  if(intensity < 0.001){ gl_FragColor = vec4(0.); return; }

  vec3 col = mix(
    mix(vec3(0.98,0.95,0.82), vec3(0.98,0.74,0.24), smoothstep(0.04,0.14,r)),
    vec3(0.88,0.44,0.06),
    smoothstep(0.12,0.22,r)
  );
  gl_FragColor = vec4(col*intensity, intensity*0.88);
}`;

const FRAG_CORONA = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
#define PI 3.14159265358979

float hash1(float n){ return fract(sin(n)*43758.5453); }

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);
  if(r < 0.04 || r > 0.48){ gl_FragColor = vec4(0.); return; }

  float nC   = 7.0;
  float rotC = a + uTime*0.028;
  float frac = mod(rotC*nC/(PI*2.0),1.0);
  float rayC = pow(max(0.0,cos(frac*PI*2.0)),3.0)*0.35;
  float brtC = 0.50+0.50*hash1(floor(mod(rotC*nC/(PI*2.0),nC))+3.7);

  float profile  = smoothstep(0.04,0.18,r)*smoothstep(0.48,0.12,r);
  float intensity = rayC*brtC*profile*uStrength*0.45;
  if(intensity < 0.001){ gl_FragColor = vec4(0.); return; }

  vec3 col = mix(vec3(0.88,0.60,0.14), vec3(0.50,0.30,0.06), smoothstep(0.12,0.45,r));
  gl_FragColor = vec4(col*intensity, intensity*0.70);
}`;

const VERT = `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

export default function LightRays({ strengthRef }: { strengthRef: React.MutableRefObject<number> }) {
  const wideRef   = useRef<THREE.ShaderMaterial>(null!);
  const innerRef  = useRef<THREE.ShaderMaterial>(null!);
  const coronaRef = useRef<THREE.ShaderMaterial>(null!);

  const wideMat   = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, uStrength:{value:0} },
    vertexShader:VERT, fragmentShader:FRAG_WIDE,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }),[]);
  const innerMat  = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, uStrength:{value:0} },
    vertexShader:VERT, fragmentShader:FRAG_INNER,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }),[]);
  const coronaMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, uStrength:{value:0} },
    vertexShader:VERT, fragmentShader:FRAG_CORONA,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }),[]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = strengthRef.current;
    if(wideRef.current)   { wideRef.current.uniforms.uTime.value=t;   wideRef.current.uniforms.uStrength.value=s; }
    if(innerRef.current)  { innerRef.current.uniforms.uTime.value=t;  innerRef.current.uniforms.uStrength.value=s; }
    if(coronaRef.current) { coronaRef.current.uniforms.uTime.value=t; coronaRef.current.uniforms.uStrength.value=s; }
  });

  return (
    <>
      <mesh scale={[56,56,56]} renderOrder={1}>
        <planeGeometry args={[1,1]} />
        <primitive object={coronaMat} ref={coronaRef} attach="material" />
      </mesh>
      <mesh scale={[52,52,52]} renderOrder={1}>
        <planeGeometry args={[1,1]} />
        <primitive object={wideMat} ref={wideRef} attach="material" />
      </mesh>
      <mesh scale={[44,44,44]} renderOrder={1}>
        <planeGeometry args={[1,1]} />
        <primitive object={innerMat} ref={innerRef} attach="material" />
      </mesh>
    </>
  );
}