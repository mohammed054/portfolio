'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DISK_FRAG = `
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=.5; }
  return v;
}

void main(){
  vec2 uv = vUv - 0.5;
  float r  = length(uv);
  float a  = atan(uv.y, uv.x);
  float disk = smoothstep(0.062, 0.130, r) * smoothstep(0.50, 0.24, r);
  if(disk < 0.001){ gl_FragColor=vec4(0.); return; }

  float spin = a + r*11.0 - uTime*1.9;
  float turb = fbm(vec2(spin*2.4, r*8.5 - uTime*0.42));

  // Doppler: cos(a) +1=approaching(blue) -1=receding(orange-red)
  float dop = cos(a - uTime*0.18)*0.5 + 0.5;
  vec3 blue   = vec3(0.30, 0.68, 1.00)*3.0;
  vec3 orange = vec3(1.95, 0.78, 0.16)*2.5;
  vec3 white  = vec3(2.30, 1.95, 1.35);
  vec3 col = mix(orange, blue, dop);
  col = mix(col, white, smoothstep(0.21,0.072,r));

  float intensity = disk*(0.62+turb*1.55)*smoothstep(0.50,0.10,r);
  float ph = smoothstep(0.155,0.126,r)*smoothstep(0.126,0.158,r)*5.2;
  intensity += ph;

  gl_FragColor = vec4(col*intensity, intensity);
}`;

export default function BlackHole() {
  const groupRef = useRef<THREE.Group>(null!);
  const diskMat  = useMemo(()=>new THREE.ShaderMaterial({
    uniforms:{ uTime:{value:0} },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:DISK_FRAG,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  }),[]);

  const rings = useMemo(()=>[
    {inner:2.8,outer:11.0,tilt: 0, op:0.52},
    {inner:3.0,outer: 9.5,tilt: 7, op:0.27},
    {inner:3.0,outer: 9.5,tilt:-7, op:0.27},
    {inner:3.4,outer: 7.6,tilt:14, op:0.14},
    {inner:3.4,outer: 7.6,tilt:-14,op:0.14},
    {inner:3.8,outer: 5.8,tilt:22, op:0.07},
    {inner:3.8,outer: 5.8,tilt:-22,op:0.07},
  ],[]);

  const ringMats = useMemo(()=>rings.map(r=>new THREE.MeshBasicMaterial({
    color:new THREE.Color(1.55,0.80,0.26), transparent:true, opacity:r.op,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide,
  })),[rings]);

  useFrame(({clock})=>{
    diskMat.uniforms.uTime.value = clock.getElapsedTime();
    if(groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime()*0.075;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[24,24]}/>
        <primitive object={diskMat} attach="material"/>
      </mesh>
      {rings.map((r,i)=>(
        <mesh key={i} rotation={[Math.PI/2+THREE.MathUtils.degToRad(r.tilt),0,0]}>
          <ringGeometry args={[r.inner,r.outer,128]}/>
          <primitive object={ringMats[i]} attach="material"/>
        </mesh>
      ))}
      <mesh>
        <torusGeometry args={[3.74,0.062,20,256]}/>
        <meshBasicMaterial color={new THREE.Color(2.2,2.0,2.9)} transparent opacity={0.48} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      <mesh scale={[7.2,1.8,7.2]}>
        <sphereGeometry args={[1,32,32]}/>
        <meshBasicMaterial color={new THREE.Color(0.35,0.55,1.15)} transparent opacity={0.052} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      {/* Absolute void */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.70,64,64]}/>
        <meshBasicMaterial color="#000000"/>
      </mesh>
    </group>
  );
}
