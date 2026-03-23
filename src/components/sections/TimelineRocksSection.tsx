'use client';
/**
 * TimelineRocksSection v3 — "Giant Rocks, Scroll-Driven Zoom"
 *
 * Section height: (N + 1) × 100vh  (700vh for 6 entries)
 *
 * Scroll journey:
 *   sp = 0.00   Camera far back — overview of ALL rocks floating in space
 *   sp = 1/6    Zoomed to Rock 0 (fills ~55% of screen)
 *   sp = 2/6    Zoomed to Rock 1
 *   ...
 *   sp = 6/6    Zoomed to Rock 5
 *
 * Each giant rock gently floats + slowly rotates.
 * Active rock glows cyan. Info panel bottom-left, fades per rock.
 * Starfield always visible — flying through space.
 */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree }                         from '@react-three/fiber';
import { EffectComposer, Bloom }                               from '@react-three/postprocessing';
import * as THREE                                              from 'three';
import Starfield                                               from '@/components/hero/Starfield';
import { timeline }                                            from '@/lib/data';

/* ─── WHEEL PROXY ────────────────────────────────────────────────────────── */
function WheelProxy() {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const h  = (e: WheelEvent) => {
      const atTop = window.scrollY <= 0 && e.deltaY < 0;
      if (atTop) return;
      e.preventDefault();
      e.stopPropagation();
      window.scrollBy({ top: e.deltaY });
    };
    el.addEventListener('wheel', h, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', h, { capture: true } as EventListenerOptions);
  }, [gl]);
  return null;
}

/* ─── SEEDED RANDOM ──────────────────────────────────────────────────────── */
const sr = (s: number) => { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x); };

/* ─── PROCEDURAL ROCK GEOMETRY (high-detail for giant close-up) ─────────── */
function createRockGeo(radius: number, seed: number): THREE.BufferGeometry {
  const geo    = new THREE.IcosahedronGeometry(radius, 4); // high detail for close-up
  const pos    = geo.attributes.position as THREE.BufferAttribute;
  const count  = pos.count;
  const colors = new Float32Array(count * 3);
  const h1     = (v: number) => Math.abs(Math.sin(v * 127.1 + seed * 311.7 + 17.3));
  const h2     = (v: number) => Math.abs(Math.sin(v *  73.1 + seed * 197.3 + 29.7));
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    /* Multi-octave displacement for organic silhouette */
    const n1   = h1(x * 4.8 + y * 10.2 + z *  6.7);
    const n2   = h1(x * 11.3 + z * 8.1 + y *  3.9) * 0.38;
    const n3   = h1(y * 16.7 + x *  5.9 + z *  2.4) * 0.19;
    const n4   = h1(z * 22.1 + x *  3.3 + y *  8.8) * 0.09;
    const bump = 1 + n1 * 0.34 + n2 * 0.15 + n3 * 0.07 + n4 * 0.04;
    pos.setXYZ(i, x * bump, y * bump, z * bump);
    /* Rich stone colour: dark charcoal base + mineral variation + light streaks */
    const c       = h2(x * 2.9 + y * 6.8 + z * 4.3);
    const mineral = h1(y * 7.4 + z * 4.9 + x * 2.7);
    const streak  = h1(z * 9.2 + x * 5.8 + y * 3.6) > 0.72 ? 0.095 : 0.0;
    const base    = 0.055 + c * 0.115;
    const tint    = mineral * 0.022;
    colors[i * 3]     = base + streak + 0.024 + tint;
    colors[i * 3 + 1] = base + streak + tint * 0.4;
    colors[i * 3 + 2] = base + streak - 0.009;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/* ─── ROCK DATA ──────────────────────────────────────────────────────────── */
const N = timeline.length; // dynamic

// Giant rocks arranged in a gentle S-curve through z-space
// Camera will fly along this curve, visiting each rock
const TL_ROCKS = timeline.map((_, i) => {
  const side = i % 2 === 0 ? -1 : 1;         // alternate left / right
  const r    = (o: number) => sr(i * 79 + o);
  return {
    pos:  [
      side * (3.8 + r(1) * 1.4),             // x: ±3.8–5.2
      (r(2) - 0.5) * 3.2,                    // y: ±1.6
      -i * 24 + (r(3) - 0.5) * 3,            // z: 0, -24, -48, ...
    ] as [number, number, number],
    size: 2.2 + r(4) * 0.75,                 // 2.2 – 2.95 radius
    seed: 100 + i * 57,
    fAmp: 0.10 + r(5) * 0.12,
    fSpd: 0.08 + r(6) * 0.10,
    rotSeed: r(7) * Math.PI * 2,
  };
});

/* Camera keyframes: [overview, rock-0, rock-1, ..., rock-N-1]  */
const CAM_KEYS: THREE.Vector3[] = [
  /* Overview — far back, slightly elevated, sees all rocks */
  new THREE.Vector3(0, 2.5, 52),
  /* Per-rock: positioned in front of each rock, slight x offset for depth */
  ...TL_ROCKS.map(rock =>
    new THREE.Vector3(
      rock.pos[0] * 0.28,   // lean toward rock's side
      rock.pos[1] * 0.22,
      rock.pos[2] + 11,     // 11 units in front
    )
  ),
];

/* LookAt targets per stage */
const LOOK_KEYS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),
  ...TL_ROCKS.map(r => new THREE.Vector3(...r.pos)),
];

/* ─── INDIVIDUAL GIANT ROCK ──────────────────────────────────────────────── */
function GiantRock({
  rock, idx, activeRef,
}: {
  rock:      (typeof TL_ROCKS)[0];
  idx:       number;
  activeRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshStandardMaterial>(null);
  const geo     = useMemo(() => createRockGeo(rock.size, rock.seed), [rock.size, rock.seed]);
  const base    = useMemo(() => new THREE.Vector3(...rock.pos), []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t        = clock.getElapsedTime();
    const isActive = activeRef.current === idx;

    /* Gentle perpetual float */
    meshRef.current.position.set(
      base.x + Math.sin(t * rock.fSpd         + rock.rotSeed)        * rock.fAmp,
      base.y + Math.cos(t * rock.fSpd * 0.72  + rock.rotSeed * 1.3)  * rock.fAmp * 0.80,
      base.z + Math.sin(t * rock.fSpd * 0.44  + rock.rotSeed * 0.6)  * rock.fAmp * 0.35,
    );

    /* Slow multi-axis tumble — like a real asteroid */
    meshRef.current.rotation.x  = Math.sin(t * 0.055 + rock.rotSeed) * 0.18;
    meshRef.current.rotation.y += 0.0014;
    meshRef.current.rotation.z  = Math.cos(t * 0.042 + rock.rotSeed * 1.1) * 0.12;

    /* Emissive: cold glow normally → intense cyan when camera zooms in */
    const targetEm = isActive ? 0.52 : 0.04;
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity, targetEm, 0.045,
    );
  });

  return (
    <mesh ref={meshRef} geometry={geo} frustumCulled={false}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        roughness={0.92}
        metalness={0.04}
        emissive={new THREE.Color('#0044cc')}
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}

/* ─── TIMELINE SCENE ─────────────────────────────────────────────────────── */
function TimelineScene({
  scrollRef, activeRef,
}: {
  scrollRef:  React.MutableRefObject<number>;
  activeRef:  React.MutableRefObject<number>;
}) {
  const { camera }   = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const camTarget    = useRef(CAM_KEYS[0].clone());

  useFrame(() => {
    const sp = scrollRef.current;

    /* ── Camera path interpolation ─────────────────────────────────── */
    const totalSegs = CAM_KEYS.length - 1;  // = N  (overview + N rocks = N+1 keys)
    const t         = sp * totalSegs;
    const seg       = Math.min(Math.floor(t), totalSegs - 1);
    const f         = THREE.MathUtils.smootherstep(t - seg, 0, 1);

    const posA = CAM_KEYS[seg];
    const posB = CAM_KEYS[Math.min(seg + 1, totalSegs)];
    camTarget.current.lerpVectors(posA, posB, f);

    /* Smooth camera lag so it feels like a physical camera */
    camera.position.lerp(camTarget.current, 0.055);

    /* ── Camera look-at ─────────────────────────────────────────────── */
    const lookA = LOOK_KEYS[seg];
    const lookB = LOOK_KEYS[Math.min(seg + 1, totalSegs)];
    const lookInstant = new THREE.Vector3().lerpVectors(lookA, lookB, f);
    lookAtTarget.current.lerp(lookInstant, 0.055);
    camera.lookAt(lookAtTarget.current);

    /* ── Active rock index ─────────────────────────────────────────── */
    // stage 0 = overview, stages 1-N = rocks 0-(N-1)
    const stage  = Math.min(Math.floor(t + 0.5), totalSegs); // round to nearest keyframe
    activeRef.current = Math.max(0, stage - 1);              // map stage→rock index
  });

  return (
    <>
      <WheelProxy />

      {/* Deep-space starfield — always visible, you're flying through it */}
      <Starfield opacity={0.75} />

      {/* Dramatic lighting for large rocks */}
      <ambientLight intensity={0.045} />
      <directionalLight position={[10, 16,  8]} intensity={1.05} color="#c2d4ff" />
      <directionalLight position={[-8, -6,  6]} intensity={0.28} color="#ff9050" />
      <pointLight       position={[ 0,  0, 30]} intensity={0.55} color="#1a55ff" distance={120} decay={2} />
      {/* Secondary fill light that moves with camera — approximated with static light */}
      <pointLight       position={[ 0,  5,  0]} intensity={0.20} color="#0066ff" distance={80} decay={2} />

      {TL_ROCKS.map((rock, i) => (
        <GiantRock
          key={i}
          rock={rock}
          idx={i}
          activeRef={activeRef}
        />
      ))}
    </>
  );
}

/* ─── PROGRESS DOTS ──────────────────────────────────────────────────────── */
function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom:   'clamp(24px, 4vh, 44px)',
      left:     '50%',
      transform: 'translateX(-50%)',
      zIndex:   20,
      display:  'flex',
      gap:      '10px',
      alignItems: 'center',
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width:           i === active ? '20px' : '5px',
            height:          '5px',
            borderRadius:    '3px',
            background:      i === active ? 'var(--cyan)' : 'rgba(0,200,255,0.22)',
            boxShadow:       i === active ? '0 0 10px rgba(0,200,255,0.7)' : 'none',
            transition:      'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── ENTRY INFO PANEL ───────────────────────────────────────────────────── */
function InfoPanel({ entry, visible }: {
  entry:   (typeof timeline)[0] | null;
  visible: boolean;
}) {
  return (
    <div
      style={{
        position:       'absolute',
        left:           'clamp(24px, 5vw, 60px)',
        bottom:         'clamp(60px, 10vh, 100px)',
        zIndex:         20,
        maxWidth:       '360px',
        opacity:        visible ? 1 : 0,
        transform:      visible ? 'translateY(0)' : 'translateY(16px)',
        transition:     'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents:  'none',
      }}
    >
      {entry && (
        <>
          {/* Faint glass card behind text */}
          <div style={{
            position:        'absolute',
            inset:           '-16px -20px',
            background:      'rgba(0,4,20,0.55)',
            backdropFilter:  'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius:    '4px',
            border:          '1px solid rgba(0,200,255,0.08)',
            zIndex:          -1,
          }} />

          <span style={{
            fontFamily:     "'JetBrains Mono', monospace",
            fontSize:       '10px',
            letterSpacing:  '.30em',
            textTransform:  'uppercase',
            color:          'var(--cyan)',
            display:        'block',
            marginBottom:   '8px',
          }}>
            {entry.year}
          </span>

          <h3 style={{
            fontFamily:   "'Syne', sans-serif",
            fontWeight:   700,
            fontSize:     'clamp(20px, 2.8vw, 32px)',
            color:        '#fff',
            lineHeight:   1.12,
            margin:       '0 0 6px',
            textShadow:   '0 0 32px rgba(0,180,255,0.25)',
          }}>
            {entry.title}
          </h3>

          {'subtitle' in entry && (
            <p style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '9px',
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color:         'rgba(0,200,255,0.50)',
              margin:        '0 0 12px',
            }}>
              {(entry as any).subtitle}
            </p>
          )}

          {'description' in entry && (
            <p style={{
              fontFamily:  "'DM Sans', sans-serif",
              fontSize:    'clamp(12px, 1.4vw, 14px)',
              lineHeight:  1.70,
              color:       'rgba(160,190,220,0.68)',
              margin:      0,
            }}>
              {(entry as any).description}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ─── SECTION ────────────────────────────────────────────────────────────── */
export default function TimelineRocksSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const activeRef = useRef(0);

  const [active,   setActive]   = useState(0);
  const [infoKey,  setInfoKey]  = useState(0);   // forces fade on rock change
  const [isOverview, setIsOverview] = useState(true);

  /* Scroll driver */
  useEffect(() => {
    const fn = () => {
      const el = outerRef.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const raw = -el.getBoundingClientRect().top / total;
      const p   = Math.max(0, Math.min(1, raw));
      scrollRef.current = p;

      /* Derive active rock from scroll position */
      const totalSegs = N;                         // N rocks → N segments
      const t    = p * totalSegs;
      const stage = Math.min(Math.floor(t + 0.5), totalSegs);
      const rock  = Math.max(0, stage - 1);

      setIsOverview(stage === 0 && t < 0.4);

      if (rock !== activeRef.current) {
        activeRef.current = rock;
        setActive(rock);
        setInfoKey(k => k + 1); // trigger fade-in of new info
      }
    };
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const sectionHeight = `${(N + 1) * 100}vh`;
  const entry = timeline[active] ?? null;

  return (
    <section
      ref={outerRef}
      id="timeline"
      style={{
        position:   'relative',
        height:     sectionHeight,
        background: '#000',
        borderTop:  '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Sticky viewport ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top:      0,
        width:    '100%',
        height:   '100vh',
        overflow: 'hidden',
      }}>

        {/* ── Canvas ───────────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 2.5, 52], fov: 54, near: 0.2, far: 800 }}
            dpr={[1, 2]}
            gl={{
              antialias:           true,
              powerPreference:     'high-performance',
              toneMapping:         THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.90,
            }}
          >
            <TimelineScene scrollRef={scrollRef} activeRef={activeRef} />
            <EffectComposer>
              <Bloom intensity={0.48} luminanceThreshold={0.52} luminanceSmoothing={0.24} />
            </EffectComposer>
          </Canvas>
        </div>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{
          position:   'absolute',
          top:        'clamp(18px, 3.5vh, 38px)',
          left:       0, right: 0,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:    '0 clamp(20px, 5vw, 60px)',
          zIndex:     10,
        }}>
          <span className="tl3-header-label">— Timeline</span>
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      '10px',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color:         'rgba(0,200,255,0.32)',
          }}>
            {isOverview ? 'scroll to explore' : `${active + 1} / ${N}`}
          </span>
        </div>

        {/* ── Overview hint (shown at top) ──────────────────────────── */}
        <div style={{
          position:       'absolute',
          top:            '50%',
          left:           '50%',
          transform:      'translate(-50%, -50%)',
          zIndex:         10,
          textAlign:      'center',
          opacity:        isOverview ? 1 : 0,
          transition:     'opacity 0.6s ease',
          pointerEvents:  'none',
        }}>
          <p style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      '9px',
            letterSpacing: '.32em',
            textTransform: 'uppercase',
            color:         'rgba(0,200,255,0.35)',
            marginBottom:  '12px',
          }}>
            — {N} milestones —
          </p>
          <div style={{
            width:      '1px',
            height:     '36px',
            background: 'linear-gradient(to bottom, rgba(0,200,255,0.5), transparent)',
            margin:     '0 auto',
            animation:  'linePulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* ── Info panel ───────────────────────────────────────────── */}
        <InfoPanel
          key={infoKey}
          entry={entry}
          visible={!isOverview}
        />

        {/* ── Progress dots ────────────────────────────────────────── */}
        {!isOverview && (
          <ProgressDots active={active} total={N} />
        )}

        {/* ── Thin progress line at bottom ─────────────────────────── */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          height:     '1px',
          background: 'rgba(255,255,255,0.04)',
          zIndex:     10,
        }}>
          <div style={{
            height:     '100%',
            width:      `${scrollRef.current * 100}%`,
            background: 'linear-gradient(to right, rgba(0,180,255,0.6), rgba(0,220,255,0.9))',
            boxShadow:  '0 0 10px rgba(0,200,255,0.4)',
            transition: 'width 0.25s ease',
          }} />
        </div>

      </div>
    </section>
  );
}
