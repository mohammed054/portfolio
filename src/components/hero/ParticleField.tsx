'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const V=`attribute float aS;attribute float aP;attribute float aR;attribute float aY;uniform float uT;
void main(){float a=aP+uT*(.08/max(aR,.1));vec3 pos=vec3(cos(a)*aR,aY+sin(uT*.35+aP)*.28,sin(a)*aR);
vec4 mv=modelViewMatrix*vec4(pos,1.);gl_PointSize=aS*(260./-mv.z);gl_Position=projectionMatrix*mv;}`;
const F=`uniform float uT;void main(){vec2 uv=gl_PointCoord-.5;if(length(uv)>.5)discard;
float a=exp(-length(uv)*6.)*.5;vec3 c=mix(vec3(.47,.24,1.),vec3(.0,.82,1.),length(uv)*2.);gl_FragColor=vec4(c,a);}`;

export default function ParticleField({count=300}:{count?:number}){
  const mRef=useRef<THREE.ShaderMaterial>(null!);
  const geo=useMemo(()=>{
    const g=new THREE.BufferGeometry();
    const p=new Float32Array(count*3),s=new Float32Array(count),ph=new Float32Array(count),r=new Float32Array(count),y=new Float32Array(count);
    for(let i=0;i<count;i++){p[i*3]=0;s[i]=.7+Math.random()*1.8;ph[i]=Math.random()*Math.PI*2;r[i]=5+Math.random()*14;y[i]=(Math.random()-.5)*7;}
    g.setAttribute('position',new THREE.BufferAttribute(p,3));
    g.setAttribute('aS',new THREE.BufferAttribute(s,1));
    g.setAttribute('aP',new THREE.BufferAttribute(ph,1));
    g.setAttribute('aR',new THREE.BufferAttribute(r,1));
    g.setAttribute('aY',new THREE.BufferAttribute(y,1));
    return g;
  },[count]);
  useFrame(({clock})=>{if(mRef.current)mRef.current.uniforms.uT.value=clock.getElapsedTime();});
  return(
    <points frustumCulled={false}>
      <primitive object={geo}/>
      <shaderMaterial ref={mRef} vertexShader={V} fragmentShader={F} uniforms={{uT:{value:0}}} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
  );
}
