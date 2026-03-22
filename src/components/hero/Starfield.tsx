'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const V=`attribute float aSize;attribute float aSeed;attribute float aBright;uniform float uTime;uniform float uOpacity;varying float vB;varying float vS;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*(200./max(-mv.z,1.)),0.4,7.);vB=aBright;vS=aSeed;}`;
const F=`uniform float uTime;uniform float uOpacity;varying float vB;varying float vS;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float core=smoothstep(.06,.0,d);float glow=smoothstep(.50,.0,d)*.55;float tw=.82+.18*sin(uTime*(.3+vS*1.1)+vS*38.);float alpha=(core*1.1+glow)*vB*tw*uOpacity;if(alpha<.004)discard;vec3 col=mix(vec3(.78,.88,1.),vec3(1.,.90,.65),step(.82,vS)*.36);gl_FragColor=vec4(col,alpha);}`;

function mkGeo(n:number,r0:number,r1:number,s0:number,s1:number){
  const p=new Float32Array(n*3),sz=new Float32Array(n),sd=new Float32Array(n),br=new Float32Array(n);
  for(let i=0;i<n;i++){
    const r=r0+Math.random()*(r1-r0),t=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);
    p[i*3]=r*Math.sin(phi)*Math.cos(t);p[i*3+1]=r*Math.cos(phi);p[i*3+2]=r*Math.sin(phi)*Math.sin(t);
    sz[i]=s0+Math.random()*(s1-s0);sd[i]=Math.random();br[i]=.4+Math.random()*.6;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(p,3));
  g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
  g.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));
  g.setAttribute('aBright',new THREE.BufferAttribute(br,1));
  return g;
}

function Layer({n,r0,r1,s0,s1,op}:{n:number;r0:number;r1:number;s0:number;s1:number;op:number}){
  const mat=useRef<THREE.ShaderMaterial>(null!);
  const geo=useMemo(()=>mkGeo(n,r0,r1,s0,s1),[]);
  const sm=useMemo(()=>new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uOpacity:{value:1}},vertexShader:V,fragmentShader:F,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),[]);
  useFrame(({clock})=>{ if(!mat.current)return; mat.current.uniforms.uTime.value=clock.getElapsedTime(); mat.current.uniforms.uOpacity.value=op; });
  return(<points frustumCulled={false}><primitive object={geo}/><primitive object={sm} ref={mat} attach="material"/></points>);
}

export default function Starfield({opacity}:{opacity:number}){
  return(<group><Layer n={2200} r0={150} r1={280} s0={.25} s1={.85} op={opacity*.70}/><Layer n={650} r0={55} r1={150} s0={.45} s1={1.4} op={opacity*.90}/><Layer n={220} r0={20} r1={55} s0={.9} s1={2.2} op={opacity}/></group>);
}
