'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree }            from '@react-three/fiber';
import { EffectComposer, Bloom }                  from '@react-three/postprocessing';
import * as THREE                                 from 'three';
import Starfield                                  from '@/components/hero/Starfield';
import { timeline }                               from '@/lib/data';

/* ═══════════════════════════════════════════════════════════════
   SCROLL GEOMETRY
═══════════════════════════════════════════════════════════════ */

const N           = timeline.length;
const N_SM        = 90;
const N_ROCK      = N + N_SM;
const ABOUT_VH    = 620;
const TL_VH_ENTRY = 115;
const TOTAL_VH    = ABOUT_VH + (N + 1) * TL_VH_ENTRY;
const AF          = ABOUT_VH / TOTAL_VH;

const PH = {
  convStart:  AF * 0.22,
  convEnd:    AF * 0.52,
  textIn:     AF * 0.60,
  textHold:   AF * 0.80,
  dispStart:  AF * 0.83,
  dispEnd:    AF * 0.97,
  tlStart:    AF * 0.90,
} as const;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

const sr  = (s: number) => { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };
const sm  = (x: number, a: number, b: number) => THREE.MathUtils.smootherstep(x, a, b);
const lrp = (a: number, b: number, t: number) => THREE.MathUtils.lerp(a, b, t);
const xp  = (x: number, a: number, b: number, p = 1.8) =>
  Math.pow(Math.max(0, Math.min(1, (x - a) / Math.max(b - a, 1e-5))), p);

/* ═══════════════════════════════════════════════════════════════
   PROCEDURAL ROCK GEOMETRY
═══════════════════════════════════════════════════════════════ */

function makeRockGeo(radius: number, seed: number, detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const cnt = pos.count;
  const col = new Float32Array(cnt * 3);
  const h1  = (v: number) => Math.abs(Math.sin(v * 127.1 + seed * 311.7 + 17.3));
  const h2  = (v: number) => Math.abs(Math.sin(v *  73.1 + seed * 197.3 + 29.7));

  const sx = 0.72 + h1(seed * 1.1) * 0.56;
  const sy = 0.62 + h1(seed * 2.3) * 0.44;
  const sz = 0.78 + h1(seed * 3.7) * 0.66;

  const craterCount = 2 + ((seed * 7) % 4 | 0);
  const craters = Array.from({ length: craterCount }, (_, ci) => ({
    nx: h1(seed * 19 + ci * 137) * 2 - 1,
    ny: h1(seed * 31 + ci * 97)  * 2 - 1,
    nz: h1(seed * 53 + ci * 61)  * 2 - 1,
    radius: 0.28 + h1(seed * 11 + ci * 73) * 0.38,
    depth:  0.10 + h1(seed * 17 + ci * 41) * 0.22,
  }));

  const cutCount = 3 + ((seed * 3) % 4 | 0);
  const cuts = Array.from({ length: cutCount }, (_, ci) => {
    const pnx = h1(seed * 7  + ci * 53) * 2 - 1;
    const pny = h1(seed * 13 + ci * 79) * 2 - 1;
    const pnz = h1(seed * 23 + ci * 41) * 2 - 1;
    const pl  = Math.sqrt(pnx*pnx + pny*pny + pnz*pnz);
    const dist = radius * (0.55 + h1(seed * 29 + ci * 67) * 0.30);
    return { nx: pnx/pl, ny: pny/pl, nz: pnz/pl, d: dist };
  });

  for (let i = 0; i < cnt; i++) {
    let x = pos.getX(i) * sx;
    let y = pos.getY(i) * sy;
    let z = pos.getZ(i) * sz;
    const len = Math.sqrt(x*x + y*y + z*z);
    const nx = x/len, ny = y/len, nz = z/len;

    const lowFreq =
        h1(nx * 1.7 + ny * 2.3 + nz * 1.1) * 0.26
      + h1(nx * 3.1 + nz * 2.7 + ny * 1.9) * 0.11
      + h1(ny * 4.3 + nx * 1.8 + nz * 3.2) * 0.04;
    const grit = h1(nx * 18 + ny * 23 + nz * 15) * 0.016;

    let r = len * (0.82 + lowFreq + grit);

    for (const c of craters) {
      const cl = Math.sqrt(c.nx*c.nx + c.ny*c.ny + c.nz*c.nz);
      const cnx = c.nx/cl, cny = c.ny/cl, cnz = c.nz/cl;
      const dot = Math.max(-1, Math.min(1, nx*cnx + ny*cny + nz*cnz));
      const ang = Math.acos(dot);
      if (ang < c.radius) {
        const t = ang / c.radius;
        r -= c.depth * radius * (Math.cos(t * Math.PI) + 1) * 0.5;
      }
    }

    let wx = nx * r, wy = ny * r, wz = nz * r;

    for (const cut of cuts) {
      const proj = wx * cut.nx + wy * cut.ny + wz * cut.nz;
      if (proj > cut.d) {
        const excess = proj - cut.d;
        wx -= cut.nx * excess;
        wy -= cut.ny * excess;
        wz -= cut.nz * excess;
      }
    }

    pos.setXYZ(i, wx, wy, wz);

    const c  = h2(nx * 3.1 + ny * 7.3 + nz * 4.7);
    const sk = h1(ny * 8.7 + nz * 5.3 + nx * 3.1) > 0.74 ? 0.08 : 0;
    const b  = 0.13 + c * 0.18;
    col[i * 3]     = b + sk + 0.022;
    col[i * 3 + 1] = b + sk;
    col[i * 3 + 2] = b + sk - 0.012;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE POSITIONS + CAMERA PATH
═══════════════════════════════════════════════════════════════ */

const TL_POS = timeline.map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const r    = (o: number) => sr(i * 79 + o + 500);
  return new THREE.Vector3(
    side * (4.0 + r(1) * 1.2),
    (r(2) - 0.5) * 2.6,
    -i * 24 + (r(3) - 0.5) * 2.5,
  );
});

const CAM_KEYS = [
  new THREE.Vector3(0, 2.8, 42),
  ...TL_POS.map(p => new THREE.Vector3(p.x * 0.24, p.y * 0.18, p.z + 12)),
];
const LOOK_KEYS = [
  new THREE.Vector3(0, 0, -18),
  ...TL_POS,
];

/* ═══════════════════════════════════════════════════════════════
   ROCK CONFIGS
═══════════════════════════════════════════════════════════════ */

const ROCK_CFG = Array.from({ length: N_ROCK }, (_, i) => {
  const isTL = i < N;
  const r    = (o: number) => sr(i * 113.7 + o);

  const scatter = new THREE.Vector3(
    (r(1) - 0.5) * 28,
    (r(2) - 0.5) * 17,
    -(1 + r(3) * 25),
  );

  const wx0    = (r(4) - 0.5) * 14.5;
  const wy0    = (r(5) - 0.5) * 9.2;
  const wz0    = (r(6) - 0.5) * 4.6 - 1.2;
  const pocket = Math.max(0, 1 - ((wx0 / 4.8) ** 2 + (wy0 / 2.6) ** 2));
  const pushX  = (Math.sign(wx0) || (r(15) > 0.5 ? 1 : -1)) * pocket * 3.4;
  const pushY  = (Math.sign(wy0) || (r(16) > 0.5 ? 1 : -1)) * pocket * 2.2;

  const wall     = new THREE.Vector3(wx0 + pushX, wy0 + pushY, wz0 - pocket * 0.6);
  const disperse = isTL
    ? TL_POS[i].clone()
    : new THREE.Vector3((r(7) - 0.5) * 120, (r(8) - 0.5) * 80, -(60 + r(9) * 100));

  return {
    isTL, tlIdx: isTL ? i : -1,
    scatter, wall, disperse,
    radius:  isTL ? 2.2 + r(10) * 0.95 : 0.24 + r(10) * 0.75,
    detail:  isTL ? 4 : 3,
    seed:    (i * 41 + 7) | 0,
    fAmp:    0.07 + r(11) * 0.26,
    fSpd:    0.06 + r(12) * 0.18,
    rotSeed: r(13) * Math.PI * 2,
    rotSpd:  0.0028 + r(14) * 0.0090,
  };
});

/* ═══════════════════════════════════════════════════════════════
   TEXT SCRAMBLE
═══════════════════════════════════════════════════════════════ */

const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%·';

function useScramble(target: string, active: boolean, delay = 0): string {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!active) { setOut(''); return; }
    const tid = setTimeout(() => {
      let ci = 0, ck = 0;
      const step = () => {
        if (ci >= target.length) { setOut(target); return; }
        setOut(
          target.slice(0, ci) +
          (ck < 4 ? SC[Math.random() * SC.length | 0] : target[ci]) +
          target.slice(ci + 1).replace(/\S/g, '·'),
        );
        if (++ck > 4) { ck = 0; ci++; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(tid);
  }, [active, target, delay]);
  return out || '\u00a0';
}

/* ═══════════════════════════════════════════════════════════════
   COUNT UP
═══════════════════════════════════════════════════════════════ */

function CountUp({ to, suffix, active, delay }: {
  to: number; suffix: string; active: boolean; delay: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const tid = setTimeout(() => {
      let v = 0;
      const go = () => { setN(Math.min(++v, to)); if (v < to) setTimeout(go, 20); };
      go();
    }, delay);
    return () => clearTimeout(tid);
  }, [active, to, delay]);
  return <>{n}{suffix}</>;
}

/* ═══════════════════════════════════════════════════════════════
   DEBRIS STREAKS
═══════════════════════════════════════════════════════════════ */

const DEBRIS_COUNT = 180;

function Debris({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const ref   = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const sp    = scrollRef.current;
    const rise  = xp(sp, PH.dispStart * 0.82, PH.tlStart + 0.04, 1.3);
    const fall  = 1 - sm(sp, PH.tlStart + 0.10, PH.tlStart + 0.32);
    const speed = rise * fall;

    if (speed < 0.008) { ref.current.count = 0; return; }
    ref.current.count = DEBRIS_COUNT;

    const t = clock.getElapsedTime();
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const s0    = i * 7.317 + 1.4;
      const angle = sr(s0) * Math.PI * 2;
      const rad   = 3.5 + sr(s0 + 1) * 13;
      const z     = ((sr(s0 + 2) * 65 + t * (10 + sr(s0 + 3) * 22) * speed) % 65) - 8;
      dummy.position.set(Math.cos(angle) * rad, Math.sin(angle) * rad, z);
      dummy.scale.set(0.015, 0.015, 0.18 + speed * 2.6);
      dummy.rotation.z = angle;
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, DEBRIS_COUNT]} frustumCulled={false}>
      <boxGeometry />
      <meshBasicMaterial color="#3399ff" transparent opacity={0.48} />
    </instancedMesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROCK MESH
═══════════════════════════════════════════════════════════════ */

function RockMesh({
  cfg, scrollRef, activeRef, hoverRef,
}: {
  cfg:       typeof ROCK_CFG[0];
  scrollRef: React.MutableRefObject<number>;
  activeRef: React.MutableRefObject<number>;
  hoverRef:  React.MutableRefObject<number>;
}) {
  const mesh       = useRef<THREE.Mesh>(null!);
  const mat        = useRef<THREE.MeshStandardMaterial>(null!);
  const geo        = useMemo(() => makeRockGeo(cfg.radius, cfg.seed, cfg.detail), []);
  const { camera } = useThree();
  const initScale  = cfg.isTL ? 0.08 : 1.0;
  const gravOffset = useRef(new THREE.Vector3());
  const _emBase    = useMemo(() => new THREE.Color('#001840'), []);
  const _emActive  = useMemo(() => new THREE.Color('#002d60'), []);
  const _emHover   = useMemo(() => new THREE.Color('#003580'), []);

  useFrame(({ clock }) => {
    if (!mesh.current || !mat.current) return;
    const t  = clock.getElapsedTime();
    const sp = scrollRef.current;

    const convP  = sm(sp, PH.convStart, PH.convEnd);
    const dispP  = sm(sp, PH.dispStart, PH.dispEnd);
    const floatI = 0.18 + (1 - convP) * 0.82;
    const idle   = 0.05 + cfg.fAmp * 0.22;

    const fx = Math.sin(t * cfg.fSpd        + cfg.rotSeed)       * cfg.fAmp * floatI
             + Math.sin(t * 0.12 + cfg.rotSeed * 1.7)            * idle;
    const fy = Math.cos(t * cfg.fSpd * 0.70 + cfg.rotSeed * 1.5) * cfg.fAmp * floatI
             + Math.cos(t * 0.09 + cfg.rotSeed * 2.1)            * idle * 0.85;
    const fz = Math.sin(t * 0.07 + cfg.rotSeed * 1.3)            * idle * 0.65;

    const wx = lrp(cfg.scatter.x, cfg.wall.x, convP);
    const wy = lrp(cfg.scatter.y, cfg.wall.y, convP);
    const wz = lrp(cfg.scatter.z, cfg.wall.z, convP);

    let bx = lrp(wx, cfg.disperse.x, dispP) + fx;
    let by = lrp(wy, cfg.disperse.y, dispP) + fy;
    let bz = lrp(wz, cfg.disperse.z, dispP) + fz;

    const gravStrength = Math.max(0, 1 - sm(sp, PH.convStart * 0.35, PH.convEnd * 0.90));
    if (gravStrength > 0.004) {
      const gCenter = new THREE.Vector3(0, 0, -1.8);
      const dir     = gCenter.clone().sub(mesh.current.position);
      const dist    = dir.length();
      gravOffset.current.addScaledVector(dir.normalize(), (0.022 * gravStrength) / (dist * 0.09 + 0.60));
    }
    gravOffset.current.multiplyScalar(0.925);
    const gLen = gravOffset.current.length();
    if (gLen > 2.0) gravOffset.current.multiplyScalar(2.0 / gLen);

    const compP = sm(sp, PH.convEnd * 0.80, PH.tlStart);
    if (compP > 0.003) bz = lrp(bz, bz * 0.80, compP * 0.04);

    mesh.current.position.lerp(
      new THREE.Vector3(bx + gravOffset.current.x, by + gravOffset.current.y, bz + gravOffset.current.z),
      0.08,
    );

    mesh.current.rotation.x  = Math.sin(t * 0.09 + cfg.rotSeed)       * 0.50 * floatI;
    mesh.current.rotation.y += cfg.rotSpd * (1 + (cfg.isTL && sp > PH.tlStart ? 0.30 : 0));
    mesh.current.rotation.z  = Math.cos(t * 0.07 + cfg.rotSeed * 0.8) * 0.40 * floatI;

    if (cfg.isTL) {
      const isActive = activeRef.current === cfg.tlIdx;
      const isHover  = hoverRef.current  === cfg.tlIdx;
      const targetScale = lrp(initScale, 1.0 + (isHover ? 0.06 : 0), xp(dispP, 0, 1, 0.55));
      mesh.current.scale.setScalar(lrp(mesh.current.scale.x, targetScale, 0.07));

      if (sp >= PH.tlStart) {
        const dist     = mesh.current.position.distanceTo(camera.position);
        const proxGlow = Math.max(0, 1 - dist / 22) * 0.28;
        const baseGlow = isActive ? 0.62 : (isHover ? 0.22 : 0.06);
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, Math.min(1.0, baseGlow + proxGlow), 0.042);
        mat.current.emissive.lerp(isActive ? _emActive : isHover ? _emHover : _emBase, 0.06);
      } else {
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, xp(dispP, 0.1, 1, 0.5) * 0.07, 0.04);
        mat.current.emissive.lerp(_emBase, 0.04);
      }
    } else {
      mat.current.opacity = lrp(mat.current.opacity, Math.max(0, 1 - xp(dispP, 0.18, 0.88, 1.6)), 0.07);
    }
  });

  return (
    <mesh ref={mesh} geometry={geo} scale={initScale} frustumCulled={false}
      onPointerOver={() => { if (cfg.isTL) hoverRef.current = cfg.tlIdx; }}
      onPointerOut={()  => { if (cfg.isTL) hoverRef.current = -1; }}
    >
      <meshStandardMaterial
        ref={mat}
        vertexColors
        roughness={0.93}
        metalness={0.03}
        transparent={!cfg.isTL}
        depthWrite={cfg.isTL}
        flatShading={true}
        emissive={new THREE.Color('#001840')}
        emissiveIntensity={0.03}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE
═══════════════════════════════════════════════════════════════ */

function Scene({
  scrollRef, starOp, activeRef, bloomRef, hoverRef,
}: {
  scrollRef: React.MutableRefObject<number>;
  starOp:    number;
  activeRef: React.MutableRefObject<number>;
  bloomRef:  React.MutableRefObject<number>;
  hoverRef:  React.MutableRefObject<number>;
}) {
  const { camera, scene } = useThree();
  const lookTgt    = useRef(new THREE.Vector3(0, 0, 0));
  const lookSmooth = useRef(new THREE.Vector3(0, 0, 0));
  const camTarget  = useRef(new THREE.Vector3(0, 2.8, 42));
  const keyLight   = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    scene.fog = new THREE.Fog('#02030a', 1.5, 65);
    return () => { scene.fog = null; };
  }, [scene]);

  useFrame(({ clock }) => {
    const sp = scrollRef.current;
    const t  = clock.getElapsedTime();

    const driftAmp = sp < PH.convStart ? 0.0025 : sp < PH.convEnd ? 0.0060 : sp < PH.tlStart ? 0.0100 : 0.0025;
    camera.position.x += Math.sin(t * 0.21 + 1.1) * driftAmp;
    camera.position.y += Math.cos(t * 0.17 + 0.9) * driftAmp;

    if (sp < PH.tlStart) {
      camera.position.z = lrp(camera.position.z, 12, 0.05);
      lookTgt.current.set(0, 0, 0);
      lookSmooth.current.lerp(lookTgt.current, 0.065);
      camera.lookAt(lookSmooth.current);
    } else {
      const tlP  = (sp - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5);
      const segs = CAM_KEYS.length - 1;
      const tl   = Math.min(tlP * segs, segs - 1e-4);
      const seg  = Math.floor(tl);
      const f    = sm(tl - seg, 0, 1);
      camTarget.current.lerpVectors(CAM_KEYS[seg], CAM_KEYS[Math.min(seg + 1, segs)], f);
      camera.position.lerp(camTarget.current, 0.055);
      const li = new THREE.Vector3().lerpVectors(LOOK_KEYS[seg], LOOK_KEYS[Math.min(seg + 1, segs)], f);
      lookTgt.current.lerp(li, 0.050);
      lookSmooth.current.lerp(lookTgt.current, 0.058);
      camera.lookAt(lookSmooth.current);
      activeRef.current = Math.max(0, Math.min(Math.round(tl), segs) - 1);
      bloomRef.current  = 0.38 + tlP * 0.68;
    }

    if (keyLight.current) {
      const base    = lrp(1.30, 1.90, sm(sp, PH.tlStart, 1));
      const flicker = 1
        + Math.sin(t * 0.19 + 0.4) * 0.036 * sm(sp, PH.convStart, PH.tlStart)
        + Math.sin(t * 0.83 + 1.3) * 0.014
        + Math.sin(t * 2.17 + 0.7) * 0.008 * sm(sp, PH.dispStart, PH.tlStart);
      keyLight.current.intensity = base * flicker;
    }

    if (scene.fog instanceof THREE.Fog) {
      const fog      = scene.fog;
      const farConv  = lrp(65, 22, sm(sp, PH.convStart, PH.convEnd));
      const farEntry = lrp(farConv, 15, sm(sp, PH.convEnd, PH.tlStart));
      const farTL    = lrp(farEntry, 40, sm(sp, PH.tlStart, 1));
      fog.far  = lrp(fog.far,  farTL, 0.038);
      fog.near = lrp(fog.near, sp < PH.tlStart ? 1.5 : 0.4, 0.038);
    }
  });

  return (
    <>
      <Starfield opacity={starOp} />
      <ambientLight intensity={0.18} />
      <hemisphereLight intensity={0.22} color="#c7ddff" groundColor="#0b1020" />
      <directionalLight ref={keyLight} position={[9, 15, 8]} intensity={1.30} color="#c4d8ff" />
      <directionalLight position={[-6, -5, 5]} intensity={0.45} color="#ff8844" />
      <pointLight position={[0, 0, 14]}   intensity={1.10} color="#2277ff" distance={90} decay={2} />
      <pointLight position={[0, 6, 0]}    intensity={0.40} color="#0066ff" distance={90} decay={2} />
      <pointLight position={[0, -8, -24]} intensity={0.70} color="#003366" distance={70} decay={2} />
      <Debris scrollRef={scrollRef} />
      {ROCK_CFG.map((cfg, i) => (
        <RockMesh key={i} cfg={cfg} scrollRef={scrollRef} activeRef={activeRef} hoverRef={hoverRef} />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT TEXT OVERLAY
═══════════════════════════════════════════════════════════════ */

function AboutOverlay({ visible }: { visible: boolean }) {
  const l0 = useScramble("I don't build interfaces.",        visible, 60);
  const l1 = useScramble("I design controlled experiences.", visible, 460);
  const p0 = useScramble("Systems over features",  visible, 920);
  const p1 = useScramble("Precision over volume",  visible, 1120);
  const p2 = useScramble("Performance over noise", visible, 1320);
  const reveal = (d: string): React.CSSProperties => ({
    opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)',
    transition: `opacity .65s cubic-bezier(.16,1,.3,1) ${d}, transform .65s cubic-bezier(.16,1,.3,1) ${d}`,
  });
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: visible ? 1 : 0, transition: 'opacity .55s cubic-bezier(.16,1,.3,1)', pointerEvents: visible ? 'auto' : 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 100% 85% at 50% 50%, rgba(0,2,12,.68) 0%, rgba(0,2,12,.88) 55%, rgba(0,0,8,.97) 100%)` }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1180px', padding: '0 clamp(24px, 6vw, 80px)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'clamp(40px, 8vw, 110px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.4vh,28px)' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.34em', textTransform: 'uppercase', color: 'var(--cyan)', margin: 0, ...reveal('0s') }}>— Software Engineer</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {[{ text: l0, accent: false, d: '.06s' }, { text: l1, accent: true, d: '.18s' }].map(({ text, accent, d }) => (
              <p key={d} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(22px, 3vw, 40px)', color: accent ? 'var(--cyan)' : '#fff', lineHeight: 1.16, letterSpacing: '-0.015em', margin: 0, ...reveal(d) }}>{text}</p>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...reveal('.42s') }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 9px rgba(34,197,94,.80)', animation: 'dotPulse 2.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(130,180,210,.65)' }}>Available for work</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{ text: p0, d: '.66s' }, { text: p1, d: '.80s' }, { text: p2, d: '.94s' }].map(({ text, d }) => (
              <div key={d} style={{ display: 'flex', alignItems: 'baseline', gap: '13px', ...reveal(d) }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(0,200,255,.40)', flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.55, color: 'rgba(175,200,230,.75)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vh,38px)', ...reveal('.48s') }}>
          {[{ to: 5, s: '+', lbl: 'Years' }, { to: 40, s: '+', lbl: 'Projects' }, { to: 12, s: '+', lbl: 'Clients' }].map(({ to, s, lbl }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', lineHeight: 1, textShadow: '0 0 44px rgba(0,200,255,.30)' }}><CountUp to={to} suffix={s} active={visible} delay={660 + i * 180} /></span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(120,160,200,.50)' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE INFO PANEL
═══════════════════════════════════════════════════════════════ */

function TLPanel({ entry, visible }: { entry: (typeof timeline)[0] | null; visible: boolean }) {
  return (
    <div style={{ position: 'absolute', left: 'clamp(24px, 5vw, 60px)', bottom: 'clamp(60px, 10vh, 100px)', zIndex: 20, maxWidth: '380px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1)', pointerEvents: 'none' }}>
      {entry && (<>
        <div style={{ position: 'absolute', inset: '-16px -22px', background: 'rgba(0,4,22,.56)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '5px', border: '1px solid rgba(0,200,255,.09)', boxShadow: '0 0 60px rgba(0,0,0,.50)', zIndex: -1 }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--cyan)', display: 'block', marginBottom: '8px' }}>{(entry as any).year ?? ''}</span>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(20px, 2.8vw, 32px)', color: '#fff', lineHeight: 1.12, margin: '0 0 6px', textShadow: '0 0 36px rgba(0,180,255,.28)' }}>{entry.title}</h3>
        {'subtitle' in entry && (entry as any).subtitle && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(0,200,255,.50)', margin: '0 0 12px' }}>{(entry as any).subtitle}</p>}
        {'description' in entry && (entry as any).description && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px, 1.4vw, 14px)', lineHeight: 1.72, color: 'rgba(160,190,220,.68)', margin: 0 }}>{(entry as any).description}</p>}
      </>)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS DOTS
═══════════════════════════════════════════════════════════════ */

function TLDots({ active, total, visible }: { active: number; total: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'absolute', bottom: 'clamp(22px, 4vh, 42px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '10px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ width: i === active ? '20px' : '5px', height: '5px', borderRadius: '3px', background: i === active ? 'var(--cyan)' : 'rgba(0,200,255,.22)', boxShadow: i === active ? '0 0 10px rgba(0,200,255,.7)' : 'none', transition: 'all .45s cubic-bezier(.16,1,.3,1)' }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */

export default function PostHeroSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const activeRef = useRef(0);
  const hoverRef  = useRef(-1);
  const bloomRef  = useRef(0.30);
  const starOpRef = useRef(0.35);
  const flashRef  = useRef<HTMLDivElement>(null);

  const [sp,          setSp]          = useState(0);
  const [starOp,      setStarOp]      = useState(0.35);
  const [bloom,       setBloom]       = useState(0.30);
  const [active,      setActive]      = useState(0);
  const [infoKey,     setInfoKey]     = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  /* Single scroll listener — reads BoundingClientRect, no clamping */
  useEffect(() => {
    const fn = () => {
      const el = outerRef.current;
      if (!el) return;

      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const raw = -el.getBoundingClientRect().top / total;
      const p   = Math.max(0, Math.min(1, raw));
      scrollRef.current = p;
      setSp(p);

      const starRise = sm(p, 0, PH.convStart * 0.9);
      const starDim  = sm(p, PH.convEnd, PH.textIn);
      const starBack = sm(p, PH.dispStart, PH.tlStart + 0.08);
      let newStarOp  = lrp(0.35, 1.00, starRise);
      newStarOp      = lrp(newStarOp, 0.22, starDim);
      newStarOp      = lrp(newStarOp, 1.00, starBack);
      if (Math.abs(newStarOp - starOpRef.current) > 0.02) {
        starOpRef.current = newStarOp;
        setStarOp(newStarOp);
      }

      setTextVisible(p > PH.textIn && p < PH.dispStart + 0.06);

      if (flashRef.current) {
        const flashP = xp(p, PH.dispStart * 0.88, PH.tlStart + 0.02, 1.6)
                     * (1 - sm(p, PH.tlStart + 0.05, PH.tlStart + 0.22));
        flashRef.current.style.opacity = Math.min(0.80, flashP).toString();
      }

      const nb = bloomRef.current;
      setBloom(prev => Math.abs(prev - nb) > 0.02 ? nb : prev);

      if (p >= PH.tlStart) {
        const tlP   = (p - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5);
        const segs  = CAM_KEYS.length - 1;
        const tl    = Math.min(tlP * segs, segs - 1e-4);
        const stage = Math.min(Math.round(tl), segs);
        const rock  = Math.max(0, stage - 1);
        if (rock !== activeRef.current) {
          activeRef.current = rock;
          setActive(rock);
          setInfoKey(k => k + 1);
        }
      }
    };

    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /*
   * Wheel handler on the sticky container — NOT inside the R3F canvas.
   *
   * Why: WheelProxy (inside the canvas) only catches events that land on
   * the <canvas> DOM element. HTML overlays with pointer-events:auto
   * (e.g. AboutOverlay) intercept their own wheel events and never pass
   * them to the canvas, so WheelProxy never fires, preventDefault is
   * never called, and the browser triggers an uncontrolled native scroll
   * that fights the sticky layout → black gap + jump.
   *
   * Fix: attach one { passive:false } listener on the sticky div.
   * CAPTURE phase on the sticky container — fires before R3F's own
   * canvas event system, which calls stopPropagation() internally and
   * swallows the event before a bubble handler ever sees it.
   * capture:true guarantees we intercept every wheel event in the
   * viewport regardless of what child (canvas or overlay) is hovered.
   */
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0 });
    };
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
  }, []);

  const inTL       = sp >= PH.tlStart;
  const tlProgress = inTL ? (sp - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5) : 0;
  const isOverview = inTL && tlProgress * (CAM_KEYS.length - 1) < 0.5;

  const phaseLabel =
    !inTL && sp < PH.convStart  ? '— fragments adrift —'   :
    !inTL && sp < PH.convEnd    ? '— gravitational pull —' :
    !inTL && sp < PH.textIn     ? '— singularity —'        :
    !inTL && sp >= PH.dispStart ? '— dispersing —'         : '';

  return (
    <section
      ref={outerRef}
      id="about"
      style={{
        position: 'relative',
        height: `${TOTAL_VH}vh`,
        background: '#000',
        overscrollBehavior: 'none',
      }}
    >
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'clip', willChange: 'transform' }}>

        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 700 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.86 }}
          >
            <Scene scrollRef={scrollRef} starOp={starOp} activeRef={activeRef} bloomRef={bloomRef} hoverRef={hoverRef} />
            <EffectComposer>
              <Bloom intensity={bloom} luminanceThreshold={0.50} luminanceSmoothing={0.28} />
            </EffectComposer>
          </Canvas>
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(4,10,22,0.08) 0%, rgba(0,0,0,0.42) 72%, #000 100%)' }} />

        <div ref={flashRef} style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', opacity: 0, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,140,255,0.32) 0%, rgba(0,60,180,0.18) 45%, transparent 75%)', mixBlendMode: 'screen' }} />

        {phaseLabel && !inTL && (
          <div key={phaseLabel} style={{ position: 'absolute', top: 'clamp(18px, 3vh, 34px)', left: '50%', transform: 'translateX(-50%)', zIndex: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(0,185,255,.28)', whiteSpace: 'nowrap', pointerEvents: 'none', animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both' }}>
            {phaseLabel}
          </div>
        )}

        {inTL && (
          <div style={{ position: 'absolute', top: 'clamp(18px, 3.5vh, 36px)', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(20px, 5vw, 60px)', zIndex: 10, animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1) both' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.30em', textTransform: 'uppercase', color: 'rgba(0,200,255,.38)' }}>— Timeline</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(0,200,255,.24)' }}>{isOverview ? 'scroll to explore' : `${active + 1} / ${N}`}</span>
          </div>
        )}

        {inTL && isOverview && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', pointerEvents: 'none', animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1) .1s both' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '.34em', textTransform: 'uppercase', color: 'rgba(0,200,255,.30)', marginBottom: '14px' }}>— {N} milestones —</p>
            <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(0,200,255,.50), transparent)', margin: '0 auto', animation: 'linePulse 2s ease-in-out infinite' }} />
          </div>
        )}

        <AboutOverlay visible={textVisible} />
        <TLPanel key={infoKey} entry={inTL && !isOverview ? (timeline[active] ?? null) : null} visible={inTL && !isOverview} />
        <TLDots active={active} total={N} visible={inTL && !isOverview} />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,.04)', zIndex: 10 }}>
          <div style={{ height: '100%', width: `${sp * 100}%`, background: 'linear-gradient(to right, rgba(0,170,255,.55), rgba(0,220,255,.90))', boxShadow: '0 0 9px rgba(0,200,255,.42)', transition: 'width .18s ease' }} />
        </div>

      </div>
    </section>
  );
}