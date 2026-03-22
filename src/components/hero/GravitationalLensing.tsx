'use client';
import { useEffect, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

const frag=`
uniform float uStrength;
uniform vec2  uCenter;
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
  vec2 p=uv-uCenter; float r=length(p)+1e-6;
  vec2 dir=normalize(p); vec2 tang=vec2(-p.y,p.x);
  float s=clamp(uStrength,0.,0.32);
  float lens=s*(0.20/(r+0.06))*smoothstep(0.90,0.06,r);
  float drag=s*0.16/(r+0.14)*smoothstep(0.80,0.05,r);
  vec2 wUV=clamp(uv+dir*lens+tang*drag,0.001,0.999);
  vec4 col=texture2D(inputBuffer,wUV);
  float ring=smoothstep(0.21,0.168,r)*smoothstep(0.168,0.22,r);
  float boost=smoothstep(0.62,0.14,r)*s*0.38;
  outputColor=vec4(col.rgb*(1.+boost)+ring*s*0.85,col.a);
}`;

class LensEffect extends Effect {
  constructor(){super('LensEffect',frag,{uniforms:new Map([['uStrength',new Uniform(0)],['uCenter',new Uniform(new Vector2(0.5,0.5))]])});}
}

export default function GravitationalLensing({strengthRef}:{strengthRef:React.MutableRefObject<number>}){
  const effect=useMemo(()=>new LensEffect(),[]);
  useFrame(()=>{ effect.uniforms.get('uStrength')!.value=Math.min(strengthRef.current,0.32); });
  useEffect(()=>()=>effect.dispose(),[effect]);
  return <primitive object={effect}/>;
}
