'use client';

import {
  createContext, useContext,
  useRef, useState, useEffect, useMemo, useCallback,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Starfield from '@/components/hero/Starfield';
import { timeline } from '@/lib/data';
import { useSceneStore } from '@/store/scene';
import { HERO_PROGRESS_PORTION } from '@/lib/scroll';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */

const N       = timeline.length;
const N_WALL  = 240;
const N_ROCK  = N + N_WALL;

const ABOUT_VH    = 760;
const TL_VH_ENTRY = 160;
const TOTAL_VH    = ABOUT_VH + (N + 1) * TL_VH_ENTRY;
const AF          = ABOUT_VH / TOTAL_VH;

/* ── Ring / Tunnel geometry ─────────────────────────────────── */
const RING_Z   = -14;
const RING_R   = 9.2;
const T_CLEAR  = 5.8;
const T_WALL_R = 14.0;
const T_NEAR_Z = RING_Z;
const T_FAR_Z  = -90;
const T_SPAN   = Math.abs(T_FAR_Z - T_NEAR_Z);

/* ══════════════════════════════════════════════════════════════
   CINEMATIC SCROLL PHASES
══════════════════════════════════════════════════════════════ */
const PH = {
  ringStart:   AF * 0.05,
  ringFull:    AF * 0.34,
  approachEnd: AF * 0.44,
  enterStart:  AF * 0.44,
  enterMid:    AF * 0.50,
  enterEnd:    AF * 0.59,
  textIn:      AF * 0.59,
  textFull:    AF * 0.68,
  dispStart:   AF * 0.76,
  dispEnd:     AF * 0.88,
  tlStart:     AF * 0.84,
} as const;

const SKIP_RING         = true;
const INTRO_DURATION_MS = 2400;

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const sr    = (s: number) => { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };
const sm    = (x: number, a: number, b: number) => THREE.MathUtils.smootherstep(x, a, b);
const lrp   = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const xp    = (x: number, a: number, b: number, p = 1.8) =>
  Math.pow(clamp((x - a) / Math.max(b - a, 1e-5), 0, 1), p);

const springEase = (t: number): number => {
  const c = clamp(t, 0, 1);
  return (1 - Math.pow(1 - c, 3.4)) + Math.sin(c * Math.PI * 2.6) * 0.048 * Math.pow(1 - c, 1.8);
};

const hopEase = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/* ══════════════════════════════════════════════════════════════
   WALL SLOTS
══════════════════════════════════════════════════════════════ */
interface TunnelSlot { angle: number; radius: number; z: number; }

const wallSlots: TunnelSlot[] = (() => {
  const slots: TunnelSlot[] = [];
  for (let i = 0; i < N; i++) {
    const r = (o: number) => sr(i * 79 + o + 200);
    const sideBase = i % 2 === 0 ? 0 : Math.PI;
    const angle = sideBase + (r(1) - 0.5) * 0.65;
    const depth = T_NEAR_Z - T_SPAN * 0.10 - i * ((T_SPAN * 0.80) / Math.max(N - 1, 1));
    slots.push({ angle, radius: T_CLEAR + 2.4 + r(2) * 2.4, z: depth });
  }
  for (let i = 0; i < N_WALL; i++) {
    const r = (o: number) => sr((i + N) * 113 + o);
    const angle  = r(1) * Math.PI * 2;
    const inner  = r(2) < 0.55;
    const radius = inner
      ? T_CLEAR + 1.2 + r(3) * 2.8
      : T_CLEAR + 4.0 + r(3) * (T_WALL_R - T_CLEAR - 4.0);
    const z = T_NEAR_Z - 0.5 - r(4) * (T_SPAN - 1);
    slots.push({ angle, radius, z });
  }
  return slots;
})();

/* ══════════════════════════════════════════════════════════════
   TIMELINE CAMERA PATH
   FIX 1: Overview camera pulled back to z=-38 so it sits clearly
   in front of (positive-Z side of) the first rock's z position,
   ensuring the first rock is always ahead of the camera.
   FIX 2: Look keys now point slightly past each rock's wall position
   (extrapolated along the cam→rock vector) so the camera begins
   rotating toward the next target well before it arrives.
══════════════════════════════════════════════════════════════ */
const TL_CAM_KEYS: THREE.Vector3[] = [
  // FIX 1: was z=-22, now z=-38 — sits behind ALL rocks in the tunnel
  new THREE.Vector3(0, 0.3, -38),
  ...timeline.map((_, i) => {
    const r    = (o: number) => sr(i * 79 + o + 500);
    const slot = wallSlots[i];
    const camAngle = slot.angle + (r(1) - 0.5) * 0.50;
    const camDist  = slot.radius * 0.68 + 0.6;
    return new THREE.Vector3(
      Math.cos(camAngle) * camDist + (r(2) - 0.5) * 0.35,
      Math.sin(camAngle) * camDist * 0.62 + (r(3) - 0.5) * 0.22,
      slot.z + 2.2,
    );
  }),
];

/* FIX 2: Look targets are pushed slightly *past* the rock surface
   (factor > 1) so the camera rotation leads the movement rather
   than lagging behind it. Factor 1.18 gives ~18% overshoot on
   the look vector — enough to start rotating early without feeling
   wild. */
const TL_LOOK_KEYS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, T_NEAR_Z - 20),
  ...timeline.map((_, i) => {
    const slot = wallSlots[i];
    const LOOK_LEAD = 1.18; // push look target past the rock surface
    return new THREE.Vector3(
      Math.cos(slot.angle) * slot.radius * LOOK_LEAD,
      Math.sin(slot.angle) * slot.radius * LOOK_LEAD,
      slot.z,
    );
  }),
];

/* ══════════════════════════════════════════════════════════════
   ROCK CONFIGS
══════════════════════════════════════════════════════════════ */
const ROCK_CFG = Array.from({ length: N_ROCK }, (_, i) => {
  const isTL = i < N;
  const r    = (o: number) => sr(i * 113.7 + o);
  const slot = wallSlots[i];

  const sR     = 9 + r(1) * 22;
  const sTheta = r(2) * Math.PI;
  const sPhi   = r(3) * Math.PI * 2;
  const scatter = new THREE.Vector3(
    Math.sin(sTheta) * Math.cos(sPhi) * sR,
    Math.sin(sTheta) * Math.sin(sPhi) * sR,
    -12 - r(4) * 24,
  );

  let ringPos: THREE.Vector3;
  if (isTL) {
    ringPos = new THREE.Vector3(
      (r(90) - 0.5) * 2.2,
      (r(91) - 0.5) * 2.2,
      slot.z,
    );
  } else {
    const wallIdx = i - N;
    const isFloater = r(98) < 0.22;
    if (isFloater) {
      const fAngle  = r(94) * Math.PI * 2;
      const fRadius = T_CLEAR + 3 + r(95) * (RING_R * 1.8);
      const fZ      = RING_Z + (r(97) - 0.5) * 18;
      ringPos = new THREE.Vector3(
        Math.cos(fAngle) * fRadius,
        Math.sin(fAngle) * fRadius,
        fZ,
      );
    } else {
      const baseAngle   = (wallIdx / N_WALL) * Math.PI * 2;
      const angleJitter = (r(94) - 0.5) * 2.6;
      const angle       = baseAngle + angleJitter;
      const innerCluster = r(99) < 0.28;
      const ringRadius   = innerCluster
        ? T_CLEAR + 0.8 + r(95) * 3.5
        : RING_R - 0.5 + (r(95) - 0.5) * 5.5;
      const zJitter = (r(97) - 0.5) * 8;
      ringPos = new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        Math.sin(angle) * ringRadius,
        RING_Z + zJitter,
      );
    }
  }

  const wall = new THREE.Vector3(
    Math.cos(slot.angle) * slot.radius,
    Math.sin(slot.angle) * slot.radius,
    slot.z,
  );

  const disperse = isTL
    ? wall.clone()
    : new THREE.Vector3(
        (r(7) - 0.5) * 80,
        (r(8) - 0.5) * 55,
        -(55 + r(9) * 90),
      );

  const wallIdx2  = isTL ? -1 : i - N;
  const ringAngle = isTL ? 0 : (wallIdx2 / N_WALL) * Math.PI * 2;
  const ringDelay = isTL
    ? r(11) * 0.022
    : (1 - Math.abs(Math.cos(ringAngle))) * 0.058 + r(11) * 0.038;

  const ringPosFinal   = SKIP_RING ? wall.clone() : ringPos;
  const ringDelayFinal = SKIP_RING ? 0 : ringDelay;

  const depthT     = clamp(Math.abs(slot.z - T_NEAR_Z) / T_SPAN, 0, 1);
  const depthScale = isTL ? 1.0 : Math.max(0.14, 1 - depthT * 0.78);

  return {
    isTL, tlIdx: isTL ? i : -1,
    scatter, ringPos: ringPosFinal, wall, disperse,
    ringDelay: ringDelayFinal,
    radius: isTL ? 1.15 + r(10) * 0.90 : (0.28 + r(10) * 0.72) * depthScale,
    detail: isTL ? 4 : depthScale > 0.55 ? 3 : 2,
    seed:    (i * 41 + 7) | 0,
    fAmp:    0.08 + r(11) * 0.26,
    fSpd:    0.012 + r(12) * 0.048,
    rotSeed: r(13) * Math.PI * 2,
    rotSpd:  0.0007 + r(14) * 0.0028,
    driftFx: 1.000 + r(15) * 0.618,
    driftFy: 0.618 + r(16) * 0.777,
    driftFz: 0.333 + r(17) * 0.444,
    driftPx: r(18) * Math.PI * 2,
    driftPy: r(19) * Math.PI * 2,
    driftPz: r(20) * Math.PI * 2,
    depthScale,
  };
});

/* ══════════════════════════════════════════════════════════════
   ROCK GEOMETRY
══════════════════════════════════════════════════════════════ */
function makeRockGeo(radius: number, seed: number, detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const cnt = pos.count;
  const col = new Float32Array(cnt * 3);
  const uvs = new Float32Array(cnt * 2);
  const h1  = (v: number) => Math.abs(Math.sin(v * 127.1 + seed * 311.7 + 17.3));
  const h2  = (v: number) => Math.abs(Math.sin(v *  73.1 + seed * 197.3 + 29.7));
  const sx  = 0.72 + h1(seed * 1.1) * 0.56;
  const sy  = 0.62 + h1(seed * 2.3) * 0.44;
  const sz  = 0.78 + h1(seed * 3.7) * 0.66;
  const craters = Array.from({ length: 2 + ((seed * 7) % 4 | 0) }, (_, ci) => ({
    nx: h1(seed * 19 + ci * 137) * 2 - 1, ny: h1(seed * 31 + ci * 97) * 2 - 1,
    nz: h1(seed * 53 + ci * 61) * 2 - 1,
    radius: 0.28 + h1(seed * 11 + ci * 73) * 0.38,
    depth:  0.10 + h1(seed * 17 + ci * 41) * 0.22,
  }));
  const cuts = Array.from({ length: 3 + ((seed * 3) % 4 | 0) }, (_, ci) => {
    const px = h1(seed * 7 + ci * 53) * 2 - 1;
    const py = h1(seed * 13 + ci * 79) * 2 - 1;
    const pz = h1(seed * 23 + ci * 41) * 2 - 1;
    const pl = Math.sqrt(px * px + py * py + pz * pz);
    return { nx: px / pl, ny: py / pl, nz: pz / pl, d: radius * (0.55 + h1(seed * 29 + ci * 67) * 0.30) };
  });
  for (let i = 0; i < cnt; i++) {
    let x = pos.getX(i) * sx, y = pos.getY(i) * sy, z = pos.getZ(i) * sz;
    const len = Math.sqrt(x * x + y * y + z * z), nx = x / len, ny = y / len, nz = z / len;
    const lf  = h1(nx * 1.7 + ny * 2.3 + nz * 1.1) * 0.26 + h1(nx * 3.1 + nz * 2.7 + ny * 1.9) * 0.11;
    let r = len * (0.82 + lf + h1(nx * 18 + ny * 23 + nz * 15) * 0.016);
    for (const c of craters) {
      const cl  = Math.sqrt(c.nx * c.nx + c.ny * c.ny + c.nz * c.nz);
      const dot = clamp(nx * (c.nx / cl) + ny * (c.ny / cl) + nz * (c.nz / cl), -1, 1);
      const ang = Math.acos(dot);
      if (ang < c.radius) r -= c.depth * radius * (Math.cos(ang / c.radius * Math.PI) + 1) * 0.5;
    }
    let wx = nx * r, wy = ny * r, wz = nz * r;
    for (const cut of cuts) {
      const proj = wx * cut.nx + wy * cut.ny + wz * cut.nz;
      if (proj > cut.d) { const e = proj - cut.d; wx -= cut.nx * e; wy -= cut.ny * e; wz -= cut.nz * e; }
    }
    pos.setXYZ(i, wx, wy, wz);
    const fl = Math.sqrt(wx * wx + wy * wy + wz * wz) + 1e-8;
    uvs[i * 2]     = (Math.atan2(wx / fl, wz / fl) / (Math.PI * 2)) + 0.5;
    uvs[i * 2 + 1] = (Math.asin(clamp(wy / fl, -1, 1)) / Math.PI) + 0.5;
    const c  = h2(nx * 3.1 + ny * 7.3 + nz * 4.7);
    const sk = h1(ny * 8.7 + nz * 5.3 + nx * 3.1) > 0.74 ? 0.09 : 0;
    const b  = 0.10 + c * 0.16;
    col[i * 3] = b + sk + 0.018; col[i * 3 + 1] = b + sk - 0.004; col[i * 3 + 2] = b + sk - 0.016;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('uv',    new THREE.BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

/* ══════════════════════════════════════════════════════════════
   TEXTURE CONTEXT
══════════════════════════════════════════════════════════════ */
interface RockTexSet { map: THREE.Texture | null; normalMap: THREE.Texture | null; roughnessMap: THREE.Texture | null; }
const TexCtx = createContext<RockTexSet>({ map: null, normalMap: null, roughnessMap: null });

function RockTexProvider({ children }: { children: React.ReactNode }) {
  const [tex, setTex] = useState<RockTexSet>({ map: null, normalMap: null, roughnessMap: null });
  useEffect(() => {
    const L = new THREE.TextureLoader();
    const maps = new Array<THREE.Texture>(3);
    let done = 0;
    const finish = () => {
      if (++done < 3) return;
      maps.forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; });
      setTex({ map: maps[0], normalMap: maps[1], roughnessMap: maps[2] });
    };
    ['/textures/rock/rock_face_03_diff_1k.jpg',
     '/textures/rock/rock_face_03_nor_gl_1k.png',
     '/textures/rock/rock_face_03_rough_1k.png',
    ].forEach((p, i) => L.load(p, t => { maps[i] = t; finish(); }));
  }, []);
  return <TexCtx.Provider value={tex}>{children}</TexCtx.Provider>;
}

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
interface FractureState {
  phase:       'sealed' | 'pretension' | 'vibrating' | 'cracking' | 'shattered';
  pressure:    number;
  shatterTime: number;
  worldPos:    THREE.Vector3;
}

interface FXState { bloom: number; chroma: number; }

interface SharedRefs {
  scrollRef:       React.MutableRefObject<number>;
  scrollVelRef:    React.MutableRefObject<number>;
  activeRef:       React.MutableRefObject<number>;
  hoverRef:        React.MutableRefObject<number>;
  hoverSmRef:      React.MutableRefObject<number>;
  fxRef:           React.MutableRefObject<FXState>;
  fractureRef:     React.MutableRefObject<FractureState[]>;
  chunkEventRef:   React.MutableRefObject<{ idx: number; pos: THREE.Vector3 } | null>;
}

/* ══════════════════════════════════════════════════════════════
   CHUNK SYSTEM
══════════════════════════════════════════════════════════════ */
const CHUNKS_PER_FRAC = 18;
const CHUNK_POOL      = CHUNKS_PER_FRAC * 6;

interface ChunkState {
  alive: boolean; pos: THREE.Vector3; vel: THREE.Vector3;
  rx: number; ry: number; rz: number;
  avx: number; avy: number; avz: number;
  scale: number; birth: number; life: number;
}

function ChunkSystem({ chunkEventRef }: { chunkEventRef: React.MutableRefObject<{ idx: number; pos: THREE.Vector3 } | null> }) {
  const mesh  = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo   = useMemo(() => makeRockGeo(0.22, 91, 1), []);
  const pool  = useRef<ChunkState[]>(
    Array.from({ length: CHUNK_POOL }, () => ({
      alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
      rx: 0, ry: 0, rz: 0, avx: 0, avy: 0, avz: 0,
      scale: 0, birth: 0, life: 3.2,
    }))
  );
  const cursor = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const ev = chunkEventRef.current;
    if (ev) {
      chunkEventRef.current = null;
      for (let c = 0; c < CHUNKS_PER_FRAC; c++) {
        const idx = (cursor.current++) % CHUNK_POOL;
        const r = (o: number) => sr(ev.idx * 53 + c * 17 + o);
        const spd = 0.38 + r(1) * 1.22;
        const theta = r(2) * Math.PI;
        const phi   = r(3) * Math.PI * 2;
        const p = pool.current[idx];
        p.alive = true;
        p.pos.copy(ev.pos).add(new THREE.Vector3(
          (r(4) - 0.5) * 0.25,
          (r(5) - 0.5) * 0.25,
          (r(6) - 0.5) * 0.25,
        ));
        p.vel.set(
          Math.sin(theta) * Math.cos(phi) * spd,
          Math.sin(theta) * Math.sin(phi) * spd,
          Math.cos(theta) * spd,
        );
        p.avx = (r(10) - 0.5) * 0.9;
        p.avy = (r(11) - 0.5) * 0.9;
        p.avz = (r(12) - 0.5) * 0.9;
        p.rx = r(7) * Math.PI * 2;
        p.ry = r(8) * Math.PI * 2;
        p.rz = r(9) * Math.PI * 2;
        p.scale = 0.18 + r(13) * 0.70;
        p.birth = clock.getElapsedTime();
        p.life  = 3.0 + r(14) * 1.8;
      }
    }

    let count = 0;
    for (let i = 0; i < CHUNK_POOL; i++) {
      const p = pool.current[i];
      if (!p.alive) continue;
      const age  = clock.getElapsedTime() - p.birth;
      const life = age / p.life;
      if (life >= 1) { p.alive = false; continue; }

      const dt = Math.min(delta, 0.05);
      p.pos.addScaledVector(p.vel, dt);
      p.vel.y -= 0.28 * dt;
      p.vel.multiplyScalar(1 - 0.18 * dt);

      p.rx += p.avx * dt;
      p.ry += p.avy * dt;
      p.rz += p.avz * dt;

      const fade = life < 0.08
        ? life / 0.08
        : 1 - Math.pow((life - 0.08) / 0.92, 2.2);
      const scl = p.scale * (1 - life * 0.12) * fade;

      dummy.position.copy(p.pos);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(scl);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(count++, dummy.matrix);
    }
    mesh.current.count = count;
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, CHUNK_POOL]} frustumCulled={false}>
      <meshStandardMaterial
        roughness={0.96}
        metalness={0.01}
        emissive={new THREE.Color('#1a2233')}
        emissiveIntensity={0.12}
        color="#8c8880"
      />
    </instancedMesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROCK MESH
══════════════════════════════════════════════════════════════ */
function RockMesh({ cfg, refs, rockIdx }: { cfg: typeof ROCK_CFG[0]; refs: SharedRefs; rockIdx: number }) {
  const mesh       = useRef<THREE.Mesh>(null!);
  const mat        = useRef<THREE.MeshStandardMaterial>(null!);
  const geo        = useMemo(() => makeRockGeo(cfg.radius, cfg.seed, cfg.detail), []);
  const textures   = useContext(TexCtx);
  const texApplied = useRef(false);
  const _tmpPos    = useMemo(() => new THREE.Vector3(), []);

  const _emBase   = useMemo(() => new THREE.Color('#010d1f'), []);
  const _emGlow   = useMemo(() => new THREE.Color('#c8d8f0'), []);
  const _emCrack  = useMemo(() => new THREE.Color('#e8edf5'), []);
  const _emActive = useMemo(() => new THREE.Color('#0050a8'), []);
  const _emHover  = useMemo(() => new THREE.Color('#1e6abf'), []);
  const _emWall   = useMemo(() => new THREE.Color('#040d22'), []);

  useEffect(() => {
    if (!mat.current || !textures.map || texApplied.current) return;
    texApplied.current = true;
    mat.current.map          = textures.map;
    mat.current.normalMap    = textures.normalMap;
    mat.current.roughnessMap = textures.roughnessMap;
    mat.current.normalScale  = new THREE.Vector2(1.8, 1.8);
    mat.current.vertexColors = false;
    mat.current.color.setRGB(0.72, 0.68, 0.64);
    mat.current.roughness    = 0.96;
    mat.current.metalness    = 0.02;
    mat.current.needsUpdate  = true;
  }, [textures.map]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current || !mat.current) return;
    const t  = clock.getElapsedTime();
    const sp = refs.scrollRef.current;

    const ringP     = sm(sp, PH.ringStart, PH.ringFull);
    const approachP = sm(sp, PH.ringFull, PH.approachEnd);
    const enterP    = sm(sp, PH.enterStart, PH.enterEnd);
    const dispP     = sm(sp, PH.dispStart, PH.dispEnd);
    const chaosAmt  = 1 - ringP;

    const dAmp = cfg.fAmp * 4.2 * chaosAmt;
    const driftX = (Math.sin(t * cfg.fSpd * cfg.driftFx + cfg.driftPx)
      + Math.sin(t * cfg.fSpd * cfg.driftFx * 1.618 + cfg.driftPy) * 0.55) * dAmp;
    const driftY = (Math.cos(t * cfg.fSpd * cfg.driftFy + cfg.driftPy)
      + Math.cos(t * cfg.fSpd * cfg.driftFy * 1.414 + cfg.driftPz) * 0.45) * dAmp * 0.85;
    const driftZ = Math.sin(t * cfg.fSpd * cfg.driftFz + cfg.driftPz) * dAmp * 0.28;

    const floatI = 0.04 + chaosAmt * 0.26;
    const idle   = cfg.fAmp * 0.10;
    const fx = Math.sin(t * 0.08 + cfg.rotSeed * 1.7) * idle * floatI;
    const fy = Math.cos(t * 0.06 + cfg.rotSeed * 2.1) * idle * floatI * 0.8;

    const rawRingSnap = clamp(
      (sp - PH.ringStart - cfg.ringDelay) / Math.max(PH.ringFull - PH.ringStart, 1e-5), 0, 1,
    );
    const ringSnapP = springEase(rawRingSnap);

    let bx = lrp(cfg.scatter.x + driftX + fx, cfg.ringPos.x, ringSnapP);
    let by = lrp(cfg.scatter.y + driftY + fy, cfg.ringPos.y, ringSnapP);
    let bz = lrp(cfg.scatter.z + driftZ, cfg.ringPos.z, ringSnapP);

    bx = lrp(bx, cfg.wall.x, enterP);
    by = lrp(by, cfg.wall.y, enterP);
    bz = lrp(bz, cfg.wall.z, enterP);

    if (!cfg.isTL) {
      bx = lrp(bx, cfg.disperse.x, dispP);
      by = lrp(by, cfg.disperse.y, dispP);
      bz = lrp(bz, cfg.disperse.z, dispP);
    }

    const holeScale = lrp(0.68, 1.0, enterP);
    bx *= holeScale;
    by *= holeScale;

    if (!cfg.isTL && enterP > 0) {
      const flow = (1 - cfg.depthScale) * enterP * 6.5;
      bz += flow;
    }

    if (!cfg.isTL && enterP > 0) {
      const tunnelDepth = sm(sp, PH.enterStart, PH.enterEnd);
      const driftAmt    = tunnelDepth * cfg.depthScale * 2.2;
      bz += Math.sin(t * 0.20 + cfg.rotSeed * 3.1) * driftAmt;
    }

    _tmpPos.set(bx, by, bz);
    mesh.current.position.lerp(_tmpPos, 0.062);

    const rotScale = 1 + chaosAmt * 1.4;
    mesh.current.rotation.x = Math.sin(t * 0.07 + cfg.rotSeed) * 0.38 * floatI * rotScale;
    mesh.current.rotation.y += cfg.rotSpd * rotScale;
    mesh.current.rotation.z = Math.cos(t * 0.05 + cfg.rotSeed * 0.8) * 0.28 * floatI * rotScale;

    if (cfg.isTL) {
      const frac     = refs.fractureRef.current[cfg.tlIdx];
      const isActive = refs.activeRef.current === cfg.tlIdx;
      const isHover  = refs.hoverRef.current  === cfg.tlIdx;
      const inTL     = sp >= PH.tlStart;

      const tunnelGrowP = sm(sp, PH.enterStart, PH.enterEnd);
      const baseScale   = lrp(0.06, 1.0, tunnelGrowP);

      if (frac?.phase === 'pretension') {
        const pulse = 1.0 + Math.sin(t * 5.5) * 0.025 * frac.pressure;
        mesh.current.scale.setScalar(lrp(mesh.current.scale.x, baseScale * pulse, 0.09));
        mat.current.emissive.lerp(_emGlow, 0.08);
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, frac.pressure * 0.55, 0.08);
      } else if (frac?.phase === 'vibrating' || frac?.phase === 'cracking') {
        const vib   = frac.pressure * 0.07;
        const crack = frac.pressure * (frac.phase === 'cracking' ? 1.0 : 0.6);
        mesh.current.position.x += (Math.random() - 0.5) * vib;
        mesh.current.position.y += (Math.random() - 0.5) * vib;
        mesh.current.scale.setScalar(lrp(mesh.current.scale.x, baseScale * (1.0 + crack * 0.10), 0.11));
        mat.current.emissive.lerp(frac.phase === 'cracking' ? _emCrack : _emGlow, 0.12);
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, crack * 1.6, 0.10);
      } else if (frac?.phase === 'shattered') {
        mesh.current.scale.setScalar(lrp(mesh.current.scale.x, 0, 0.16));
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, 0, 0.12);
      } else {
        const pulse = isHover && inTL ? 1.0 + Math.sin(t * 3.5) * 0.032 : 1.0;
        mesh.current.scale.setScalar(lrp(mesh.current.scale.x, baseScale * pulse, 0.07));
        const base = isActive ? 0.72 : isHover ? 0.30 : 0.055;
        mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, base, 0.035);
        mat.current.emissive.lerp(isActive ? _emActive : isHover ? _emHover : _emBase, 0.04);
      }

      if (frac) refs.fractureRef.current[cfg.tlIdx].worldPos.copy(mesh.current.position);

    } else {
      const isSmHov = refs.hoverSmRef.current === rockIdx;
      const inAbout = sp < PH.tlStart;

      const ringGlow = ringP * (1 - enterP) * 0.045;
      const hov      = isSmHov && inAbout ? 0.12 : 0;
      mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, ringGlow + hov, 0.06);
      mat.current.emissive.lerp(isSmHov && inAbout ? _emHover : _emWall, 0.05);

      if (isSmHov && inAbout) mesh.current.scale.setScalar(lrp(mesh.current.scale.x, 1.14, 0.06));
      else mesh.current.scale.setScalar(lrp(mesh.current.scale.x, 1.0, 0.05));

      const dispFade  = 1 - sm(sp, PH.dispStart, PH.dispEnd + 0.02);
      const baseOpacity = Math.max(0, 1 - xp(dispP, 0.14, 0.86, 1.6));
      mat.current.opacity = lrp(mat.current.opacity, Math.max(0, baseOpacity * dispFade), 0.07);
    }
  });

  const handleClick = useCallback(() => {
    if (!cfg.isTL) return;
    const frac = refs.fractureRef.current[cfg.tlIdx];
    if (!frac || frac.phase === 'shattered') return;
    if (frac.phase === 'sealed') refs.fractureRef.current[cfg.tlIdx] = { ...frac, phase: 'pretension' };
  }, [cfg.isTL, cfg.tlIdx, refs.fractureRef]);

  return (
    <mesh
      ref={mesh} geometry={geo} scale={cfg.isTL ? 0.06 : 1.0} frustumCulled={false}
      onPointerOver={() => {
        if (cfg.isTL) refs.hoverRef.current = cfg.tlIdx;
        else refs.hoverSmRef.current = rockIdx;
      }}
      onPointerOut={() => {
        if (cfg.isTL) refs.hoverRef.current = -1;
        else refs.hoverSmRef.current = -1;
      }}
      onClick={handleClick}
    >
      <meshStandardMaterial
        ref={mat}
        vertexColors roughness={0.96} metalness={0.02}
        transparent={!cfg.isTL} depthWrite={cfg.isTL} flatShading={false}
        emissive={new THREE.Color('#010d1f')} emissiveIntensity={0.02}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   FRACTURE DRIVER
══════════════════════════════════════════════════════════════ */
function FractureDriver({
  fractureRef, chunkEventRef, onShatter,
}: {
  fractureRef:   React.MutableRefObject<FractureState[]>;
  chunkEventRef: React.MutableRefObject<{ idx: number; pos: THREE.Vector3 } | null>;
  onShatter:     (idx: number) => void;
}) {
  useFrame(() => {
    fractureRef.current.forEach((frac, i) => {
      if (frac.phase === 'sealed' || frac.phase === 'shattered') return;
      if (frac.phase === 'pretension') {
        const next = Math.min(frac.pressure + 0.014, 0.50);
        fractureRef.current[i] = next >= 0.50
          ? { ...frac, phase: 'vibrating', pressure: next }
          : { ...frac, pressure: next };
      } else if (frac.phase === 'vibrating') {
        const next = Math.min(frac.pressure + 0.020, 1);
        fractureRef.current[i] = next >= 0.78
          ? { ...frac, phase: 'cracking', pressure: next }
          : { ...frac, pressure: next };
      } else if (frac.phase === 'cracking') {
        const next = Math.min(frac.pressure + 0.030, 1);
        if (next >= 1) {
          fractureRef.current[i] = { ...frac, phase: 'shattered', pressure: 1, shatterTime: performance.now() };
          chunkEventRef.current = { idx: i, pos: frac.worldPos.clone() };
          onShatter(i);
        } else fractureRef.current[i] = { ...frac, pressure: next };
      }
    });
  });
  return null;
}

/* ══════════════════════════════════════════════════════════════
   RING NEBULA
══════════════════════════════════════════════════════════════ */
function makeNebulaSpriteTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half);
  grd.addColorStop(0,   'rgba(80,130,255,1)');
  grd.addColorStop(0.4, 'rgba(40,80,220,0.6)');
  grd.addColorStop(1,   'rgba(10,30,120,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function RingNebula({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const N_NEB  = 320;

  const { positions } = useMemo(() => {
    const pos  = new Float32Array(N_NEB * 3);
    for (let i = 0; i < N_NEB; i++) {
      const r = (o: number) => sr(i * 137 + o + 8000);
      const angle   = r(1) * Math.PI * 2;
      const radBias = Math.pow(r(2), 0.6);
      const radius  = T_CLEAR * 0.5 + radBias * (RING_R * 1.5);
      const zSpread = (r(3) - 0.5) * 14;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = RING_Z + zSpread;
    }
    return { positions: pos };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const texture = useMemo(() => makeNebulaSpriteTexture(), []);

  useFrame(() => {
    if (!matRef.current) return;
    const sp  = scrollRef.current;
    const rP  = sm(sp, PH.ringStart + 0.06, PH.ringFull);
    const enP = sm(sp, PH.enterStart, PH.enterMid);
    matRef.current.opacity = rP * Math.max(0, 1 - enP * 2.2) * 0.08;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        ref={matRef} size={3.5} map={texture} color="#1a5fc4"
        transparent opacity={0} blending={THREE.AdditiveBlending}
        depthWrite={false} sizeAttenuation alphaTest={0.001}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   SPACE DUST
══════════════════════════════════════════════════════════════ */
function SpaceDust({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const N_DUST = 800;

  const geo = useMemo(() => {
    const pos = new Float32Array(N_DUST * 3);
    for (let i = 0; i < N_DUST; i++) {
      const r = (o: number) => sr(i * 97 + o + 5000);
      const angle  = r(1) * Math.PI * 2;
      const radius = r(2) * T_WALL_R * 1.2;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = T_NEAR_Z - r(3) * T_SPAN;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(() => {
    if (!matRef.current) return;
    const sp  = scrollRef.current;
    const enP = sm(sp, PH.enterStart, PH.enterEnd);
    const tlP = sm(sp, PH.tlStart, PH.tlStart + 0.08);
    matRef.current.opacity = enP * 0.26 * (1 - tlP * 0.4);
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        ref={matRef} size={0.04} color="#8ab4d4"
        transparent opacity={0} blending={THREE.AdditiveBlending}
        depthWrite={false} sizeAttenuation
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   TUNNEL DEPTH ATMOSPHERE
══════════════════════════════════════════════════════════════ */
function TunnelHaze({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const sp    = scrollRef.current;
    const t     = clock.getElapsedTime();
    const enP   = sm(sp, PH.enterStart, PH.enterEnd);
    const tlP   = sm(sp, PH.tlStart, PH.tlStart + 0.12);
    const pulse = 0.7 + Math.sin(t * 0.8) * 0.18 + Math.sin(t * 2.3 + 0.6) * 0.06;
    ref.current.intensity = enP * (1 - tlP * 0.3) * 3.5 * pulse;
  });
  return <pointLight ref={ref} position={[0, 0, T_FAR_Z + 12]} intensity={0} color="#1a4fc4" distance={55} decay={1.5} />;
}

/* ══════════════════════════════════════════════════════════════
   WARP STREAKS
══════════════════════════════════════════════════════════════ */
const WARP_COUNT = 80;
function WarpStreaks({ scrollRef, scrollVelRef }: {
  scrollRef:    React.MutableRefObject<number>;
  scrollVelRef: React.MutableRefObject<number>;
}) {
  const ref    = useRef<THREE.InstancedMesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const dummy  = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const sp  = scrollRef.current;
    const vel = scrollVelRef.current;
    const velDrive = clamp(vel * 3.5, 0, 1);

    const inDisperse = sp >= PH.dispStart && sp < PH.tlStart;
    const inTL       = sp >= PH.tlStart;

    if (!inDisperse && !inTL) { ref.current.count = 0; return; }
    if (velDrive < 0.12)      { ref.current.count = 0; return; }

    const drive = velDrive * (inTL ? 0.75 : 0.45);
    matRef.current.opacity = clamp(drive * 0.28, 0, 0.22);

    const count = Math.floor(WARP_COUNT * Math.min(drive * 1.2, 1));
    ref.current.count = count;
    const t     = clock.getElapsedTime();
    const speed = 10 + drive * 45;

    for (let i = 0; i < count; i++) {
      const s0  = i * 7.317 + 1.4;
      const ang = sr(s0) * Math.PI * 2;
      const rad = sr(s0 + 1) * T_CLEAR * 1.4;
      const zOffset = inTL ? -30 : 0;
      const z   = ((sr(s0 + 2) * 90 + t * speed) % 90) - 10 + zOffset;
      dummy.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, z);
      const len = 0.05 + drive * 1.8;
      dummy.scale.set(0.004, 0.004, len);
      dummy.rotation.z = ang;
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, WARP_COUNT]} frustumCulled={false}>
      <boxGeometry />
      <meshBasicMaterial ref={matRef} color="#a8d8ff" transparent opacity={0}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   POST-FX
══════════════════════════════════════════════════════════════ */
function PostFX({ fxRef }: { fxRef: React.MutableRefObject<FXState> }) {
  const bloomRef  = useRef<any>(null);
  const chromaRef = useRef<any>(null);
  useFrame(() => {
    const fx = fxRef.current;
    if (bloomRef.current) bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, fx.bloom, 0.07);
    if (chromaRef.current) { const c = fx.chroma * 0.0024; chromaRef.current.offset.set(c, c * 0.28); }
  });
  return (
    <EffectComposer>
      <Bloom ref={bloomRef} intensity={0.22} luminanceThreshold={0.48} luminanceSmoothing={0.36} mipmapBlur />
      <ChromaticAberration
        ref={chromaRef}
        offset={new THREE.Vector2(0, 0)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.62} />
    </EffectComposer>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════════ */
function Scene({ refs, starOp }: { refs: SharedRefs; starOp: number }) {
  const { camera, scene } = useThree();
  const lookTgt     = useRef(new THREE.Vector3(0, 0, -8));
  const lookSmooth  = useRef(new THREE.Vector3(0, 0, -8));
  const camTarget   = useRef(new THREE.Vector3(0, 0, 4));
  const camRot      = useRef(0);
  const keyLight    = useRef<THREE.DirectionalLight | null>(null);
  const ringLight   = useRef<THREE.PointLight | null>(null);
  const tunnelLight = useRef<THREE.PointLight | null>(null);
  const camLight    = useRef<THREE.PointLight | null>(null);

  const tlSmooth = useRef(0);
  const tlInRef  = useRef(false);

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#020409', 0.006);
    return () => { scene.fog = null; };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const sp  = refs.scrollRef.current;
    const t   = clock.getElapsedTime();
    const cam = camera as THREE.PerspectiveCamera;

    const ringP     = sm(sp, PH.ringStart, PH.ringFull);
    const approachP = sm(sp, PH.ringFull, PH.approachEnd);
    const enterP    = sm(sp, PH.enterStart, PH.enterEnd);
    const tlP       = sm(sp, PH.tlStart, 1);
    const inTL      = sp >= PH.tlStart;
    refs.scrollVelRef.current = lrp(refs.scrollVelRef.current, 0, inTL ? 0.08 : 0.05);
    const vel = refs.scrollVelRef.current;
    if (!inTL && tlInRef.current) tlInRef.current = false;

    const entryBell = Math.sin(clamp(enterP, 0, 1) * Math.PI);

    const baseFov = sp < PH.enterStart
      ? lrp(60, 64, ringP * 0.5 + approachP * 0.5)
      : lrp(64, 82, Math.pow(enterP, 1.4));
    const tlFov = lrp(baseFov, 56, tlP);

    const velFov = inTL ? 0 : clamp(vel * 18, 0, 10);
    cam.fov = lrp(cam.fov, tlFov + velFov, 0.08);
    cam.updateProjectionMatrix();

    refs.fxRef.current.bloom =
      sp < PH.ringStart  ? 0.22
      : sp < PH.ringFull  ? lrp(0.22, 0.42, ringP)
      : sp < PH.enterEnd  ? lrp(0.42, 0.30, enterP) + entryBell * 2.10
      : sp >= PH.tlStart  ? lrp(0.30, 0.85, tlP)
      : 0.30;
    refs.fxRef.current.chroma =
      entryBell * 1.4 +
      sm(sp, PH.dispStart, PH.dispEnd) * 0.6 +
      clamp(vel * 3.5, 0, 1.2);

    const dA = inTL ? 0 : (sp < PH.ringStart ? 0.0015 : sp < PH.enterEnd ? 0.003 : 0.0012);
    if (!inTL) {
      camera.position.x += Math.sin(t * 0.17 + 1.1) * dA;
      camera.position.y += Math.cos(t * 0.13 + 0.9) * dA;

      const shakeAmt = clamp(vel * 0.065, 0, 0.12);
      if (shakeAmt > 0.003) {
        const s1 = Math.sin(t * 47.3 + 0.7);
        const s2 = Math.cos(t * 53.1 + 1.3);
        const s3 = Math.sin(t * 61.7 + 2.1);
        camera.position.x += s1 * shakeAmt;
        camera.position.y += s2 * shakeAmt * 0.8;
        camRot.current = lrp(camRot.current, s3 * shakeAmt * 0.018, 0.25);
        camera.rotation.z = camRot.current;
      } else {
        camRot.current = lrp(camRot.current, 0, 0.1);
        camera.rotation.z = camRot.current;
      }
    } else {
      camRot.current = lrp(camRot.current, 0, 0.1);
      camera.rotation.z = camRot.current;
    }

    if (sp < PH.enterStart) {
      const camZ = lrp(7.5, -11, approachP);
      const camY = lrp(0, 0.2, ringP * 0.6);
      camTarget.current.set(0, camY, camZ);
      camera.position.lerp(camTarget.current, 0.022);

      const lookZ = lrp(-8, RING_Z - 12, ringP);
      lookTgt.current.set(
        Math.sin(t * 0.055) * 0.5 * (1 - ringP * 0.85),
        Math.cos(t * 0.045) * 0.35 * (1 - ringP * 0.85),
        lookZ,
      );

    } else if (sp < PH.tlStart) {
      const camZ = lrp(-11, -28, enterP);
      const camY = lrp(0.2, 0, enterP);
      camTarget.current.set(0, camY, camZ);
      camera.position.lerp(camTarget.current, 0.030);

      const lookZ = lrp(RING_Z - 8, T_FAR_Z * 0.55, enterP);
      lookTgt.current.set(
        Math.sin(t * 0.09) * 0.5 * (1 - enterP * 0.75),
        Math.cos(t * 0.07) * 0.35 * (1 - enterP * 0.75),
        lookZ,
      );

    } else {
      /* ── TIMELINE CAMERA ──────────────────────────────────────
         FIX 2: Look target is interpolated one full segment ahead
         of the camera position segment. This means the camera is
         already rotating toward the next rock while it's still
         traveling to the current one, rather than snapping once
         it arrives. The look lerp is tightened (0.9 → 0.14·delta*9)
         so it tracks ahead smoothly rather than lagging.
      ────────────────────────────────────────────────────────── */
      const tlRaw  = (sp - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5);
      const segs   = TL_CAM_KEYS.length - 1;
      const rawTL  = Math.min(tlRaw * segs, segs - 1e-4);
      const snap   = clamp(1 - vel * 1.4, 0, 1);
      const tlTarget = lrp(rawTL, Math.round(rawTL), snap * 0.45);
      if (!tlInRef.current) { tlSmooth.current = tlTarget; tlInRef.current = true; }
      tlSmooth.current = lrp(tlSmooth.current, tlTarget, 0.12);
      const tl     = clamp(tlSmooth.current, 0, segs - 1e-4);
      const seg    = Math.floor(tl);
      const fEased = hopEase(tl - seg);

      // Camera position: interpolate between current and next key
      const tgtPos = new THREE.Vector3().lerpVectors(
        TL_CAM_KEYS[seg],
        TL_CAM_KEYS[Math.min(seg + 1, segs)],
        fEased,
      );

      const damp = 1 - Math.exp(-delta * 6);
      camera.position.lerp(tgtPos, damp);

      // FIX 2: Look target runs one segment ahead — camera faces
      // the *next* rock before it arrives there.
      const lookSeg    = Math.min(seg + 1, segs);    // one ahead
      const lookSegEnd = Math.min(lookSeg + 1, segs);
      const li = new THREE.Vector3().lerpVectors(
        TL_LOOK_KEYS[lookSeg],
        TL_LOOK_KEYS[lookSegEnd],
        fEased,
      );
      // Tighter look tracking so the anticipation is snappy
      lookTgt.current.lerp(li, damp * 0.85);

      const rockIdx = clamp(Math.round(tl) - 1, 0, N - 1);
      refs.activeRef.current = rockIdx;

      if (camLight.current) {
        const ahead = lookTgt.current.clone().sub(camera.position).normalize().multiplyScalar(14);
        camLight.current.position.copy(camera.position).add(ahead);
      }
    }

    lookSmooth.current.lerp(lookTgt.current, 0.034);
    camera.lookAt(lookSmooth.current);

    if (keyLight.current) {
      const flicker = 1 + Math.sin(t * 0.19) * 0.018 + Math.sin(t * 0.83) * 0.008;
      keyLight.current.intensity = lrp(1.6, 2.4, tlP) * flicker;
    }

    if (ringLight.current) {
      const intensity = ringP * (1 - enterP * 1.4) * 7.0 * (0.7 + Math.sin(t * 1.4) * 0.12);
      ringLight.current.intensity = Math.max(0, intensity);
    }

    if (tunnelLight.current) {
      tunnelLight.current.intensity = enterP * 4.5 * (0.8 + Math.sin(t * 0.9) * 0.10);
    }

    if (scene.fog instanceof THREE.FogExp2) {
      const target = sp < PH.ringStart ? 0.005
        : sp < PH.enterStart ? lrp(0.005, 0.007, ringP)
        : sp < PH.enterEnd   ? lrp(0.007, 0.014, enterP)
        : sp >= PH.tlStart   ? 0.016
        : 0.011;
      scene.fog.density = lrp(scene.fog.density, target, 0.036);
    }
  });

  return (
    <>
      <Starfield opacity={starOp} />
      <ambientLight intensity={0.10} />
      <hemisphereLight intensity={0.18} color="#c8d8ff" groundColor="#020614" />
      <directionalLight ref={keyLight} position={[7, 11, 6]} intensity={1.6} color="#ccd8ff" />
      <directionalLight position={[-5, -3, 4]} intensity={0.12} color="#7dd3fc" />

      <pointLight ref={ringLight} position={[0, 0, RING_Z]} intensity={0} color="#2255cc" distance={30} decay={1.8} />
      <pointLight ref={camLight} position={[0, 0, -24]} intensity={0} color="#1d60cc" distance={65} decay={1.9} />
      <pointLight position={[0, 0, -30]} intensity={0.8} color="#2260cc" distance={55} decay={2} />
      <pointLight position={[0, 0, -55]} intensity={0.6} color="#1a4fa8" distance={50} decay={2} />
      <pointLight ref={tunnelLight} position={[0, 0, -24]} intensity={0} color="#1d5ab8" distance={80} decay={2} />

      <RockTexProvider>
        <SpaceDust  scrollRef={refs.scrollRef} />
        <TunnelHaze scrollRef={refs.scrollRef} />
        <WarpStreaks scrollRef={refs.scrollRef} scrollVelRef={refs.scrollVelRef} />
        {ROCK_CFG.map((cfg, i) => (
          <RockMesh key={i} cfg={cfg} refs={refs} rockIdx={i} />
        ))}
        <ChunkSystem chunkEventRef={refs.chunkEventRef} />
      </RockTexProvider>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEXT SCRAMBLE
══════════════════════════════════════════════════════════════ */
const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%·';
function useScramble(target: string, active: boolean, velRef: React.MutableRefObject<number>, delay = 0): string {
  const [out, setOut]    = useState('');
  const ciRef  = useRef(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!active) { setOut(''); ciRef.current = 0; return; }
    let frame = 0;
    const tid = setTimeout(() => {
      ciRef.current = 0;
      const step = () => {
        const ci = ciRef.current;
        if (ci >= target.length) { setOut(target); return; }
        const vel = velRef.current;
        const fpC = Math.max(1, Math.round(5 / (1 + vel * 25)));
        setOut(
          target.slice(0, ci) +
          SC[Math.random() * SC.length | 0] +
          Array.from({ length: Math.max(0, target.length - ci - 1) }, () => '·').join(''),
        );
        if (++frame % fpC === 0) ciRef.current++;
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(rafRef.current); };
  }, [active, target, delay]);
  return out || '\u00a0';
}

function CountUp({ to, suffix, active, delay }: { to: number; suffix: string; active: boolean; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const tid = setTimeout(() => {
      let v = 0;
      const go = () => { setN(Math.min(++v, to)); if (v < to) setTimeout(go, 18); };
      go();
    }, delay);
    return () => clearTimeout(tid);
  }, [active, to, delay]);
  return <>{n}{suffix}</>;
}

/* ══════════════════════════════════════════════════════════════
   ABOUT OVERLAY
══════════════════════════════════════════════════════════════ */
function AboutOverlay({
  visible, scrollProgress, velRef,
}: {
  visible: boolean; scrollProgress: number; velRef: React.MutableRefObject<number>;
}) {
  const approachP = clamp(
    (scrollProgress - PH.textIn) / Math.max(PH.textFull - PH.textIn, 1e-5), 0, 1,
  );
  const zoneP = clamp(
    (scrollProgress - PH.textIn) / Math.max(PH.dispStart - PH.textIn, 1e-5), 0, 1,
  );

  const el0 = visible && zoneP > 0.00;
  const el1 = visible && zoneP > 0.08;
  const el2 = visible && zoneP > 0.18;
  const el3 = visible && zoneP > 0.30;
  const el4 = visible && zoneP > 0.36;
  const el5 = visible && zoneP > 0.44;
  const el6 = visible && zoneP > 0.52;
  const el7 = visible && zoneP > 0.40;
  const el8 = visible && zoneP > 0.64;
  const el9 = visible && zoneP > 0.74;

  const l0 = useScramble("I DON'T BUILD",         el1, velRef, 0);
  const l1 = useScramble("INTERFACES.",            el2, velRef, 0);
  const p0 = useScramble("Systems over features",  el4, velRef, 0);
  const p1 = useScramble("Precision over volume",  el5, velRef, 0);
  const p2 = useScramble("Performance over noise", el6, velRef, 0);

  const eApproach  = 1 - Math.pow(1 - approachP, 2.8);
  const scale      = lrp(0.28, 1.0, eApproach);
  const blur       = lrp(8, 0, eApproach);
  const translateY = lrp(22, 0, eApproach);

  const rev = (active: boolean, delay = '0s'): React.CSSProperties => ({
    opacity:   active ? 1 : 0,
    transform: active ? 'none' : 'translateY(12px)',
    transition: `opacity .55s cubic-bezier(.16,1,.3,1) ${delay}, transform .55s cubic-bezier(.16,1,.3,1) ${delay}`,
  });

  const TECH = ['React', 'Next.js', 'Three.js', 'TypeScript', 'Node', 'Postgres', 'Figma', 'GSAP'];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity .45s cubic-bezier(.16,1,.3,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: '1240px',
        padding: '0 clamp(28px,6vw,88px)',
        transform: `scale(${scale}) translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
        willChange: 'transform, filter',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px,2.8vh,36px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...rev(el0) }}>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.42em',
              textTransform: 'uppercase', color: '#7dd3fc',
              padding: '5px 14px', border: '1px solid rgba(125,211,252,.22)', borderRadius: 2,
              background: 'rgba(125,211,252,.04)',
            }}>Software Engineer</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(125,211,252,.22), transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.22em',
                textTransform: 'uppercase', color: 'rgba(125,211,252,.40)',
              }}>Dubai, UAE</span>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.22em',
                textTransform: 'uppercase', color: 'rgba(125,211,252,.26)',
              }}>GMT+4</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,6vw,88px)', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px,2.6vh,30px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <h2 style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: 'clamp(42px,6.5vw,88px)', lineHeight: .92,
                  letterSpacing: '-0.03em', margin: 0, color: '#e8f0f8',
                  textShadow: '0 0 80px rgba(125,211,252,.10)', ...rev(el1),
                }}>{l0}</h2>
                <h2 style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: 'clamp(42px,6.5vw,88px)', lineHeight: .92,
                  letterSpacing: '-0.03em', margin: 0,
                  background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 40%, #e8f0f8 70%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  ...rev(el2),
                }}>{l1}</h2>
              </div>

              <div style={rev(el2, '.10s')}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 400,
                  fontSize: 'clamp(14px,1.6vw,18px)', lineHeight: 1.55,
                  color: 'rgba(188,214,242,.50)', margin: 0, maxWidth: 440,
                }}>
                  I design <em style={{ color: 'rgba(125,211,252,.78)', fontStyle: 'normal', fontWeight: 500 }}>controlled experiences</em> — where every interaction is deliberate and every pixel earns its place.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { text: p0, active: el4, col: '#7dd3fc' },
                  { text: p1, active: el5, col: '#38bdf8' },
                  { text: p2, active: el6, col: '#0ea5e9' },
                ].map(({ text, active, col }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, ...rev(active) }}>
                    <div style={{ width: 2, height: 14, borderRadius: 1, background: col, boxShadow: `0 0 8px ${col}55`, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(11px,1.2vw,13px)', letterSpacing: '.05em', color: 'rgba(188,214,242,.60)' }}>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...rev(el8) }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.38em', textTransform: 'uppercase', color: 'rgba(125,211,252,.26)' }}>— Stack</span>
                <p style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(125,211,252,.46)',
                  margin: 0,
                }}>{TECH.join(' · ')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(22px,3.5vh,44px)', ...rev(el7) }}>
              {[
                { to: 5,  s: '+', lbl: 'Years of craft',   bar: 0.72, delay: 200 },
                { to: 40, s: '+', lbl: 'Products shipped',  bar: 0.88, delay: 360 },
                { to: 12, s: '+', lbl: 'Clients worldwide', bar: 0.55, delay: 520 },
              ].map(({ to, s, lbl, bar, delay }, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(44px,6vw,72px)', color: '#e8f0f8', lineHeight: 1, textShadow: '0 0 50px rgba(125,211,252,.14)' }}>
                      <CountUp to={to} suffix={s} active={el7} delay={delay} />
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(100,160,210,.36)' }}>{lbl}</span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(125,211,252,.07)', borderRadius: 1 }}>
                    <div style={{ height: '100%', borderRadius: 1, background: 'linear-gradient(to right, rgba(125,211,252,.40), rgba(56,189,248,.62))', boxShadow: '0 0 10px rgba(125,211,252,.25)', width: el7 ? `${bar * 100}%` : '0%', transition: `width 1.2s cubic-bezier(.16,1,.3,1) ${delay * 0.001 + 0.3}s` }} />
                  </div>
                </div>
              ))}

              <div style={{ ...rev(el9), marginTop: 8 }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: '12px 0',
                  borderTop: '1px solid rgba(125,211,252,.08)',
                  borderBottom: '1px solid rgba(125,211,252,.08)',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.24em',
                    textTransform: 'uppercase', color: 'rgba(125,211,252,.36)',
                  }}>Open to remote & relocation</span>
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: '12px',
                    color: 'rgba(188,214,242,.44)',
                  }}>Based in Dubai, UAE · GMT+4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(2,5,18,.28) 0%, rgba(2,5,18,.62) 50%, rgba(2,5,18,.92) 100%)',
        opacity: visible ? 1 : 0, transition: 'opacity .55s ease',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
function CustomCursor({ hoverRef, hoverSmRef, scrollRef }: {
  hoverRef: React.MutableRefObject<number>;
  hoverSmRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const pos      = useRef({ x: -200, y: -200 });
  const outerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    const tick = () => {
      const { x, y } = pos.current;
      const tlHov = hoverRef.current >= 0;
      const smHov = hoverSmRef.current >= 0;
      const sp    = scrollRef.current;
      const inAb  = sp < PH.tlStart;
      if (outerRef.current) {
        outerRef.current.style.left = `${x}px`;
        outerRef.current.style.top  = `${y}px`;
        const size   = tlHov ? 52 : smHov && inAb ? 34 : 10;
        const border = tlHov ? '1px solid rgba(245,158,11,.80)' : smHov && inAb ? '1px solid rgba(125,211,252,.52)' : '1px solid rgba(125,211,252,.32)';
        const bg     = tlHov || (smHov && inAb) ? 'transparent' : 'rgba(125,211,252,.30)';
        outerRef.current.style.width      = `${size}px`;
        outerRef.current.style.height     = `${size}px`;
        outerRef.current.style.background = bg;
        outerRef.current.style.border     = border;
        outerRef.current.style.opacity    = tlHov ? '0.85' : smHov && inAb ? '0.50' : '0.38';
      }
      if (labelRef.current) labelRef.current.style.opacity = tlHov ? '1' : '0';
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, [hoverRef, hoverSmRef, scrollRef]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div ref={outerRef} style={{
        position: 'absolute', borderRadius: '50%', transform: 'translate(-50%,-50%)',
        transition: 'width .18s cubic-bezier(.16,1,.3,1), height .18s cubic-bezier(.16,1,.3,1), border .15s ease, opacity .15s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <span ref={labelRef} style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: '6px', letterSpacing: '.26em',
          textTransform: 'uppercase', color: 'rgba(245,158,11,.85)',
          transition: 'opacity .18s ease', whiteSpace: 'nowrap',
        }}>FRACTURE</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOLOGRAPHIC PANEL
   FIX 3: Keyboard Escape now closes the panel. Added × button
   alongside the existing ESC button for pointer users.
══════════════════════════════════════════════════════════════ */
function HoloPanelOverlay({ entry, visible, onClose }: {
  entry: (typeof timeline)[0] | null; visible: boolean; onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setMounted(true), 80); else setMounted(false);
  }, [visible]);

  // FIX 3: Wire up the Escape key
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible && !mounted) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(3,5,10,.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      opacity: mounted ? 1 : 0, transition: 'opacity .45s cubic-bezier(.16,1,.3,1)', cursor: 'pointer',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', maxWidth: '520px', width: '90vw',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'scale(0.93) translateY(14px)',
        transition: 'opacity .55s cubic-bezier(.16,1,.3,1) .08s, transform .55s cubic-bezier(.16,1,.3,1) .08s',
        cursor: 'default',
      }}>
        <div style={{
          background: 'rgba(4,12,38,.74)', border: '1px solid rgba(125,211,252,.18)',
          borderRadius: '8px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 0 80px rgba(0,0,0,.60), 0 0 40px rgba(125,211,252,.06), inset 0 1px 0 rgba(255,255,255,.05)',
          overflow: 'hidden',
        }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right,transparent,rgba(125,211,252,.50),transparent)' }} />
          <div style={{ padding: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.34em', textTransform: 'uppercase', color: '#7dd3fc', display: 'block', marginBottom: '6px' }}>{(entry as any)?.year ?? '—'}</span>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(20px,3vw,30px)', color: '#e8f0f8', lineHeight: 1.14, margin: 0, textShadow: '0 0 30px rgba(125,211,252,.20)' }}>{entry?.title ?? ''}</h2>
                {'subtitle' in (entry ?? {}) && (entry as any).subtitle && (
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(125,211,252,.46)', margin: '6px 0 0' }}>{(entry as any).subtitle}</p>
                )}
              </div>

              {/* FIX 3: Button row — ESC label + × icon, both functional */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '16px' }}>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(125,211,252,.08)', border: '1px solid rgba(125,211,252,.15)',
                    borderRadius: '4px', color: 'rgba(125,211,252,.52)',
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.18em',
                    padding: '6px 12px', cursor: 'pointer',
                  }}
                >ESC</button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    background: 'rgba(125,211,252,.08)', border: '1px solid rgba(125,211,252,.15)',
                    borderRadius: '4px', color: 'rgba(125,211,252,.70)',
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '14px', lineHeight: 1,
                    padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>
            </div>

            {'description' in (entry ?? {}) && (entry as any).description && (
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.72, color: 'rgba(188,214,242,.62)', margin: '0 0 24px' }}>{(entry as any).description}</p>
            )}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderTop: '1px solid rgba(125,211,252,.08)', paddingTop: '20px' }}>
              {['System', 'Precision', 'Output'].map((label, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ height: '2px', borderRadius: '1px', background: `rgba(125,211,252,${0.18 + i * 0.08})`, width: mounted ? '100%' : '0%', transition: `width .80s cubic-bezier(.16,1,.3,1) ${0.2 + i * 0.12}s` }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(125,211,252,.30)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(to right,transparent,rgba(125,211,252,.20),transparent)' }} />
        </div>
        <p style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(125,211,252,.20)', marginTop: '14px', opacity: mounted ? 1 : 0, transition: 'opacity .5s ease .5s' }}>click outside · esc · × to close</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TIMELINE PANEL
══════════════════════════════════════════════════════════════ */
function TLPanel({ entry, visible }: { entry: (typeof timeline)[0] | null; visible: boolean }) {
  return (
    <div style={{
      position: 'absolute', left: 'clamp(24px,5vw,60px)', bottom: 'clamp(60px,10vh,100px)',
      zIndex: 20, maxWidth: '390px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1)',
      pointerEvents: 'none',
    }}>
      {entry && (<>
        <div style={{
          position: 'absolute', inset: '-18px -24px',
          background: 'rgba(2,6,24,.58)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
          borderRadius: '6px', border: '1px solid rgba(125,211,252,.11)',
          boxShadow: '0 0 50px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04)', zIndex: -1,
        }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.32em', textTransform: 'uppercase', color: '#7dd3fc', display: 'block', marginBottom: '8px' }}>{(entry as any).year ?? ''}</span>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(20px,2.8vw,32px)', color: '#e8f0f8', lineHeight: 1.12, margin: '0 0 6px', textShadow: '0 0 30px rgba(125,211,252,.18)' }}>{entry.title}</h3>
        {'subtitle' in entry && (entry as any).subtitle && (
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(125,211,252,.42)', margin: '0 0 12px' }}>{(entry as any).subtitle}</p>
        )}
        {'description' in entry && (entry as any).description && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(12px,1.4vw,14px)', lineHeight: 1.72, color: 'rgba(172,202,234,.58)', margin: 0 }}>{(entry as any).description}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '8px 14px', background: 'rgba(125,211,252,.04)', border: '1px solid rgba(125,211,252,.11)', borderRadius: 4 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7dd3fc', boxShadow: '0 0 8px rgba(125,211,252,.60)', animation: 'dotPulse 1.8s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(125,211,252,.42)' }}>click the rock · fracture to reveal</span>
        </div>
      </>)}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS DOTS
══════════════════════════════════════════════════════════════ */
function TLDots({ active, total, shattered, visible }: {
  active: number; total: number; shattered: boolean[]; visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 'clamp(22px,4vh,42px)', left: '50%',
      transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '10px', alignItems: 'center',
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === active ? '20px' : '5px', height: '5px', borderRadius: '3px',
          background: shattered[i] ? '#7dd3fc' : i === active ? '#7dd3fc' : 'rgba(125,211,252,.16)',
          boxShadow: shattered[i] ? '0 0 8px rgba(125,211,252,.50)' : i === active ? '0 0 9px rgba(125,211,252,.52)' : 'none',
          transition: 'all .45s cubic-bezier(.16,1,.3,1)',
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PHASE LABEL
══════════════════════════════════════════════════════════════ */
const PHASE_LABELS: Array<[number, number, string]> = [
  [0,             PH.ringStart,   '— in the dark —'],
  [PH.ringStart,  PH.ringFull,    '— something forms —'],
  [PH.ringFull,   PH.approachEnd, '— the ring holds —'],
  [PH.enterStart, PH.enterMid,    '— entering —'],
  [PH.enterMid,   PH.enterEnd,    '— through —'],
  [PH.dispStart,  PH.tlStart,     '— dispersing —'],
];
function getPhaseLabel(sp: number): string {
  for (const [a, b, label] of PHASE_LABELS) if (sp >= a && sp < b) return label;
  return '';
}

/* ══════════════════════════════════════════════════════════════
   SCROLL INDICATOR
══════════════════════════════════════════════════════════════ */
function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'absolute', bottom: 'clamp(28px,5vh,52px)', left: '50%',
      transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center',
      opacity: visible ? 1 : 0, transition: 'opacity .8s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.38em',
          textTransform: 'uppercase', color: 'rgba(125,211,252,.20)',
        }}>scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(125,211,252,.28), transparent)', animation: 'linePulse 2s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export default function PostHeroSection() {
  const outerRef      = useRef<HTMLDivElement>(null);
  const scrollRef     = useRef(0);
  const scrollVelRef  = useRef(0);
  const lastSpRef     = useRef(0);
  const activeRef     = useRef(0);
  const hoverRef      = useRef(-1);
  const hoverSmRef    = useRef(-1);
  const fxRef         = useRef<FXState>({ bloom: 0.20, chroma: 0 });
  const starOpRef     = useRef(0.35);
  const chunkEventRef = useRef<{ idx: number; pos: THREE.Vector3 } | null>(null);
  const introActiveRef = useRef(false);
  const introPlayedRef = useRef(false);
  const introRafRef    = useRef<number | null>(null);

  const heroExited = useSceneStore(s => s.heroExited);

  const fractureRef = useRef<FractureState[]>(
    Array.from({ length: N }, () => ({
      phase: 'sealed' as const, pressure: 0, shatterTime: 0, worldPos: new THREE.Vector3(),
    }))
  );

  const [sp,          setSp]          = useState(0);
  const [introActive, setIntroActive] = useState(false);
  const [starOp,      setStarOp]      = useState(0.35);
  const [active,      setActive]      = useState(0);
  const [infoKey,     setInfoKey]     = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [shattered,   setShattered]   = useState<boolean[]>(Array(N).fill(false));
  const [holoEntry,   setHoloEntry]   = useState<(typeof timeline)[0] | null>(null);
  const [holoVisible, setHoloVisible] = useState(false);
  const [holoIdx,     setHoloIdx]     = useState<number | null>(null);

  const refs: SharedRefs = useMemo(() => ({
    scrollRef, scrollVelRef, activeRef, hoverRef, hoverSmRef,
    fxRef, fractureRef, chunkEventRef,
  }), []);

  const handleShatter = useCallback((idx: number) => {
    setShattered(prev => { const n = [...prev]; n[idx] = true; return n; });
    setHoloEntry(timeline[idx] ?? null);
    setHoloIdx(idx);
    setHoloVisible(true);
  }, []);

  const resetFracture = useCallback((idx: number | null) => {
    if (idx === null) return;
    const frac = fractureRef.current[idx];
    if (!frac) return;
    fractureRef.current[idx] = { ...frac, phase: 'sealed', pressure: 0, shatterTime: 0 };
  }, []);

  const handleHoloClose = useCallback(() => {
    setHoloVisible(false);
    resetFracture(holoIdx);
    setHoloIdx(null);
    setHoloEntry(null);
  }, [holoIdx, resetFracture]);

  const updateFromProgress = useCallback((p: number, rawVel: number) => {
    const vel = Math.abs(rawVel);
    scrollVelRef.current = lrp(scrollVelRef.current, vel, 0.35);
    lastSpRef.current = p;
    scrollRef.current = p;
    setSp(p);

    const rise = sm(p, 0, PH.ringStart * 0.9);
    const dim  = sm(p, PH.ringStart, PH.textIn);
    const back = sm(p, PH.dispStart, PH.tlStart + 0.08);
    let nso = lrp(0.35, 1.0, rise);
    nso = lrp(nso, 0.10, dim);
    nso = lrp(nso, 0.95, back);
    if (Math.abs(nso - starOpRef.current) > 0.016) { starOpRef.current = nso; setStarOp(nso); }

    setTextVisible(p > PH.textIn && p < PH.dispStart + 0.06);

    if (p >= PH.tlStart) {
      const tlP  = (p - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5);
      const segs = TL_CAM_KEYS.length - 1;
      const tl   = Math.min(tlP * segs, segs - 1e-4);
      const rock = clamp(Math.round(tl) - 1, 0, N - 1);
      if (rock !== activeRef.current) {
        activeRef.current = rock; setActive(rock); setInfoKey(k => k + 1);
      }
    }
  }, [activeRef, setActive, setInfoKey, setSp, setStarOp, setTextVisible, scrollVelRef]);

  useEffect(() => {
    const fn = () => {
      const el = outerRef.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight; if (total <= 0) return;
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / total));
      if (introActiveRef.current) return;

      const rawVel = Math.abs(p - lastSpRef.current) * 60;
      updateFromProgress(p, rawVel);
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, [updateFromProgress]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!introActiveRef.current) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!heroExited) {
      introPlayedRef.current = false;
      introActiveRef.current = false;
      if (introRafRef.current) cancelAnimationFrame(introRafRef.current);
      setIntroActive(false);
      scrollVelRef.current = 0;
      updateFromProgress(0, 0);
      return;
    }

    if (introPlayedRef.current) return;
    introPlayedRef.current = true;
    introActiveRef.current = true;
    setIntroActive(true);

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });

    const start = 0;
    const end   = Math.min(PH.textIn + 0.02, PH.dispStart - 0.02);
    const ease  = (t: number) => t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const t0 = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - t0) / INTRO_DURATION_MS, 0, 1);
      const eased = ease(t);
      const spVal = lrp(start, end, eased);
      const rawVel = Math.abs(spVal - lastSpRef.current) * 60;
      updateFromProgress(spVal, rawVel);

      if (t < 1) {
        introRafRef.current = requestAnimationFrame(tick);
      } else {
        introActiveRef.current = false;
        setIntroActive(false);
        scrollVelRef.current = 0;
        const el = outerRef.current;
        if (el) {
          const total = el.offsetHeight - window.innerHeight;
          const y = total * spVal;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = '';
      }
    };
    introRafRef.current = requestAnimationFrame(tick);
  }, [heroExited, updateFromProgress]);

  const inTL        = sp >= PH.tlStart;
  const tlProgress  = inTL ? (sp - PH.tlStart) / Math.max(1 - PH.tlStart, 1e-5) : 0;
  const isOverview  = inTL && tlProgress * (TL_CAM_KEYS.length - 1) < 0.5;
  const phaseLabel  = !introActive && !inTL && sp < PH.textIn ? getPhaseLabel(sp) : '';
  const showScroll  = !introActive && sp < PH.ringStart * 0.6;
  const inRingPhase = !SKIP_RING && sp >= PH.ringStart && sp < PH.enterEnd;
  const globalProgress = HERO_PROGRESS_PORTION + sp * (1 - HERO_PROGRESS_PORTION);

  return (
    <section ref={outerRef} id="about"
      style={{ position: 'relative', height: `${TOTAL_VH}vh`, background: '#020409', cursor: 'none' }}>
      <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 60, near: 0.1, far: 600 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.86,
            }}
            style={{ cursor: 'none' }}
          >
            <Scene refs={refs} starOp={starOp} />
            <FractureDriver
              fractureRef={fractureRef}
              chunkEventRef={chunkEventRef}
              onShatter={handleShatter}
            />
            <PostFX fxRef={fxRef} />
          </Canvas>
        </div>

        {/* Edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 78% 68% at 50% 46%, rgba(2,4,9,0.02) 0%, rgba(0,0,0,.30) 65%, #020409 100%)',
        }} />

        {phaseLabel && (
          <div key={phaseLabel} style={{
            position: 'absolute', top: 'clamp(18px,3vh,34px)', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.38em',
            textTransform: 'uppercase', color: 'rgba(125,211,252,.22)',
            animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both',
          }}>{phaseLabel}</div>
        )}

        {inRingPhase && sp < PH.enterStart && (
          <div style={{
            position: 'absolute', bottom: 'clamp(22px,4vh,44px)', right: 'clamp(20px,4vw,48px)',
            zIndex: 10, pointerEvents: 'none',
            animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1) both',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', letterSpacing: '.28em',
              textTransform: 'uppercase', color: 'rgba(125,211,252,.18)',
            }}>— {N_WALL} rocks —</span>
          </div>
        )}

        {inTL && (
          <div style={{
            position: 'absolute', top: 'clamp(18px,3.5vh,36px)', left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 clamp(20px,5vw,60px)', zIndex: 10,
            animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1) both',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.30em', textTransform: 'uppercase', color: 'rgba(125,211,252,.32)' }}>— Timeline</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(125,211,252,.18)' }}>{isOverview ? 'scroll to explore' : `${active + 1} / ${N}`}</span>
          </div>
        )}

        {inTL && isOverview && (
          <div style={{
            position: 'absolute',
            top:       'clamp(54px,9vh,78px)',
            left:      '50%',
            transform: 'translateX(-50%)',
            zIndex:    10,
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'fadeUp .6s cubic-bezier(.16,1,.3,1) .15s both',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize:   '8px',
              letterSpacing: '.36em',
              textTransform: 'uppercase',
              color: 'rgba(125,211,252,.16)',
            }}>— {N} sealed memories —</span>
          </div>
        )}

        <AboutOverlay visible={textVisible} scrollProgress={sp} velRef={scrollVelRef} />

        <TLPanel key={infoKey} entry={inTL && !isOverview ? (timeline[active] ?? null) : null} visible={inTL && !isOverview} />
        <TLDots active={active} total={N} shattered={shattered} visible={inTL && !isOverview} />

        <ScrollIndicator visible={showScroll} />

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,.022)', zIndex: 10 }}>
          <div style={{
            height: '100%', width: `${globalProgress * 100}%`,
            background: 'linear-gradient(to right, rgba(14,165,233,.40), rgba(125,211,252,.78))',
            boxShadow: '0 0 8px rgba(125,211,252,.28)',
            transition: 'width .18s ease',
          }} />
        </div>
      </div>

      <CustomCursor hoverRef={hoverRef} hoverSmRef={hoverSmRef} scrollRef={scrollRef} />
      <HoloPanelOverlay
        entry={holoEntry}
        visible={holoVisible}
        onClose={handleHoloClose}
      />

      <style>{`
        @keyframes dotPulse {
          0%,100%{opacity:1;transform:scale(1);}
          50%{opacity:.5;transform:scale(1.3);}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateX(-50%) translateY(8px);}
          to{opacity:1;transform:translateX(-50%) translateY(0);}
        }
        @keyframes linePulse {
          0%,100%{opacity:.38;} 50%{opacity:1;}
        }
      `}</style>
    </section>
  );
}