'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  scrollRef:  React.MutableRefObject<number>;
  velRef:     React.MutableRefObject<number>;
  insideMixRef: React.MutableRefObject<number>;
}

const OV=`attribute float aAngle;attribute float aRadius;attribute float aHeight;attribute float aSeed;attribute float aSize;attribute float aLayer;uniform float uTime;uniform float uOpacity;uniform float uInside;varying float vAlpha;varying float vLayer;void main(){float speeds[3];speeds[0]=.07;speeds[1]=.21;speeds[2]=.62;float spd=(aLayer<.5)?speeds[0]:(aLayer<1.5)?speeds[1]:speeds[2];float ang=aAngle+uTime*spd*(0.75+aSeed*.5);vec3 pos=vec3(cos(ang)*aRadius,aHeight,sin(ang)*aRadius);if(uInside>.01){float tZ=mod(pos.z-uTime*(2.5+aSeed*3.)+40.,80.)-40.;pos.x=mix(pos.x,sign(pos.x+.001)*(3.+aSeed*8.),uInside);pos.y=mix(pos.y,sin(uTime*.4+aSeed*9.)*.22,uInside*.55);pos.z=mix(pos.z,tZ,uInside);}vec4 mv=modelViewMatrix*vec4(pos,1.);float sz=aSize*(155./max(-mv.z,.01))*(1.+uInside*1.8);gl_PointSize=clamp(sz,0.,16.);gl_Position=projectionMatrix*mv;float bright=.5+(2.-aLayer)*.28;vAlpha=bright*(.65+aSeed*.35)*uOpacity;vLayer=aLayer;}`;
const OF=`uniform float uInside;varying float vAlpha;varying float vLayer;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float core=smoothstep(.07,.0,d);float glow=smoothstep(.50,.0,d)*.55;vec3 c=(vLayer<.5)?vec3(.9,.82,.60):(vLayer<1.5)?vec3(.65,.86,1.):vec3(1.6,.85,.25);c=mix(c,vec3(.5,.78,1.),uInside*.65);gl_FragColor=vec4(c,(core+glow)*vAlpha);}`;
const SV=`attribute float aSeed;attribute float aRadius;attribute float aAngle;attribute float aAlong;uniform float uTime;uniform float uSpeed;uniform float uOpacity;varying float vAlpha;void main(){float ang=aAngle+uTime*.07*(0.5+aSeed*.5);vec3 dir=normalize(vec3(cos(ang),0.,sin(ang)));vec3 centre=dir*aRadius;float len=0.4+uSpeed*(5.+aSeed*10.);vec3 pos=centre+dir*aAlong*len;pos.y+=(aSeed-.5)*.15;vec4 mv=modelViewMatrix*vec4(pos,1.);gl_Position=projectionMatrix*mv;vAlpha=(0.5-abs(aAlong))*2.*uOpacity*clamp(uSpeed*3.,0.,1.);}`;
const SF=`varying float vAlpha;void main(){if(vAlpha<.005)discard;gl_FragColor=vec4(.70,.86,1.,vAlpha);}`;

export default function ParticleField({ scrollRef, velRef, insideMixRef }: Props) {
  const orbMat = useRef<THREE.ShaderMaterial>(null!);
  const slMat  = useRef<THREE.ShaderMaterial>(null!);
  const sSpeed  = useRef(0);
  const sInside = useRef(0);

  const orbGeo = useMemo(()=>{
    const L=[{c:520,r0:14,r1:42,h:.30,s0:.3,s1:1.0,l:0},{c:340,r0:5,r1:14,h:.14,s0:.5,s1:1.4,l:1},{c:220,r0:2.8,r1:7,h:.05,s0:.8,s1:2.0,l:2}];
    const total=L.reduce((s,l)=>s+l.c,0);
    const ang=new Float32Array(total),rad=new Float32Array(total),hgt=new Float32Array(total),sd=new Float32Array(total),sz=new Float32Array(total),ly=new Float32Array(total),pos=new Float32Array(total*3);
    let i=0;
    for(const l of L) for(let j=0;j<l.c;j++,i++){const r=l.r0+Math.random()*(l.r1-l.r0),a=Math.random()*Math.PI*2;ang[i]=a;rad[i]=r;hgt[i]=(Math.random()-.5)*2*r*l.h;sd[i]=Math.random();sz[i]=l.s0+Math.random()*(l.s1-l.s0);ly[i]=l.l;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=hgt[i];pos[i*3+2]=Math.sin(a)*r;}
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aAngle',new THREE.BufferAttribute(ang,1));g.setAttribute('aRadius',new THREE.BufferAttribute(rad,1));g.setAttribute('aHeight',new THREE.BufferAttribute(hgt,1));g.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));g.setAttribute('aLayer',new THREE.BufferAttribute(ly,1));
    return g;
  },[]);

  const slGeo = useMemo(()=>{
    const N=280;
    const pos=new Float32Array(N*2*3),sd=new Float32Array(N*2),rad=new Float32Array(N*2),ang=new Float32Array(N*2),al=new Float32Array(N*2);
    for(let i=0;i<N;i++){const r=5+Math.random()*36,a=Math.random()*Math.PI*2,s=Math.random(),y=(Math.random()-.5)*.3;for(let v=0;v<2;v++){const k=i*2+v;pos[k*3]=0;pos[k*3+1]=y;pos[k*3+2]=0;sd[k]=s;rad[k]=r;ang[k]=a;al[k]=v===0?-0.5:0.5;}}
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));g.setAttribute('aRadius',new THREE.BufferAttribute(rad,1));g.setAttribute('aAngle',new THREE.BufferAttribute(ang,1));g.setAttribute('aAlong',new THREE.BufferAttribute(al,1));
    return g;
  },[]);

  useFrame(({clock})=>{
    const t=clock.getElapsedTime();
    const vel=Math.min(Math.abs(velRef.current)*0.012,1.);
    sSpeed.current  += (vel-sSpeed.current)*0.07;
    sInside.current += (insideMixRef.current-sInside.current)*0.05;
    const op=1-sInside.current*0.25;
    if(orbMat.current){orbMat.current.uniforms.uTime.value=t;orbMat.current.uniforms.uOpacity.value=op;orbMat.current.uniforms.uInside.value=sInside.current;}
    if(slMat.current){slMat.current.uniforms.uTime.value=t;slMat.current.uniforms.uSpeed.value=sSpeed.current;slMat.current.uniforms.uOpacity.value=(1-sInside.current);}
  });

  return(<>
    <points frustumCulled={false}><primitive object={orbGeo}/><shaderMaterial ref={orbMat} vertexShader={OV} fragmentShader={OF} uniforms={{uTime:{value:0},uOpacity:{value:1},uInside:{value:0}}} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></points>
    <lineSegments frustumCulled={false}><primitive object={slGeo}/><shaderMaterial ref={slMat} vertexShader={SV} fragmentShader={SF} uniforms={{uTime:{value:0},uSpeed:{value:0},uOpacity:{value:0}}} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></lineSegments>
  </>);
}
