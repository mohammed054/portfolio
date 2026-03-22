'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FRAG = `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
#define PI 3.14159265

void main(){
  vec2 uv  = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);
  if(r<0.032||r>0.46){ gl_FragColor=vec4(0.); return; }

  float n = 14.0;
  float rot = a + uTime*0.055;
  float ray  = pow(max(0., cos(mod(rot*n/(PI*2.),1.)*PI*2.)), 20.0);
  float ray2 = pow(max(0., cos(mod((rot+PI/n)*n/(PI*2.),1.)*PI*2.)), 35.0)*0.38;
  float fall = smoothstep(0.034,0.13,r)*smoothstep(0.46,0.12,r);
  float intensity = (ray+ray2)*fall*uStrength;

  vec3 warm = vec3(1.0,0.80,0.40);
  vec3 cool = vec3(0.50,0.74,1.00);
  vec3 col  = mix(warm, cool, smoothstep(0.0,0.38,r));
  gl_FragColor = vec4(col*intensity, intensity*0.88);
}`;

export default function LightRays({ strengthRef }:{ strengthRef: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const sm  = useMemo(()=>new THREE.ShaderMaterial({
    uniforms:{ uTime:{value:0}, uStrength:{value:0} },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:FRAG,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }),[]);
  useFrame(({clock})=>{
    if(!mat.current) return;
    mat.current.uniforms.uTime.value     = clock.getElapsedTime();
    mat.current.uniforms.uStrength.value = strengthRef.current;
  });
  return (
    <mesh scale={[46,46,46]} renderOrder={1}>
      <planeGeometry args={[1,1]}/>
      <primitive object={sm} ref={mat} attach="material"/>
    </mesh>
  );
}
