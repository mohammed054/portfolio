'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NOISE = /* glsl */`
vec3 m289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 m289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m289v4(((x*34.)+1.)*x);}
vec4 tiSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float sn(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=m289v3(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 nm=tiSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const DISK_VERT = `
varying vec3 vPos; varying float vRadius;
void main(){
  vPos=(modelMatrix*vec4(position,1.)).xyz;
  vRadius=length(vec2(position.x,position.z));
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`;

const DISK_FRAG = /* glsl */`
${NOISE}
uniform float uTime; uniform float uInner; uniform float uOuter; uniform float uOpacity;
varying vec3 vPos; varying float vRadius;

vec3 bbody(float t){
  // HDR blackbody — values intentionally > 1 for bloom
  if(t<.20) return mix(vec3(.6,.06,.01),vec3(1.4,.4,.08),t/.20);
  if(t<.45) return mix(vec3(1.4,.4,.08),vec3(2.2,1.2,.35),(t-.20)/.25);
  if(t<.70) return mix(vec3(2.2,1.2,.35),vec3(3.0,2.4,1.5),(t-.45)/.25);
  return mix(vec3(3.0,2.4,1.5),vec3(2.8,3.2,5.0),(t-.70)/.30);
}

void main(){
  float r=clamp((vRadius-uInner)/(uOuter-uInner),0.,1.);
  float t=1.-r;
  float ang=atan(vPos.z,vPos.x);
  float omega=min(.6/pow(max(vRadius,.01),1.5),3.);
  vec3 nc=vec3(cos(ang+uTime*omega)*vRadius, sin(ang+uTime*omega)*vRadius, uTime*.1);
  float n=sn(nc*2.1)*.5+sn(nc*5.2)*.3+sn(nc*11.)*.2;
  n=n*.5+.5;
  vec3 col=bbody(t)*mix(.4,2.1,n);
  // Doppler
  col*=max(1.+.85*sin(ang+uTime*.07),.12);
  // ISCO ring
  col+=vec3(4.,2.5,1.)*exp(-pow((r-.03)*20.,2.));
  float a=smoothstep(0.,.06,r)*smoothstep(0.,.06,1.-r)*uOpacity;
  gl_FragColor=vec4(col,a);
}`;

const HOR_VERT = `
varying vec3 vN; varying vec3 vV; varying vec3 vWN;
void main(){
  vN=normalize(normalMatrix*normal);
  vV=normalize(cameraPosition-(modelMatrix*vec4(position,1.)).xyz);
  vWN=normalize((modelMatrix*vec4(normal,0.)).xyz);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`;

const HOR_FRAG = `
uniform float uGlow;
varying vec3 vN; varying vec3 vV; varying vec3 vWN;
void main(){
  float rim=1.-abs(dot(normalize(vN),normalize(vV)));
  float ring=pow(clamp((rim-.78)/.22,0.,1.),1.2)*8.;
  float halo=pow(rim,6.)*.5;
  float eq=1.-abs(vWN.y);
  vec3 col=mix(vec3(.6,.3,3.),vec3(3.,1.2,.3),eq);
  gl_FragColor=vec4(col*(ring+halo)*uGlow,1.);
}`;

const LENS_VERT=`varying vec3 vN; varying vec3 vV;
void main(){vN=normalize(normalMatrix*normal);vV=normalize(cameraPosition-(modelMatrix*vec4(position,1.)).xyz);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const LENS_FRAG=`
varying vec3 vN; varying vec3 vV;
void main(){float rim=1.-abs(dot(normalize(vN),normalize(vV)));float b=pow(rim,5.);gl_FragColor=vec4(mix(vec3(0.),vec3(.5,.8,1.),b),b*.6);}`;

const COR_VERT=`attribute float aS; attribute float aR; varying float vR;
void main(){vR=aR;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aS*(340./-mv.z);gl_Position=projectionMatrix*mv;}`;
const COR_FRAG=`uniform float uT; varying float vR;
void main(){vec2 uv=gl_PointCoord-.5;if(length(uv)>.5)discard;float a=exp(-length(uv)*5.)*.9;
vec3 c=mix(vec3(1.,.5,.1),vec3(.7,.9,1.),vR);gl_FragColor=vec4(c*(.65+.35*sin(uT*3.5+vR*11.)),a);}`;

const JV=`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const JF=/* glsl */`${NOISE}
uniform float uT;uniform float uO;varying vec2 vU;
void main(){float t=vU.y;float r=abs(vU.x-.5)*2.;float cone=mix(.5,.04,t);if(r>cone)discard;
float rim=1.-r/cone;float n=sn(vec3(vU.x*4.,vU.y*8.-uT*1.5,uT*.3))*.5+.5;
vec3 c=mix(vec3(.4,.15,.95),vec3(.9,.95,1.),rim*n);
gl_FragColor=vec4(c*2.8,pow(rim,1.4)*smoothstep(1.,.8,t)*uO);}`;

interface Props {
  scrollProgress: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{x:number;y:number}>;
  onClick?: ()=>void;
}

export default function BlackHole({ scrollProgress, mouseRef, onClick }: Props) {
  const gRef   = useRef<THREE.Group>(null!);
  const dkRef  = useRef<THREE.ShaderMaterial>(null!);
  const dkGRef = useRef<THREE.ShaderMaterial>(null!);
  const hRef   = useRef<THREE.ShaderMaterial>(null!);
  const cRef   = useRef<THREE.ShaderMaterial>(null!);

  const INNER=1.42, OUTER=5.8;

  const cGeo = useMemo(()=>{
    const N=800,g=new THREE.BufferGeometry();
    const p=new Float32Array(N*3),s=new Float32Array(N),r=new Float32Array(N);
    for(let i=0;i<N;i++){
      const rd=1.5+Math.random()*3.2,th=Math.random()*Math.PI*2,ph=(Math.random()-.5)*.52;
      p[i*3]=rd*Math.cos(th);p[i*3+1]=Math.sin(ph)*rd*.25;p[i*3+2]=rd*Math.sin(th);
      s[i]=1.+Math.random()*3.5;r[i]=Math.random();
    }
    g.setAttribute('position',new THREE.BufferAttribute(p,3));
    g.setAttribute('aS',new THREE.BufferAttribute(s,1));
    g.setAttribute('aR',new THREE.BufferAttribute(r,1));
    return g;
  },[]);

  const dkU=(inn:number,out:number,op:number)=>({uTime:{value:0},uInner:{value:inn},uOuter:{value:out},uOpacity:{value:op}});

  useFrame(({clock})=>{
    const t=clock.getElapsedTime(), sp=scrollProgress.current;
    if(gRef.current && sp<.55){
      const {x,y}=mouseRef.current;
      gRef.current.rotation.x+=(y*.09-gRef.current.rotation.x)*.04;
      gRef.current.rotation.y+=(x*.13-gRef.current.rotation.y)*.04;
    }else if(gRef.current){ gRef.current.rotation.x*=.93; gRef.current.rotation.y*=.93; }
    if(dkRef.current){dkRef.current.uniforms.uTime.value=t;dkRef.current.uniforms.uOpacity.value=.7+sp*.35;}
    if(dkGRef.current){dkGRef.current.uniforms.uTime.value=t;dkGRef.current.uniforms.uOpacity.value=.3+sp*.25;}
    if(cRef.current)cRef.current.uniforms.uT.value=t;
    if(hRef.current)hRef.current.uniforms.uGlow.value+=(.8+sp*2.5-hRef.current.uniforms.uGlow.value)*.04;
  });

  return(
    <group ref={gRef} onClick={onClick}>
      {/* Black core */}
      <mesh renderOrder={0}><sphereGeometry args={[1.37,48,48]}/><meshBasicMaterial color="#000000"/></mesh>
      {/* Horizon glow rim */}
      <mesh renderOrder={1}><sphereGeometry args={[1.41,64,64]}/><shaderMaterial ref={hRef} vertexShader={HOR_VERT} fragmentShader={HOR_FRAG} uniforms={{uGlow:{value:.8}}}/></mesh>
      {/* Lensing halo */}
      <mesh><sphereGeometry args={[2.25,48,48]}/><shaderMaterial ref={null} vertexShader={LENS_VERT} fragmentShader={LENS_FRAG} transparent depthWrite={false} side={THREE.BackSide}/></mesh>
      {/* Main disk */}
      <mesh rotation={[-Math.PI/2+.38,0,0]}>
        <ringGeometry args={[INNER,OUTER,128,64]}/>
        <shaderMaterial ref={dkRef} vertexShader={DISK_VERT} fragmentShader={DISK_FRAG} uniforms={dkU(INNER,OUTER,.82)} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending}/>
      </mesh>
      {/* Ghost disk (lensed back half) */}
      <mesh rotation={[-Math.PI/2+.38+Math.PI*.88,0,Math.PI]} position={[0,.13,0]}>
        <ringGeometry args={[INNER*.9,OUTER*.48,96,32]}/>
        <shaderMaterial ref={dkGRef} vertexShader={DISK_VERT} fragmentShader={DISK_FRAG} uniforms={dkU(INNER*.9,OUTER*.48,.36)} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending}/>
      </mesh>
      {/* ISCO photon ring — very bright */}
      <mesh rotation={[-Math.PI/2+.38,0,0]}><torusGeometry args={[1.60,.052,32,128]}/><meshStandardMaterial color="#000" emissive="#ffcc44" emissiveIntensity={38} transparent opacity={.92}/></mesh>
      <mesh rotation={[-Math.PI/2+.38,0,0]}><torusGeometry args={[1.95,.025,24,96]}/><meshStandardMaterial color="#000" emissive="#88aaff" emissiveIntensity={20} transparent opacity={.5}/></mesh>
      <mesh rotation={[-Math.PI/2+.38,0,0]}><torusGeometry args={[2.65,.07,16,80]}/><meshStandardMaterial color="#000" emissive="#ff8800" emissiveIntensity={6} transparent opacity={.28}/></mesh>
      {/* Corona */}
      <points><primitive object={cGeo}/><shaderMaterial ref={cRef} vertexShader={COR_VERT} fragmentShader={COR_FRAG} uniforms={{uT:{value:0}}} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></points>
      {/* Jets */}
      <JetMesh d={1}/><JetMesh d={-1}/>
      {/* Lights */}
      <pointLight position={[0,0,0]} intensity={12} color="#ff9933" distance={14} decay={2}/>
      <pointLight position={[0,0,0]} intensity={6} color="#4466ff" distance={9} decay={2}/>
    </group>
  );
}

function JetMesh({d}:{d:1|-1}){
  const m=useRef<THREE.ShaderMaterial>(null!);
  useFrame(({clock})=>{if(m.current)m.current.uniforms.uT.value=clock.getElapsedTime();});
  return(
    <mesh position={[0,d*1.5,0]} rotation={d===1?[0,0,0]:[Math.PI,0,0]}>
      <cylinderGeometry args={[0,.55,4.5,32,32,true]}/>
      <shaderMaterial ref={m} vertexShader={JV} fragmentShader={JF} uniforms={{uT:{value:0},uO:{value:.6}}} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending}/>
    </mesh>
  );
}
