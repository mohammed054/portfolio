'use client';
/**
 * PostHeroSection  —  "Asteroid Field → Rocky Monolith → Timeline"
 * ─────────────────────────────────────────────────────────────────
 * Single sticky canvas. Two chapters. One continuous scroll.
 *
 *  CHAPTER 1 — ABOUT  (0 → AF of total scroll)
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  FLOAT     rocks drift in deep space                         │
 *  │  CONVERGE  gravitational pull — rocks cluster                │
 *  │  WALL      rocky mass + about text scrambles in              │
 *  │  DISPERSE  54 small rocks fade; 6 grow to timeline giants   │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  CHAPTER 2 — TIMELINE  (AF → 1.0 of total scroll)
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  Camera glides through 6 giant milestone rocks               │
 *  │  Active rock blazes cyan · info panel fades in              │
 *  └──────────────────────────────────────────────────────────────┘
 */

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree }            from '@react-three/fiber';
import { EffectComposer, Bloom }                  from '@react-three/postprocessing';
import * as THREE                                 from 'three';
import Starfield                                  from '@/components/hero/Starfield';
import { timeline }                               from '@/lib/data';

/* ═══════════════════════════════════════════════════════════════════
   SCROLL GEOMETRY
═══════════════════════════════════════════════════════════════════ */

const N       = timeline.length;
const N_SM    = 90;                        // small about-phase rocks (denser field)
const N_ROCK  = N + N_SM;                  // total

const ABOUT_VH    = 620;
const TL_VH_ENTRY = 115;
const TOTAL_VH    = ABOUT_VH + (N + 1) * TL_VH_ENTRY;
const AF          = ABOUT_VH / TOTAL_VH;  // about-chapter fraction

// Phase boundaries (fraction of total scroll 0 → 1)
const PH = {
  convStart:   AF * 0.22,
  convEnd:     AF * 0.52,
  textIn:      AF * 0.60,
  textHold:    AF * 0.80,
  dispStart:   AF * 0.83,
  dispEnd:     AF * 0.97,
  tlStart:     AF * 0.90,  // camera starts timeline before about fully ends
} as const;

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */

const sr  = (s: number) => { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };
const sm  = (x: number, a: number, b: number) => THREE.MathUtils.smootherstep(x, a, b);
const lrp = THREE.MathUtils.lerp.bind(THREE.MathUtils) as (a: number, b: number, t: number) => number;

/* ═══════════════════════════════════════════════════════════════════
   PROCEDURAL ROCK GEOMETRY
═══════════════════════════════════════════════════════════════════ */

function makeRockGeo(radius: number, seed: number, detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const cnt = pos.count;
  const col = new Float32Array(cnt * 3);
  const h1  = (v: number) => Math.abs(Math.sin(v * 127.1 + seed * 311.7 + 17.3));
  const h2  = (v: number) => Math.abs(Math.sin(v *  73.1 + seed * 197.3 + 29.7));

  for (let i = 0; i < cnt; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const bump = 1
      + h1(x * 5.3  + y * 11.7 + z *  7.1) * 0.33
      + h1(x * 13.1 + z *  9.3 + y *  4.7) * 0.14
      + h1(y * 17.3 + x *  6.7 + z *  2.9) * 0.08
      + h1(z * 22.4 + x *  3.1 + y *  9.2) * 0.04;
    pos.setXYZ(i, x * bump, y * bump, z * bump);

    const c  = h2(x * 3.1 + y * 7.3 + z * 4.7);
    const sk = h1(y * 8.7 + z * 5.3 + x * 3.1) > 0.74 ? 0.088 : 0;
    const b  = 0.055 + c * 0.125;
    col[i * 3]     = b + sk + 0.024;
    col[i * 3 + 1] = b + sk;
    col[i * 3 + 2] = b + sk - 0.012;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

/* ═══════════════════════════════════════════════════════════════════
   TIMELINE POSITIONS + CAMERA PATH
═══════════════════════════════════════════════════════════════════ */

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
  new THREE.Vector3(0, 2.8, 42),              // overview
  ...TL_POS.map(p => new THREE.Vector3(p.x * 0.24, p.y * 0.18, p.z + 12)),
];
const LOOK_KEYS = [
  new THREE.Vector3(0, 0, -18),               // overview look
  ...TL_POS,
];

/* ═══════════════════════════════════════════════════════════════════
   ROCK CONFIGS
═══════════════════════════════════════════════════════════════════ */

const ROCK_CFG = Array.from({ length: N_ROCK }, (_, i) => {
  const isTL = i < N;
  const r    = (o: number) => sr(i * 113.7 + o);

  // Scatter: wide, deep asteroid field (cam at z=12)
  const scatter = new THREE.Vector3(
    (r(1) - 0.5) * 72,
    (r(2) - 0.5) * 46,
    -(10 + r(3) * 110),
  );

  // Wall: dense cluster with a shallow central pocket for the about text
  const wx0 = (r(4) - 0.5) * 14.5;
  const wy0 = (r(5) - 0.5) * 9.2;
  const wz0 = (r(6) - 0.5) * 4.6 - 1.2;

  const pocket = Math.max(0, 1 - ((wx0 / 4.8) ** 2 + (wy0 / 2.6) ** 2));
  const pushX = (Math.sign(wx0) || (r(15) > 0.5 ? 1 : -1)) * pocket * 3.4;
  const pushY = (Math.sign(wy0) || (r(16) > 0.5 ? 1 : -1)) * pocket * 2.2;

  const wall = new THREE.Vector3(
    wx0 + pushX,
    wy0 + pushY,
    wz0 - pocket * 0.6,
  );

  // Disperse: TL rocks fly to timeline positions; small rocks scatter off-screen
  const disperse = isTL
    ? TL_POS[i].clone()
    : new THREE.Vector3(
        (r(7) - 0.5) * 120,
        (r(8) - 0.5) * 80,
        -(60 + r(9) * 100),
      );

  // TL rocks use real large geometry; start invisible (scale 0) then grow
  const tlRadius = 2.2 + r(10) * 0.95;    // 2.2 – 3.15
  const smRadius = 0.24 + r(10) * 0.75;   // 0.24 – 0.99

  return {
    isTL,
    tlIdx:    isTL ? i : -1,
    scatter, wall, disperse,
    radius:   isTL ? tlRadius : smRadius,
    detail:   isTL ? 4 : 3,
    seed:     (i * 41 + 7) | 0,
    fAmp:     0.07 + r(11) * 0.26,
    fSpd:     0.06 + r(12) * 0.18,
    rotSeed:  r(13) * Math.PI * 2,
    rotSpd:   0.0028 + r(14) * 0.0090,
  };
});

/* ═══════════════════════════════════════════════════════════════════
   TEXT SCRAMBLE
═══════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════
   COUNT UP
═══════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════
   WHEEL PROXY  (canvas → window scroll)
═══════════════════════════════════════════════════════════════════ */

function WheelProxy({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const fn = (e: WheelEvent) => {
      const atTop = window.scrollY <= 0 && e.deltaY < 0;
      if (atTop) return; // let window handler catch "back to hero"
      if (e.defaultPrevented) return;
      const atBottom = scrollRef.current >= 0.999 && e.deltaY > 0;
      if (atBottom) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      window.scrollBy({ top: e.deltaY });
    };
    el.addEventListener('wheel', fn, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', fn, { capture: true } as EventListenerOptions);
  }, [gl, scrollRef]);
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ROCK MESH
═══════════════════════════════════════════════════════════════════ */

function RockMesh({
  cfg, scrollRef, activeRef, hoverRef,
}: {
  cfg:       typeof ROCK_CFG[0];
  scrollRef: React.MutableRefObject<number>;
  activeRef: React.MutableRefObject<number>;
  hoverRef:  React.MutableRefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat  = useRef<THREE.MeshStandardMaterial>(null);
  const geo  = useMemo(() => makeRockGeo(cfg.radius, cfg.seed, cfg.detail), []);

  // Initialise TL rock scale to tiny so they're hidden inside the wall cluster
  const initScale = cfg.isTL ? 0.08 : 1.0;

  useFrame(({ clock }) => {
    if (!mesh.current || !mat.current) return;
    const t  = clock.getElapsedTime();
    const sp = scrollRef.current;

    const convP = sm(sp, PH.convStart, PH.convEnd);
    const dispP = sm(sp, PH.dispStart, PH.dispEnd);
    const floatI = 0.18 + (1 - convP) * 0.82;
    const idle   = 0.05 + cfg.fAmp * 0.22;

    // Float offset (never fully stops â€” even in wall/timeline)
    const fx = Math.sin(t * cfg.fSpd         + cfg.rotSeed)       * cfg.fAmp * floatI
             + Math.sin(t * 0.12 + cfg.rotSeed * 1.7) * idle;
    const fy = Math.cos(t * cfg.fSpd * 0.70  + cfg.rotSeed * 1.5) * cfg.fAmp * floatI
             + Math.cos(t * 0.09 + cfg.rotSeed * 2.1) * idle * 0.85;
    const fz = Math.sin(t * 0.07 + cfg.rotSeed * 1.3) * idle * 0.65;

    // Position: scatter → wall → disperse
    const wx = lrp(cfg.scatter.x, cfg.wall.x, convP);
    const wy = lrp(cfg.scatter.y, cfg.wall.y, convP);
    const wz = lrp(cfg.scatter.z, cfg.wall.z, convP);

    mesh.current.position.set(
      lrp(wx, cfg.disperse.x, dispP) + fx,
      lrp(wy, cfg.disperse.y, dispP) + fy,
      lrp(wz, cfg.disperse.z, dispP) + fz,
    );

    // Rotation
    mesh.current.rotation.x  = Math.sin(t * 0.09 + cfg.rotSeed)       * 0.50 * floatI;
    mesh.current.rotation.y += cfg.rotSpd * (1 + (cfg.isTL && sp > PH.tlStart ? 0.3 : 0));
    mesh.current.rotation.z  = Math.cos(t * 0.07 + cfg.rotSeed * 0.8) * 0.40 * floatI;

    if (cfg.isTL) {
      const isHover = hoverRef.current === cfg.tlIdx;
      const hBoost  = isHover ? 0.28 : 0;
      const hScale  = isHover ? 0.06 : 0;

      // Scale: tiny → 1.0 during disperse (+ hover bump)
      const targetScale = lrp(initScale, 1.0 + hScale, dispP);
      mesh.current.scale.setScalar(
        lrp(mesh.current.scale.x, targetScale, 0.08),
      );

      // Emissive glow: active rock blazes cyan
      const isActive = activeRef.current === cfg.tlIdx;
      const targetEm = sp > PH.tlStart
        ? (isActive ? 0.58 : 0.07) + hBoost
        : 0.04 * dispP;
      mat.current.emissiveIntensity = lrp(mat.current.emissiveIntensity, targetEm, 0.045);

    } else {
      // Small rocks: smooth fade out during disperse
      const targetOp = Math.max(0, 1 - sm(dispP, 0.30, 1.0));
      mat.current.opacity = lrp(mat.current.opacity, targetOp, 0.08);
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geo}
      scale={initScale}
      frustumCulled={false}
      onPointerOver={() => { if (cfg.isTL) hoverRef.current = cfg.tlIdx; }}
      onPointerOut={() => { if (cfg.isTL) hoverRef.current = -1; }}
    >
      <meshStandardMaterial
        ref={mat}
        vertexColors
        roughness={0.93}
        metalness={0.03}
        transparent={!cfg.isTL}
        depthWrite={cfg.isTL}
        emissive={new THREE.Color('#001840')}
        emissiveIntensity={0.03}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3D SCENE  (camera + lighting + rocks)
═══════════════════════════════════════════════════════════════════ */

function Scene({
  scrollRef, starOp, activeRef, bloomRef, hoverRef,
}: {
  scrollRef:  React.MutableRefObject<number>;
  starOp:     number;
  activeRef:  React.MutableRefObject<number>;
  bloomRef:   React.MutableRefObject<number>;
  hoverRef:   React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const lookTgt    = useRef(new THREE.Vector3(0, 0, 0));
  const camPos     = useRef(new THREE.Vector3(0, 0, 12));

  useFrame(() => {
    const sp = scrollRef.current;

    if (sp < PH.tlStart) {
      // About chapter: steady camera
      camPos.current.set(0, 0, 12);
      lookTgt.current.set(0, 0, 0);
      camera.position.lerp(camPos.current, 0.05);
      camera.lookAt(lookTgt.current);
    } else {
      // Timeline chapter: fly through rocks
      const tlP  = (sp - PH.tlStart) / (1 - PH.tlStart);
      const segs = CAM_KEYS.length - 1;
      const t    = Math.min(tlP * segs, segs - 0.0001);
      const seg  = Math.floor(t);
      const f    = sm(t - seg, 0, 1);

      camPos.current.lerpVectors(
        CAM_KEYS[seg],
        CAM_KEYS[Math.min(seg + 1, segs)],
        f,
      );
      camera.position.lerp(camPos.current, 0.06);

      const li = new THREE.Vector3().lerpVectors(
        LOOK_KEYS[seg],
        LOOK_KEYS[Math.min(seg + 1, segs)],
        f,
      );
      lookTgt.current.lerp(li, 0.06);
      camera.lookAt(lookTgt.current);

      // Update active rock
      const stage = Math.min(Math.round(t), segs);
      activeRef.current = Math.max(0, stage - 1);

      // Ramp bloom during TL
      bloomRef.current = 0.40 + tlP * 0.60;
    }
  });

  return (
    <>
      <WheelProxy scrollRef={scrollRef} />
      <Starfield opacity={starOp} />

      <ambientLight intensity={0.065} />
      <hemisphereLight intensity={0.14} color="#c7ddff" groundColor="#0b1020" />
      <directionalLight position={[ 9, 15,  8]} intensity={1.05} color="#b4ccff" />
      <directionalLight position={[-6, -5,  5]} intensity={0.30} color="#ff8844" />
      <pointLight position={[0, 0, 14]} intensity={0.75} color="#1a66ff" distance={90}  decay={2} />
      <pointLight position={[0, 6,  0]} intensity={0.24} color="#0055ff" distance={90}  decay={2} />

      {ROCK_CFG.map((cfg, i) => (
        <RockMesh
          key={i}
          cfg={cfg}
          scrollRef={scrollRef}
          activeRef={activeRef}
          hoverRef={hoverRef}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ABOUT TEXT OVERLAY
═══════════════════════════════════════════════════════════════════ */

function AboutOverlay({ visible }: { visible: boolean }) {
  const l0 = useScramble("I don't build interfaces.",        visible, 60);
  const l1 = useScramble("I design controlled experiences.", visible, 460);
  const p0 = useScramble("Systems over features",  visible, 920);
  const p1 = useScramble("Precision over volume",  visible, 1120);
  const p2 = useScramble("Performance over noise", visible, 1320);

  const reveal = (d: string): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : 'translateY(10px)',
    transition: `opacity .65s cubic-bezier(.16,1,.3,1) ${d}, transform .65s cubic-bezier(.16,1,.3,1) ${d}`,
  });

  return (
    <div style={{
      position:        'absolute',
      inset:           0,
      zIndex:          8,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      opacity:         visible ? 1 : 0,
      transition:      'opacity .55s cubic-bezier(.16,1,.3,1)',
      pointerEvents:   visible ? 'auto' : 'none',
    }}>
      {/* Deep scrim */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: `
          radial-gradient(ellipse 100% 85% at 50% 50%,
            rgba(0,2,12,.68) 0%,
            rgba(0,2,12,.88) 55%,
            rgba(0,0,8,.97)  100%)
        `,
      }} />

      <div style={{
        position:              'relative',
        zIndex:                2,
        width:                 '100%',
        maxWidth:              '1180px',
        padding:               '0 clamp(24px, 6vw, 80px)',
        display:               'grid',
        gridTemplateColumns:   '1fr auto',
        gap:                   'clamp(40px, 8vw, 110px)',
        alignItems:            'center',
      }}>

        {/* ── Left — identity ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.4vh,28px)' }}>

          <p style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      '10px',
            letterSpacing: '.34em',
            textTransform: 'uppercase',
            color:         'var(--cyan)',
            margin:        0,
            ...reveal('0s'),
          }}>
            — Software Engineer
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {[
              { text: l0, accent: false, d: '.06s' },
              { text: l1, accent: true,  d: '.18s' },
            ].map(({ text, accent, d }) => (
              <p key={d} style={{
                fontFamily:    "'Syne', sans-serif",
                fontWeight:    700,
                fontSize:      'clamp(22px, 3vw, 40px)',
                color:         accent ? 'var(--cyan)' : '#fff',
                lineHeight:    1.16,
                letterSpacing: '-0.015em',
                margin:        0,
                ...reveal(d),
              }}>
                {text}
              </p>
            ))}
          </div>

          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '10px',
            ...reveal('.42s'),
          }}>
            <span style={{
              width:     '7px',
              height:    '7px',
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
              boxShadow: '0 0 9px rgba(34,197,94,.80)',
              animation: 'dotPulse 2.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '10px',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color:         'rgba(130,180,210,.65)',
            }}>
              Available for work
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { text: p0, d: '.66s' },
              { text: p1, d: '.80s' },
              { text: p2, d: '.94s' },
            ].map(({ text, d }) => (
              <div key={d} style={{
                display: 'flex', alignItems: 'baseline', gap: '13px',
                ...reveal(d),
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color:      'rgba(0,200,255,.40)',
                  flexShrink: 0,
                }}>—</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   'clamp(13px, 1.5vw, 15px)',
                  lineHeight: 1.55,
                  color:      'rgba(175,200,230,.75)',
                }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — stats ──────────────────────────────────────────── */}
        <div style={{
          display:         'flex',
          flexDirection:   'column',
          gap:             'clamp(20px,3vh,38px)',
          ...reveal('.48s'),
        }}>
          {[
            { to: 5,  s: '+', lbl: 'Years'    },
            { to: 40, s: '+', lbl: 'Projects' },
            { to: 12, s: '+', lbl: 'Clients'  },
          ].map(({ to, s, lbl }, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
            }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize:   'clamp(36px, 5vw, 60px)',
                color:      '#fff',
                lineHeight: 1,
                textShadow: '0 0 44px rgba(0,200,255,.30)',
              }}>
                <CountUp to={to} suffix={s} active={visible} delay={660 + i * 180} />
              </span>
              <span style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      '9px',
                letterSpacing: '.28em',
                textTransform: 'uppercase',
                color:         'rgba(120,160,200,.50)',
              }}>
                {lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TIMELINE INFO PANEL
═══════════════════════════════════════════════════════════════════ */

function TLPanel({ entry, visible }: {
  entry:   (typeof timeline)[0] | null;
  visible: boolean;
}) {
  return (
    <div style={{
      position:      'absolute',
      left:          'clamp(24px, 5vw, 60px)',
      bottom:        'clamp(60px, 10vh, 100px)',
      zIndex:        20,
      maxWidth:      '380px',
      opacity:       visible ? 1 : 0,
      transform:     visible ? 'translateY(0)' : 'translateY(18px)',
      transition:    'opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1)',
      pointerEvents: 'none',
    }}>
      {entry && (
        <>
          {/* Glass card */}
          <div style={{
            position:             'absolute',
            inset:                '-16px -22px',
            background:           'rgba(0,4,22,.56)',
            backdropFilter:       'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius:         '5px',
            border:               '1px solid rgba(0,200,255,.09)',
            boxShadow:            '0 0 60px rgba(0,0,0,.50)',
            zIndex:               -1,
          }} />

          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      '10px',
            letterSpacing: '.32em',
            textTransform: 'uppercase',
            color:         'var(--cyan)',
            display:       'block',
            marginBottom:  '8px',
          }}>
            {(entry as any).year ?? ''}
          </span>

          <h3 style={{
            fontFamily:  "'Syne', sans-serif",
            fontWeight:  700,
            fontSize:    'clamp(20px, 2.8vw, 32px)',
            color:       '#fff',
            lineHeight:  1.12,
            margin:      '0 0 6px',
            textShadow:  '0 0 36px rgba(0,180,255,.28)',
          }}>
            {entry.title}
          </h3>

          {'subtitle' in entry && (entry as any).subtitle && (
            <p style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '9px',
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color:         'rgba(0,200,255,.50)',
              margin:        '0 0 12px',
            }}>
              {(entry as any).subtitle}
            </p>
          )}

          {'description' in entry && (entry as any).description && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   'clamp(12px, 1.4vw, 14px)',
              lineHeight: 1.72,
              color:      'rgba(160,190,220,.68)',
              margin:     0,
            }}>
              {(entry as any).description}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS DOTS  (timeline)
═══════════════════════════════════════════════════════════════════ */

function TLDots({ active, total, visible }: {
  active: number; total: number; visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div style={{
      position:   'absolute',
      bottom:     'clamp(22px, 4vh, 42px)',
      left:       '50%',
      transform:  'translateX(-50%)',
      zIndex:     20,
      display:    'flex',
      gap:        '10px',
      alignItems: 'center',
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width:        i === active ? '20px' : '5px',
          height:       '5px',
          borderRadius: '3px',
          background:   i === active ? 'var(--cyan)' : 'rgba(0,200,255,.22)',
          boxShadow:    i === active ? '0 0 10px rgba(0,200,255,.7)' : 'none',
          transition:   'all .45s cubic-bezier(.16,1,.3,1)',
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════ */

export default function PostHeroSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const activeRef = useRef(0);
  const hoverRef  = useRef(-1);
  const maxScrollRef = useRef(0);
  const bloomRef  = useRef(0.30);
  const starOpRef = useRef(0.35);

  const [sp,          setSp]          = useState(0);
  const [starOp,      setStarOp]      = useState(0.35);
  const [bloom,       setBloom]       = useState(0.30);
  const [active,      setActive]      = useState(0);
  const [infoKey,     setInfoKey]     = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  /* Compute bottom lock position */
  useEffect(() => {
    const computeMax = () => {
      const el = outerRef.current;
      if (!el) return;
      const max = el.offsetTop + el.offsetHeight - window.innerHeight;
      maxScrollRef.current = Math.max(0, max);
    };
    computeMax();
    window.addEventListener('resize', computeMax);
    return () => window.removeEventListener('resize', computeMax);
  }, []);

  /* ── Scroll driver ──────────────────────────────────────────────── */
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

      // Hard clamp: prevent scrolling past the end of the section
      const max = maxScrollRef.current;
      if (max > 0 && window.scrollY > max + 1) {
        window.scrollTo({ top: max, behavior: 'instant' });
      }

      // Starfield: match hero exit -> brighten -> dim for text -> return for timeline
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

      // About text visibility
      const tv = p > PH.textIn && p < PH.dispStart + 0.06;
      setTextVisible(tv);

      // Bloom
      const newBloom = bloomRef.current;
      setBloom(prev => Math.abs(prev - newBloom) > 0.02 ? newBloom : prev);

      // Active TL rock (React state for UI)
      if (p >= PH.tlStart) {
        const tlP  = (p - PH.tlStart) / (1 - PH.tlStart);
        const segs = CAM_KEYS.length - 1;
        const t    = Math.min(tlP * segs, segs - 0.0001);
        const stage = Math.min(Math.round(t), segs);
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

  /* ── Scroll lock at bottom (no scrolling past the timeline) ─────── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const max = maxScrollRef.current;
      const atBottom = max > 0 && window.scrollY >= max - 1 && e.deltaY > 0;
      if (atBottom) {
        e.preventDefault();
        window.scrollTo({ top: max, behavior: 'instant' });
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
  }, []);

  /* ── Derived state ─────────────────────────────────────────────── */
  const inTL       = sp >= PH.tlStart;
  const tlProgress = inTL ? (sp - PH.tlStart) / (1 - PH.tlStart) : 0;
  const isOverview = inTL && tlProgress * (CAM_KEYS.length - 1) < 0.5;

  const phaseLabel =
    !inTL && sp < PH.convStart   ? '— fragments adrift —'   :
    !inTL && sp < PH.convEnd     ? '— gravitational pull —' :
    !inTL && sp < PH.textIn      ? '— singularity —'        :
    !inTL && sp >= PH.textIn && sp < PH.dispStart ? '' :
    !inTL && sp >= PH.dispStart  ? '— dispersing —'         :
    '';

  return (
    <section
      ref={outerRef}
      id="about"
      style={{ position: 'relative', height: `${TOTAL_VH}vh`, background: '#000' }}
    >
      {/* Sticky viewport */}
      <div style={{
        position: 'sticky',
        top:      0,
        width:    '100%',
        height:   '100vh',
        overflow: 'hidden',
      }}>

        {/* ── 3D Canvas ──────────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 700 }}
            dpr={[1, 2]}
            gl={{
              antialias:           true,
              powerPreference:     'high-performance',
              toneMapping:         THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.86,
            }}
          >
            <Scene
              scrollRef={scrollRef}
              starOp={starOp}
              activeRef={activeRef}
              bloomRef={bloomRef}
              hoverRef={hoverRef}
            />
            <EffectComposer>
              <Bloom
                intensity={bloom}
                luminanceThreshold={0.50}
                luminanceSmoothing={0.28}
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Soft space haze to prevent total black falloff */}
        <div style={{
          position:      'absolute',
          inset:         0,
          zIndex:        4,
          pointerEvents: 'none',
          background:    'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(10,18,34,0.30) 0%, rgba(0,0,0,0.82) 72%, #000 100%)',
        }} />

        {/* ── Phase label (about chapter only) ───────────────────── */}
        {phaseLabel && !inTL && (
          <div
            key={phaseLabel}
            style={{
              position:      'absolute',
              top:           'clamp(18px, 3vh, 34px)',
              left:          '50%',
              transform:     'translateX(-50%)',
              zIndex:        10,
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '9px',
              letterSpacing: '.32em',
              textTransform: 'uppercase',
              color:         'rgba(0,185,255,.28)',
              whiteSpace:    'nowrap',
              pointerEvents: 'none',
              animation:     'fadeUp .5s cubic-bezier(.16,1,.3,1) both',
            }}
          >
            {phaseLabel}
          </div>
        )}

        {/* ── Timeline header ────────────────────────────────────── */}
        {inTL && (
          <div style={{
            position:        'absolute',
            top:             'clamp(18px, 3.5vh, 36px)',
            left:            0,
            right:           0,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            padding:         '0 clamp(20px, 5vw, 60px)',
            zIndex:          10,
            animation:       'fadeUp .6s cubic-bezier(.16,1,.3,1) both',
          }}>
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '10px',
              letterSpacing: '.30em',
              textTransform: 'uppercase',
              color:         'rgba(0,200,255,.38)',
            }}>
              — Timeline
            </span>
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '10px',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color:         'rgba(0,200,255,.24)',
            }}>
              {isOverview ? 'scroll to explore' : `${active + 1} / ${N}`}
            </span>
          </div>
        )}

        {/* ── Overview hint ──────────────────────────────────────── */}
        {inTL && isOverview && (
          <div style={{
            position:       'absolute',
            top:            '50%',
            left:           '50%',
            transform:      'translate(-50%, -50%)',
            zIndex:         10,
            textAlign:      'center',
            pointerEvents:  'none',
            animation:      'fadeUp .6s cubic-bezier(.16,1,.3,1) .1s both',
          }}>
            <p style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '9px',
              letterSpacing: '.34em',
              textTransform: 'uppercase',
              color:         'rgba(0,200,255,.30)',
              marginBottom:  '14px',
            }}>
              — {N} milestones —
            </p>
            <div style={{
              width:      '1px',
              height:     '36px',
              background: 'linear-gradient(to bottom, rgba(0,200,255,.50), transparent)',
              margin:     '0 auto',
              animation:  'linePulse 2s ease-in-out infinite',
            }} />
          </div>
        )}

        {/* ── About text overlay ─────────────────────────────────── */}
        <AboutOverlay visible={textVisible} />

        {/* ── Timeline info panel ────────────────────────────────── */}
        <TLPanel
          key={infoKey}
          entry={inTL && !isOverview ? (timeline[active] ?? null) : null}
          visible={inTL && !isOverview}
        />

        {/* ── Progress dots ──────────────────────────────────────── */}
        <TLDots active={active} total={N} visible={inTL && !isOverview} />

        {/* ── Progress bar ───────────────────────────────────────── */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          height:     '1px',
          background: 'rgba(255,255,255,.04)',
          zIndex:     10,
        }}>
          <div style={{
            height:     '100%',
            width:      `${sp * 100}%`,
            background: 'linear-gradient(to right, rgba(0,170,255,.55), rgba(0,220,255,.90))',
            boxShadow:  '0 0 9px rgba(0,200,255,.42)',
            transition: 'width .18s ease',
          }} />
        </div>

      </div>
    </section>
  );
}
