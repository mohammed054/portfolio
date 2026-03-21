'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Approach star field ───────────────────────────────────────────────────────
const STAR_VERT = /* glsl */`
attribute float aSize;
attribute float aSpeed;
attribute float aBright;
attribute vec3  aOrig;
uniform float uTime;
uniform vec2  uMouse;
uniform float uWarp;
varying float vBright;
void main(){
  vBright = aBright;
  vec3 pos = aOrig;
  pos.x += sin(uTime * aSpeed * .25 + aOrig.y * 1.8) * .07;
  pos.y += cos(uTime * aSpeed * .18 + aOrig.x * 1.5) * .05;
  vec2 mw = uMouse * 20.;
  vec2 toM = pos.xy - mw;
  float dM = length(toM);
  pos.xy += normalize(toM + .001) * (2. / (dM * dM + 1.)) * (1. - uWarp * .8);
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.);
  gl_PointSize = (aSize + uWarp * aSize * 2.) * (400. / -mvPos.z);
  gl_Position  = projectionMatrix * mvPos;
}`;

const STAR_FRAG = /* glsl */`
uniform float uTime;
uniform float uWarp;
varying float vBright;
void main(){
  vec2 uv = gl_PointCoord - .5;
  if(length(uv) > .5) discard;
  float core = exp(-length(uv) * 9.);
  float halo = exp(-length(uv) * 3.) * .4;
  float a    = (core + halo) * vBright;
  a *= mix(.80 + .20 * sin(uTime * 1.8 + vBright * 8.), 1.0, uWarp);
  vec3 col = mix(mix(vec3(.88,.92,1.), vec3(1.,.95,.82), vBright), vec3(.7,.88,1.), uWarp);
  gl_FragColor = vec4(col, a);
}`;

// ── Warp streaks ──────────────────────────────────────────────────────────────
const STREAK_VERT = /* glsl */`
attribute float aIsEnd;
attribute float aBright2;
uniform float uWarp;
varying float vBright2;
void main(){
  vBright2 = aBright2;
  vec3 pos = position;
  if(aIsEnd > .5){
    float radial = length(pos.xy);
    float stretch = uWarp * mix(18., 4., clamp(radial / 20., 0., 1.));
    pos.z += stretch;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}`;

const STREAK_FRAG = /* glsl */`
uniform float uWarp;
varying float vBright2;
void main(){
  float a = vBright2 * uWarp * uWarp * .9;
  gl_FragColor = vec4(mix(vec3(.6,.8,1.), vec3(.9,.96,1.), vBright2), a);
}`;

// ── INTERSTELLAR interior side-rushers ────────────────────────────────────────
// Stars rush inward from left + right like the Interstellar wormhole sequence.
// All vertex positions live in shader — geometry attributes carry the params only.
const INSIDE_VERT = /* glsl */`
attribute float aBright;
attribute float aSide;     // +1 right, -1 left
attribute float aPhase;    // 0..1  random timing offset → staggered start distances
attribute float aY;        // fixed world Y
attribute float aZ;        // fixed world Z (spread along corridor)
attribute float aIsEnd;    // 0 = head, 1 = tail

uniform float uTime;
uniform float uInside;     // 0..1 fade in/out
uniform float uSpeed;

varying float vBright;
varying float vAlpha;

void main(){
  vBright = aBright;
  vAlpha  = uInside;

  // Each star starts at a random distance (3..30 units) from center-X
  float startX = 3.0 + aPhase * 27.0;
  // Travel: cycles from startX → 0 → wraps. mod gives continuous loop.
  float travel = mod(uTime * uSpeed * (0.35 + aBright * 0.55), startX);
  float headX  = aSide * (startX - travel);

  vec3 pos = vec3(headX, aY, aZ);

  // Tail vertex: extend OUTWARD (opposite direction to travel)
  if(aIsEnd > .5){
    float tailLen = uInside * (2.5 + aBright * 14.0);
    pos.x += aSide * tailLen;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}`;

const INSIDE_FRAG = /* glsl */`
uniform float uInside;
varying float vBright;
varying float vAlpha;
void main(){
  // Orange-amber at low brightness (like accreting matter), blue-white at high
  vec3 col = mix(vec3(1.0, 0.55, 0.12), vec3(0.78, 0.92, 1.0), vBright);
  gl_FragColor = vec4(col, vBright * vAlpha * 0.95);
}`;

interface Props {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  scrollVelocity: React.MutableRefObject<number>;
  count?: number;
}

export default function StarField({ mouseRef, scrollProgress, scrollVelocity, count = 900 }: Props) {
  const pointsMatRef = useRef<THREE.ShaderMaterial>(null!);
  const streakMatRef = useRef<THREE.ShaderMaterial>(null!);
  const insideMatRef = useRef<THREE.ShaderMaterial>(null!);
  const smoothMouse  = useRef(new THREE.Vector2(0, 0));
  const warpSmooth   = useRef(0);
  const insideSmooth = useRef(0);

  // Approach star points
  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const sz   = new Float32Array(count);
    const spd  = new Float32Array(count);
    const br   = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r  = 16 + Math.random() * 22;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const x  = r * Math.sin(ph) * Math.cos(th);
      const y  = r * Math.sin(ph) * Math.sin(th);
      const z  = r * Math.cos(ph) - 8;
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
      orig[i*3]=x; orig[i*3+1]=y; orig[i*3+2]=z;
      sz[i]  = .5 + Math.random() * 2.4;
      spd[i] = .3 + Math.random() * .9;
      br[i]  = .35 + Math.random() * .65;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,  3));
    g.setAttribute('aOrig',    new THREE.BufferAttribute(orig, 3));
    g.setAttribute('aSize',    new THREE.BufferAttribute(sz,   1));
    g.setAttribute('aSpeed',   new THREE.BufferAttribute(spd,  1));
    g.setAttribute('aBright',  new THREE.BufferAttribute(br,   1));
    return g;
  }, [count]);

  // Warp streaks
  const streakGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 500;
    const pos    = new Float32Array(N * 6);
    const isEnd  = new Float32Array(N * 2);
    const bright = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      const r  = 2 + Math.random() * 30;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const x  = r * Math.sin(ph) * Math.cos(th);
      const y  = r * Math.sin(ph) * Math.sin(th);
      const z  = r * Math.cos(ph) - 8;
      const b  = .4 + Math.random() * .6;
      pos[i*6]=x; pos[i*6+1]=y; pos[i*6+2]=z;
      pos[i*6+3]=x; pos[i*6+4]=y; pos[i*6+5]=z;
      isEnd[i*2]=0;  bright[i*2]=b;
      isEnd[i*2+1]=1; bright[i*2+1]=b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,   3));
    g.setAttribute('aIsEnd',   new THREE.BufferAttribute(isEnd, 1));
    g.setAttribute('aBright2', new THREE.BufferAttribute(bright,1));
    return g;
  }, []);

  // Interstellar interior stars — 300 per side
  const insideGeo = useMemo(() => {
    const g   = new THREE.BufferGeometry();
    const PER = 300;
    const TOT = PER * 2;
    const V   = TOT * 2;  // 2 verts per line segment
    const pos    = new Float32Array(V * 3);
    const bright = new Float32Array(V);
    const side_a = new Float32Array(V);
    const phase  = new Float32Array(V);
    const yArr   = new Float32Array(V);
    const zArr   = new Float32Array(V);
    const isEnd  = new Float32Array(V);

    for (let i = 0; i < TOT; i++) {
      const s  = i < PER ? 1.0 : -1.0;
      const b  = 0.25 + Math.random() * 0.75;
      const ph = Math.random();
      const yv = (Math.random() - 0.5) * 14;
      // Z: span the corridor the camera travels through while inside
      const zv = 2 - Math.random() * 16;
      for (let v = 0; v < 2; v++) {
        const vi = i * 2 + v;
        pos[vi*3]=0; pos[vi*3+1]=0; pos[vi*3+2]=0;  // shader places them
        bright[vi] = b;
        side_a[vi] = s;
        phase[vi]  = ph;
        yArr[vi]   = yv;
        zArr[vi]   = zv;
        isEnd[vi]  = v;
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,    3));
    g.setAttribute('aBright',  new THREE.BufferAttribute(bright, 1));
    g.setAttribute('aSide',    new THREE.BufferAttribute(side_a, 1));
    g.setAttribute('aPhase',   new THREE.BufferAttribute(phase,  1));
    g.setAttribute('aY',       new THREE.BufferAttribute(yArr,   1));
    g.setAttribute('aZ',       new THREE.BufferAttribute(zArr,   1));
    g.setAttribute('aIsEnd',   new THREE.BufferAttribute(isEnd,  1));
    // Force bounding sphere so frustum culling doesn't hide these
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,-6), 35);
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const sp = scrollProgress.current;
    const sv = scrollVelocity.current;

    // Approach warp
    const tunnelBoost = sp > .30 && sp < .68 ? (sp - .30) / .38 : 0;
    warpSmooth.current += (Math.min(sv * 3.5 + tunnelBoost * .9, 1.0) - warpSmooth.current) * .07;

    // Inside: active 0.70 → 1.0
    // CRITICAL: no fade-out near the scroll cap (0.97) — just hold at full opacity
    const insideTarget = sp > 0.70 ? Math.min((sp - 0.70) / 0.06, 1.0) : 0;
    insideSmooth.current += (insideTarget - insideSmooth.current) * 0.06;

    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * .06;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * .06;

    if (pointsMatRef.current) {
      pointsMatRef.current.uniforms.uTime.value  = t;
      pointsMatRef.current.uniforms.uWarp.value  = warpSmooth.current;
      pointsMatRef.current.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y);
    }
    if (streakMatRef.current) streakMatRef.current.uniforms.uWarp.value  = warpSmooth.current;
    if (insideMatRef.current) {
      insideMatRef.current.uniforms.uTime.value   = t;
      insideMatRef.current.uniforms.uInside.value = insideSmooth.current;
    }
  });

  return (
    <>
      {/* Approach stars */}
      <points frustumCulled={false}>
        <primitive object={pointsGeo} />
        <shaderMaterial
          ref={pointsMatRef}
          vertexShader={STAR_VERT} fragmentShader={STAR_FRAG}
          uniforms={{ uTime:{value:0}, uMouse:{value:new THREE.Vector2()}, uWarp:{value:0} }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Warp streaks */}
      <lineSegments frustumCulled={false}>
        <primitive object={streakGeo} />
        <shaderMaterial
          ref={streakMatRef}
          vertexShader={STREAK_VERT} fragmentShader={STREAK_FRAG}
          uniforms={{ uWarp:{value:0} }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Interstellar side-rushers */}
      <lineSegments frustumCulled={false}>
        <primitive object={insideGeo} />
        <shaderMaterial
          ref={insideMatRef}
          vertexShader={INSIDE_VERT} fragmentShader={INSIDE_FRAG}
          uniforms={{ uTime:{value:0}, uInside:{value:0}, uSpeed:{value:4.5} }}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}