'use client';
/**
 * HeroScene
 *
 * Scroll journey:
 *   0.00 → 0.78  Approach: zoom toward black hole
 *   0.78          LOCKED: MH appears. Scroll UP still works (can go back).
 *                 Scroll DOWN blocked until click.
 *   click MH →   EXPANDING: name reveals (M→Mohammed, H→Hassoun)
 *   ~1.7s →      REVEALED: subtitle visible, scroll down = dive
 *   scroll down → targetRef continues to 1.5 (scroll-driven dive)
 *                 Camera rushes through singularity, stars stream past
 *                 Canvas brightness/blur applied via inline style (not CSS anim)
 *   targetRef=1.5 → body scroll unlocks, page scrolls naturally
 */
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import BlackHole            from './BlackHoleModel';
import Starfield            from './Starfield';
import ParticleField        from './ParticleField';
import CameraController     from './CameraController';
import LightRays            from './LightRays';
import GravitationalLensing from './GravitationalLensing';

type Phase = 'SPACE' | 'APPROACH' | 'HORIZON' | 'LOCKED' | 'EXPANDING' | 'REVEALED' | 'EXITED';

function SetBlack() {
  const { scene } = useThree();
  useMemo(() => { scene.background = new THREE.Color(0, 0, 0); }, [scene]);
  return null;
}

// Scroll constants
const APPROACH_END  = 0.78;  // progress where LOCKED triggers
const DIVE_START    = 0.78;  // scroll range where dive begins (post-reveal)
const DIVE_END      = 1.50;  // scroll value at which page unlocks
const SCROLL_SPEED  = 0.0011;

export default function HeroScene() {
  const scrollRef  = useRef(0);   // smoothed scroll (0 → 1.5)
  const targetRef  = useRef(0);   // raw target (0 → 1.5)
  const velRef     = useRef(0);

  const lensingRef  = useRef(0);
  const lightRayRef = useRef(0);
  const insideMixR  = useRef(0);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState<Phase>('SPACE');
  const phaseRef = useRef<Phase>('SPACE');

  // Dive progress (0→1) for visual effects — NOT a CSS animation
  const [diveProgress, setDiveProgress] = useState(0);

  const set = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  // ── PHASE TRANSITIONS ─────────────────────────────────────────────────────
  useEffect(() => {
    const p = progress;
    const ph = phaseRef.current;
    if (ph === 'EXITED') return;

    // Forward transitions
    if (p > 0.04  && ph === 'SPACE')    set('APPROACH');
    if (p > 0.45  && ph === 'APPROACH') set('HORIZON');
    if (p > APPROACH_END && (ph === 'HORIZON' || ph === 'APPROACH')) set('LOCKED');

    // BACKWARD — allow scrolling back from LOCKED to see the black hole
    if (p < 0.03  && ph === 'APPROACH') set('SPACE');
    if (p < 0.40  && ph === 'HORIZON')  set('APPROACH');
    if (p < APPROACH_END - 0.06 && ph === 'LOCKED') set('HORIZON');

    // Dive exit: when scroll reaches end, unlock page
    if (p >= DIVE_END - 0.02 && ph === 'REVEALED') {
      set('EXITED');
      document.body.style.overflow  = 'auto';
      document.body.style.overflowX = 'hidden';
    }
  }, [progress]);

  // ── WHEEL HANDLER ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const ph = phaseRef.current;

      if (ph === 'EXITED') return; // page scrolling freely

      // LOCKED or EXPANDING: allow UP scroll (go back), block DOWN
      if (ph === 'LOCKED' || ph === 'EXPANDING') {
        e.preventDefault();
        if (e.deltaY < 0) {
          // Scroll back — decrease target, will exit LOCKED state via phase transition
          targetRef.current = Math.max(0, targetRef.current + e.deltaY * SCROLL_SPEED);
        }
        return;
      }

      e.preventDefault();

      if (ph === 'REVEALED') {
        // Extend target into the dive range (0.78 → 1.5)
        targetRef.current = THREE.MathUtils.clamp(
          targetRef.current + e.deltaY * SCROLL_SPEED * 0.9,
          0,
          DIVE_END
        );
        return;
      }

      // Normal approach
      targetRef.current = THREE.MathUtils.clamp(
        targetRef.current + e.deltaY * SCROLL_SPEED,
        0,
        APPROACH_END + 0.01
      );
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // ── ANIMATION LOOP ────────────────────────────────────────────────────────
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const diff = targetRef.current - scrollRef.current;
      velRef.current    = diff * 60;
      scrollRef.current += diff * 0.07;
      const s = scrollRef.current;

      // Clamp for effect computations
      const sApproach = THREE.MathUtils.clamp(s, 0, 1);

      lensingRef.current  += (THREE.MathUtils.smootherstep(sApproach, 0.10, 0.60) * 0.28 - lensingRef.current) * 0.06;
      lightRayRef.current += (THREE.MathUtils.smootherstep(sApproach, 0.18, 0.68) * 0.90 - lightRayRef.current) * 0.05;
      insideMixR.current  += (THREE.MathUtils.smootherstep(sApproach, 0.65, 0.85) - insideMixR.current) * 0.05;

      // Dive progress 0→1 based on scroll 0.78→1.5
      const dp = THREE.MathUtils.clamp((s - DIVE_START) / (DIVE_END - DIVE_START), 0, 1);
      setDiveProgress(dp);

      setProgress(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── MH CLICK ──────────────────────────────────────────────────────────────
  const handleMHClick = useCallback(() => {
    if (phaseRef.current !== 'LOCKED') return;
    set('EXPANDING');
    setTimeout(() => set('REVEALED'), 1700);
  }, []);

  // ── DERIVED VISUALS ───────────────────────────────────────────────────────
  const approachProgress = THREE.MathUtils.clamp(progress, 0, 1);
  const outMix  = 1 - THREE.MathUtils.smootherstep(approachProgress, 0.65, 0.85);
  const starOp  = outMix * (1 - THREE.MathUtils.smootherstep(approachProgress, 0.70, 0.90) * 0.5) + 0.05;
  const bloom   = 0.36 + approachProgress * 0.55 * outMix + diveProgress * 1.5;

  // Dive visual: brightness + blur applied INLINE (not CSS animation)
  // This way it's frame-perfect and scroll-driven
  const diveFilter = diveProgress > 0
    ? `brightness(${1 + diveProgress * diveProgress * 8}) blur(${diveProgress * diveProgress * 18}px) saturate(${1 - diveProgress * 0.8})`
    : 'none';
  const diveOpacity = diveProgress > 0.7
    ? 1 - ((diveProgress - 0.7) / 0.3)
    : 1;

  const showMH    = phase === 'LOCKED' || phase === 'EXPANDING' || phase === 'REVEALED';
  const expanding = phase === 'EXPANDING' || phase === 'REVEALED';
  const isLocked  = phase === 'LOCKED';

  return (
    <div
      className="hero-wrap"
      style={{
        position: 'fixed', inset: 0, zIndex: 10, background: '#000',
        filter:  diveFilter,
        opacity: diveOpacity,
        transition: 'none', // scroll-driven, no CSS transitions
        pointerEvents: phase === 'EXITED' ? 'none' : 'auto',
      }}
    >
      {/* ── THREE.JS CANVAS ─────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 7.5, 30], fov: 57, near: 0.05, far: 650 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <SetBlack />
        <CameraController scrollRef={scrollRef} />
        <Starfield opacity={starOp} />
        <ParticleField scrollRef={scrollRef} velRef={velRef} insideMixRef={insideMixR} />
        <BlackHole />
        <LightRays strengthRef={lightRayRef} />
        <EffectComposer>
          <GravitationalLensing strengthRef={lensingRef} />
          <Bloom intensity={bloom} luminanceThreshold={0.68} luminanceSmoothing={0.20} />
          <Vignette eskil={false} offset={0.22} darkness={0.78} />
        </EffectComposer>
      </Canvas>

      {/* ── MH / FULL NAME ──────────────────────────────────────────────── */}
      {showMH && (
        <div
          className={`mh-container${isLocked ? ' mh-idle' : ''}${expanding ? ' mh-expanding' : ''}`}
          onClick={handleMHClick}
          style={{ pointerEvents: isLocked ? 'auto' : 'none', cursor: isLocked ? 'pointer' : 'default' }}
        >
          <div className="mh-row">
            <span className="mh-letter">
              <span className="mh-initial">M</span>
              <span className="mh-rest mh-rest-m">ohammed</span>
            </span>
            <span className="mh-letter">
              <span className="mh-initial">H</span>
              <span className="mh-rest mh-rest-h">assoun</span>
            </span>
          </div>
          {isLocked && <p className="mh-hint">— click to reveal —</p>}
        </div>
      )}

      {/* ── SUBTITLE ────────────────────────────────────────────────────── */}
      <div className={`hero-sub${phase === 'REVEALED' ? ' hs-visible' : ''}`}>
        <p className="hs-role">Software Engineer</p>
        <p className="hs-tag">"I only design what's necessary, not what's flashy."</p>
        <div className="hs-cta">
          <button
            className="btn-primary"
            onClick={() => {
              // Manually extend target to start the dive
              if (phaseRef.current === 'REVEALED') {
                targetRef.current = DIVE_START + 0.05;
              }
            }}
          >
            Explore Work
          </button>
          <button className="btn-secondary">Contact</button>
        </div>
        <div className="hs-scroll-dive">
          <div className="hs-line" />
          <span>scroll to dive in</span>
        </div>
      </div>

      {/* ── HUD ─────────────────────────────────────────────────────────── */}
      {phase === 'SPACE' && (
        <div className="scroll-hint visible">
          <div className="sh-line" /><span className="sh-text">scroll to enter</span>
        </div>
      )}
      {(phase === 'APPROACH' || phase === 'HORIZON') && (
        <div className="void-label">
          {progress < 0.42
            ? 'APPROACHING SINGULARITY'
            : progress < 0.65
            ? 'EVENT HORIZON'
            : 'CROSSING THRESHOLD'}
        </div>
      )}
    </div>
  );
}
