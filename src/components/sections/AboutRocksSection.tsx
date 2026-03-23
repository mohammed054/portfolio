'use client';
/**
 * AboutRocksSection v3 — "Space Float → Convergence → Rocky Wall → Text Reveal → Tunnel Exit"
 *
 * Phases over 500vh scroll:
 *   0.00 – 0.58   75 rocks floating in deep space, high-quality starfield visible
 *   0.58 – 0.82   Rocks slowly converge toward each other (gravitational pull)
 *   0.80 – 0.92   Rocky mass assembled, about text scrambles in over rocky wall
 *   0.90 – 1.00   EXIT tunnel — rocks rush toward camera, FOV widens, BOOM → Timeline
 */
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree }            from '@react-three/fiber';
import { EffectComposer, Bloom }                  from '@react-three/postprocessing';
import * as THREE                                 from 'three';
import Starfield                                  from '@/components/hero/Starfield';

/* ─── SCRAMBLE HOOK ──────────────────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
function useScramble(target: string, active: boolean, delay = 0) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!active) { setDisplay(''); return; }
    const tid = setTimeout(() => {
      let i = 0, k = 0;
      const step = () => {
        if (i >= target.length) { setDisplay(target); return; }
        setDisplay(
          target.slice(0, i) +
          (k < 4 ? CHARS[Math.random() * CHARS.length | 0] : target[i]) +
          target.slice(i + 1).replace(/\S/g, '·'),
        );
        if (++k > 4) { k = 0; i++; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(tid);
  }, [active, target, delay]);
  return display || '\u00a0';
}

/* ─── COUNT-UP ───────────────────────────────────────────────────────────── */
function CountUp({ to, suffix, active, delay }: {
  to: number; suffix: string; active: boolean; delay: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const tid = setTimeout(() => {
      let v = 0;
      const go = () => { setN(Math.min(++v, to)); if (v < to) setTimeout(go, 22); };
      go();
    }, delay);
    return () => clearTimeout(tid);
  }, [active, to, delay]);
  return <>{n}{suffix}</>;
}

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

/* ─── PROCEDURAL ROCK GEOMETRY ───────────────────────────────────────────── */
function createRockGeo(radius: number, seed: number, detail = 2): THREE.BufferGeometry {
  const geo    = new THREE.IcosahedronGeometry(radius, detail);
  const pos    = geo.attributes.position as THREE.BufferAttribute;
  const count  = pos.count;
  const colors = new Float32Array(count * 3);
  const h1     = (v: number) => Math.abs(Math.sin(v * 127.1 + seed * 311.7 + 17.3));
  const h2     = (v: number) => Math.abs(Math.sin(v *  73.1 + seed * 197.3 + 29.7));
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const n1   = h1(x * 5.3 + y * 11.7 + z *  7.1);
    const n2   = h1(x * 13.1 + z * 9.3 + y *  4.7) * 0.40;
    const n3   = h1(y * 17.3 + x *  6.7 + z *  2.9) * 0.20;
    const bump = 1 + n1 * 0.32 + n2 * 0.14 + n3 * 0.08;
    pos.setXYZ(i, x * bump, y * bump, z * bump);
    const c      = h2(x * 3.1 + y * 7.3 + z * 4.7);
    const streak = h1(y * 8.7 + z * 5.3 + x * 3.1) > 0.74 ? 0.09 : 0.0;
    const base   = 0.06 + c * 0.12;
    colors[i * 3]     = base + streak + 0.022;
    colors[i * 3 + 1] = base + streak;
    colors[i * 3 + 2] = base + streak - 0.010;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/* ─── ROCK CONFIGURATIONS ────────────────────────────────────────────────── */
const NUM_ROCKS = 78;

// Camera at z=9, fov=60 → at z=0: visible half-width ≈ 5.2, half-height ≈ 2.9 (16:9)
const ROCK_CFGS = Array.from({ length: NUM_ROCKS }, (_, i) => {
  const r = (o: number) => sr(i * 113.7 + o);

  /* Wall: dense cluster that fills & slightly overflows the viewport */
  const wx = (r(1) - 0.5) * 14;   // ±7 units  — wide enough to bleed off-screen
  const wy = (r(2) - 0.5) * 9;    // ±4.5 units
  const wz = (r(3) - 0.5) * 5.5 - 1.2; // ±2.75 depth, biased behind origin

  /* Scatter: distributed in front hemisphere so rocks are VISIBLE in space */
  const sx = (r(4) - 0.5) * 56;   // ±28 spread
  const sy = (r(5) - 0.5) * 36;   // ±18 spread
  const sz = -(9 + r(6) * 54);    // z: -9 to -63  (in front of camera)

  return {
    wall:    [wx, wy, wz] as [number, number, number],
    scatter: [sx, sy, sz] as [number, number, number],
    size:    0.22 + r(7) * 0.68,   // 0.22 – 0.90 radius
    seed:    (i * 41 + 7) | 0,
    fAmp:    0.08 + r(8) * 0.30,   // float amplitude
    fSpd:    0.08 + r(9) * 0.22,   // float speed
    rotSeed: r(10) * Math.PI * 2,
    rotSpd:  0.0030 + r(11) * 0.0110,
  };
});

/* ─── INDIVIDUAL SPACE ROCK ──────────────────────────────────────────────── */
function SpaceRock({
  cfg, scrollRef,
}: {
  cfg:       (typeof ROCK_CFGS)[0];
  scrollRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshStandardMaterial>(null);
  const geo     = useMemo(() => createRockGeo(cfg.size, cfg.seed, 2), [cfg.size, cfg.seed]);
  const scV     = useMemo(() => new THREE.Vector3(...cfg.scatter), []);
  const wlV     = useMemo(() => new THREE.Vector3(...cfg.wall),    []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t  = clock.getElapsedTime();
    const sp = scrollRef.current;

    /* Phase progress */
    const convP = THREE.MathUtils.smootherstep(sp, 0.58, 0.82); // scatter → wall
    const tunP  = THREE.MathUtils.smootherstep(sp, 0.90, 1.00); // wall → tunnel
    const scI   = 1 - convP;                                     // scatter influence

    /* Gentle float while scattered */
    const fx = Math.sin(t * cfg.fSpd         + cfg.rotSeed)       * cfg.fAmp * scI;
    const fy = Math.cos(t * cfg.fSpd * 0.70  + cfg.rotSeed * 1.5) * cfg.fAmp * scI;

    /* Base position: scatter → wall */
    const bx = THREE.MathUtils.lerp(scV.x, wlV.x, convP) + fx;
    const by = THREE.MathUtils.lerp(scV.y, wlV.y, convP) + fy;
    const bz = THREE.MathUtils.lerp(scV.z, wlV.z, convP);

    /* EXIT tunnel: rush toward camera with quadratic acceleration */
    const tZ = tunP * tunP * 40;

    meshRef.current.position.set(bx, by, bz + tZ);

    /* Rotation: wild tumble when scattered, slow when assembled, warp spin during tunnel */
    meshRef.current.rotation.x = Math.sin(t * 0.09 + cfg.rotSeed)       * 0.55 * scI;
    meshRef.current.rotation.y = t * cfg.rotSpd * (1 + tunP * 8) + cfg.rotSeed;
    meshRef.current.rotation.z = Math.cos(t * 0.07 + cfg.rotSeed * 0.8) * 0.42 * scI;

    /* Scale: normal → massive during tunnel */
    const tSc = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      1 + tunP * 4.0,
      0.10,
    );
    meshRef.current.scale.setScalar(tSc);

    /* Emissive: subtle → blazing cyan during tunnel */
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      0.04 + tunP * 1.6,
      0.08,
    );
  });

  return (
    <mesh ref={meshRef} geometry={geo} frustumCulled={false}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        roughness={0.94}
        metalness={0.03}
        emissive={new THREE.Color('#001e44')}
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}

/* ─── ABOUT 3-D SCENE ────────────────────────────────────────────────────── */
function AboutScene({
  scrollRef,
  starOpacity,
}: {
  scrollRef:   React.MutableRefObject<number>;
  starOpacity: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const sp   = scrollRef.current;
    const tunP = THREE.MathUtils.smootherstep(sp, 0.90, 1.00);
    if (camera instanceof THREE.PerspectiveCamera) {
      /* Widen field-of-view during tunnel for warp feel */
      const targetFov = THREE.MathUtils.lerp(60, 108, tunP * tunP);
      camera.fov      = THREE.MathUtils.lerp(camera.fov, targetFov, 0.055);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <WheelProxy />

      {/* Starfield fades as rocks assemble */}
      <Starfield opacity={starOpacity} />

      {/* Lighting: very low ambient, dramatic directional */}
      <ambientLight intensity={0.055} />
      <directionalLight position={[ 8, 14,  7]} intensity={0.90} color="#b4ccff" />
      <directionalLight position={[-6, -4,  5]} intensity={0.22} color="#ff8040" />
      <pointLight       position={[ 0,  0, 14]} intensity={0.55} color="#1a66ff" distance={60} decay={2} />

      {ROCK_CFGS.map((cfg, i) => (
        <SpaceRock key={i} cfg={cfg} scrollRef={scrollRef} />
      ))}
    </>
  );
}

/* ─── SECTION ────────────────────────────────────────────────────────────── */
export default function AboutRocksSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [sp, setSp]         = useState(0);
  const [starOp, setStarOp] = useState(1);

  /* Scroll driver */
  useEffect(() => {
    const fn = () => {
      const el = outerRef.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const raw = -el.getBoundingClientRect().top / total;
      const p   = Math.max(0, Math.min(1, raw));
      scrollRef.current = p;
      setSp(p);
      /* Stars fade as rocks converge */
      setStarOp(Math.max(0, 1 - THREE.MathUtils.smootherstep(p, 0.54, 0.82)));
    };
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── Phase labels */
  const phaseLabel =
    sp < 0.04 ? '' :
    sp < 0.40 ? '— fragments adrift —' :
    sp < 0.58 ? '— something stirs —' :
    sp < 0.82 ? '— gravitational pull —' :
    sp < 0.89 ? '— singularity —' : '';

  /* ── Text reveal (sp > 0.85) */
  const tv  = sp > 0.85;
  const pct = `${(sp * 100).toFixed(1)}%`;

  /* Scrambled lines */
  const l0 = useScramble("I don't build interfaces.",        tv, 60);
  const l1 = useScramble("I design controlled experiences.", tv, 440);
  const p0 = useScramble("Systems over features",  tv, 900);
  const p1 = useScramble("Precision over volume",  tv, 1100);
  const p2 = useScramble("Performance over noise", tv, 1300);

  /* Tunnel blackout: fade out entirely at the very end */
  const blackoutOp = Math.max(0, THREE.MathUtils.smootherstep(sp, 0.963, 1.00));

  return (
    <section ref={outerRef} id="about" className="ar-outer">
      <div className="ar-sticky">

        {/* ── 3-D canvas ─────────────────────────────────────────────── */}
        <div className="ar-canvas-wrap">
          <Canvas
            camera={{ position: [0, 0, 9], fov: 60, near: 0.08, far: 400 }}
            dpr={[1, 2]}
            gl={{
              antialias:           true,
              powerPreference:     'high-performance',
              toneMapping:         THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.86,
            }}
          >
            <AboutScene scrollRef={scrollRef} starOpacity={starOp} />
            <EffectComposer>
              <Bloom
                intensity={sp > 0.90 ? 1.2 + (sp - 0.90) * 6 : 0.32}
                luminanceThreshold={0.52}
                luminanceSmoothing={0.28}
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* ── Phase label ───────────────────────────────────────────── */}
        {phaseLabel && (
          <div className="ar-phase-label" key={phaseLabel}>{phaseLabel}</div>
        )}

        {/* ── Text overlay — rocky wall phase ────────────────────────── */}
        <div className={`ar-overlay${tv ? ' ar-overlay-in' : ''}`}>
          <div className="ar-overlay-scrim" />
          <div className="ar-overlay-content">

            {/* Left — identity */}
            <div className="ar-col-left">
              <p
                className={`ar-eyebrow${tv ? ' ar-el-in' : ''}`}
                style={{ '--td': '0s' } as React.CSSProperties}
              >
                — Software Engineer
              </p>

              <div className="ar-statement">
                <p
                  className={`ar-line${tv ? ' ar-el-in' : ''}`}
                  style={{ '--td': '.08s' } as React.CSSProperties}
                >{l0}</p>
                <p
                  className={`ar-line ar-line-accent${tv ? ' ar-el-in' : ''}`}
                  style={{ '--td': '.22s' } as React.CSSProperties}
                >{l1}</p>
              </div>

              <div
                className={`ar-avail${tv ? ' ar-el-in' : ''}`}
                style={{ '--td': '.44s' } as React.CSSProperties}
              >
                <span className="avail-dot-green" />
                <span className="avail-label">Available for work</span>
              </div>

              <div className="ar-principles">
                {[p0, p1, p2].map((p, i) => (
                  <div
                    key={i}
                    className={`ar-principle${tv ? ' ar-el-in' : ''}`}
                    style={{ '--td': `${0.68 + i * 0.15}s` } as React.CSSProperties}
                  >
                    <span className="apr-dash">—</span>
                    <span className="apr-text">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — stats */}
            <div
              className={`ar-col-right${tv ? ' ar-el-in' : ''}`}
              style={{ '--td': '.50s' } as React.CSSProperties}
            >
              {[
                { to: 5,  s: '+', lbl: 'Years'    },
                { to: 40, s: '+', lbl: 'Projects' },
                { to: 12, s: '+', lbl: 'Clients'  },
              ].map(({ to, s, lbl }, i) => (
                <div key={i} className="ar-stat">
                  <span className="ar-stat-n">
                    <CountUp to={to} suffix={s} active={tv} delay={640 + i * 180} />
                  </span>
                  <span className="ar-stat-l">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tunnel blackout overlay ───────────────────────────────── */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            background:     '#000',
            opacity:        blackoutOp,
            zIndex:         60,
            pointerEvents:  'none',
          }}
        />

        {/* ── Progress bar ──────────────────────────────────────────── */}
        <div className="ar-pbar">
          <div className="ar-pbar-fill" style={{ width: pct }} />
        </div>

      </div>
    </section>
  );
}
