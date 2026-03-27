'use client';
/**
 * HeroScene v10 — fully scroll-driven, no click interaction
 *
 * MH reveal is automatic at APPROACH_END + 0.01 scroll progress.
 * Returning from post-hero resumes at pre-reveal (LOCKED state, black hole
 * up close, no name shown) — user scrolls again to re-trigger reveal.
 * Progress bar at bottom for continuity with PostHeroSection.
 */
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import BlackHole            from './BlackHoleModel';
import Starfield            from './Starfield';
import ParticleField        from './ParticleField';
import CameraController     from './CameraController';
import LightRays            from './LightRays';
import GravitationalLensing from './GravitationalLensing';
import { useSceneStore }    from '@/store/scene';
import { HERO_PROGRESS_PORTION } from '@/lib/scroll';

type Phase = 'SPACE' | 'APPROACH' | 'HORIZON' | 'LOCKED' | 'EXPANDING' | 'REVEALED' | 'EXITED';

function SetBlack() {
  const { scene } = useThree();
  useMemo(() => { scene.background = new THREE.Color(0,0,0); }, [scene]);
  return null;
}

const APPROACH_END = 0.78;
const DIVE_START   = 0.78;
const DIVE_END     = 1.50;
const SCROLL_SPEED = 0.0011;

export default function HeroScene() {
  const scrollRef   = useRef(0);
  const targetRef   = useRef(0);
  const velRef      = useRef(0);
  const lensingRef  = useRef(0);
  const lightRayRef = useRef(0);
  const insideMixR  = useRef(0);
  const hasExpandedRef = useRef(false);

  const [progress,     setProgress]     = useState(0);
  const [phase,        setPhase]        = useState<Phase>('SPACE');
  const [diveProgress, setDiveProgress] = useState(0);
  const [heroHidden,   setHeroHidden]   = useState(false);

  const phaseRef      = useRef<Phase>('SPACE');
  const heroExited    = useSceneStore(s => s.heroExited);
  const setHeroExited = useSceneStore(s => s.setHeroExited);
  const set = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  /* ── Return from post-hero: resume at pre-reveal (no MH name) ── */
  const prevExitedRef = useRef(heroExited);
  useEffect(() => {
    const prev = prevExitedRef.current;
    prevExitedRef.current = heroExited;

    if (prev && !heroExited) {
      // Land just before the auto-expand threshold so MH doesn't appear
      // until the user intentionally scrolls down again
      const resume = APPROACH_END - 0.02;
      scrollRef.current = resume;
      targetRef.current = resume;
      velRef.current    = 0;
      hasExpandedRef.current = false;
      phaseRef.current  = 'LOCKED';
      setPhase('LOCKED');
      setProgress(resume);
      setDiveProgress(0);
      setHeroHidden(false);
    }
  }, [heroExited]);

  /* ── Phase transitions — purely scroll-driven ── */
  useEffect(() => {
    const p  = progress;
    const ph = phaseRef.current;
    if (ph === 'EXITED') return;

    // Allow the MH name to fade out when scrolling back up
    if ((ph === 'REVEALED' || ph === 'EXPANDING') && p < APPROACH_END - 0.04) {
      hasExpandedRef.current = false;
      if (p < 0.40) set('APPROACH');
      else set('HORIZON');
      return;
    }

    // ── Exit to post-hero ────────────────────────────────────────
    if (ph === 'REVEALED' && p >= DIVE_END - 0.02) {
      set('EXITED');
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height   = 'auto';
      document.body.style.overflow  = 'auto';
      document.body.style.overflowX = 'hidden';
      setTimeout(() => {
        setHeroExited(true);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setHeroHidden(true);
      }, 300);
      return;
    }

    // ── Auto-expand at APPROACH_END — no click needed ────────────
    if (!hasExpandedRef.current && p > APPROACH_END + 0.01 &&
        (ph === 'LOCKED' || ph === 'HORIZON' || ph === 'APPROACH')) {
      hasExpandedRef.current = true;
      set('EXPANDING');
      // Timer drives the name-reveal animation; scroll already past threshold
      setTimeout(() => {
        if (phaseRef.current === 'EXPANDING') set('REVEALED');
      }, 1400);
      return;
    }

    // ── Skip normal transitions during expansion / reveal ────────
    if (ph === 'EXPANDING' || ph === 'REVEALED') return;

    // ── Normal forward / backward transitions ───────────────────
    if (p > 0.04  && ph === 'SPACE')    set('APPROACH');
    if (p > 0.45  && ph === 'APPROACH') set('HORIZON');
    if (p > APPROACH_END && (ph === 'HORIZON' || ph === 'APPROACH')) set('LOCKED');

    if (p < 0.03  && ph === 'APPROACH') set('SPACE');
    if (p < 0.40  && ph === 'HORIZON')  set('APPROACH');
    if (p < APPROACH_END - 0.06 && ph === 'LOCKED') set('HORIZON');
  }, [progress, setHeroExited]);

  /* ── Wheel handler — fully scroll-driven ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const ph = phaseRef.current;
      if (ph === 'EXITED') return;
      e.preventDefault();

      if (ph === 'REVEALED') {
        // Full range once revealed, drives the dive
        targetRef.current = THREE.MathUtils.clamp(
          targetRef.current + e.deltaY * SCROLL_SPEED * 0.9, 0, DIVE_END);
        return;
      }

      if (ph === 'EXPANDING') {
        // During expansion animation only allow backward scroll (to cancel / re-approach)
        if (e.deltaY < 0)
          targetRef.current = Math.max(0, targetRef.current + e.deltaY * SCROLL_SPEED);
        return;
      }

      // SPACE / APPROACH / HORIZON / LOCKED — scroll up to just past threshold
      targetRef.current = THREE.MathUtils.clamp(
        targetRef.current + e.deltaY * SCROLL_SPEED, 0, APPROACH_END + 0.03);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  /* ── Animation loop ── */
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const diff = targetRef.current - scrollRef.current;
      velRef.current     = diff * 60;
      scrollRef.current += diff * 0.07;
      const s  = scrollRef.current;
      const sA = THREE.MathUtils.clamp(s, 0, 1);
      lensingRef.current  += (THREE.MathUtils.smootherstep(sA,0.10,0.60)*0.28 - lensingRef.current)*0.06;
      lightRayRef.current += (THREE.MathUtils.smootherstep(sA,0.18,0.68)*0.90 - lightRayRef.current)*0.05;
      insideMixR.current  += (THREE.MathUtils.smootherstep(sA,0.65,0.85)      - insideMixR.current)*0.05;
      const dp = THREE.MathUtils.clamp((s - DIVE_START) / (DIVE_END - DIVE_START), 0, 1);
      setDiveProgress(dp);
      setProgress(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ap     = THREE.MathUtils.clamp(progress, 0, 1);
  const outMix = 1 - THREE.MathUtils.smootherstep(ap, 0.65, 0.85);
  const starOp = outMix * (1 - THREE.MathUtils.smootherstep(ap, 0.70, 0.90) * 0.5) + 0.05;
  const bloom  = 0.20 + ap * 0.25 * outMix + diveProgress * 0.42;

  // Hero fades itself out as the user dives in, revealing PostHero below
  const diveOpacity = diveProgress > 0.45
    ? Math.max(0, 1 - ((diveProgress - 0.45) / 0.55)) : 1;

  const showName  = phase === 'EXPANDING' || phase === 'REVEALED';
  const nameFade  = showName
    ? Math.max(0, 1 - Math.max(0, (diveProgress - 0.30) / 0.25)) : 0;
  const showSub   = phase === 'REVEALED' && diveProgress > 0.05;

  // Progress 0→1 across the full hero journey (DIVE_END = 1.5)
  const heroProgress = THREE.MathUtils.clamp(progress / DIVE_END, 0, 1);
  const progressPct  = heroProgress * HERO_PROGRESS_PORTION * 100;

  return (
    <div className="hero-wrap" style={{
      position: 'fixed', inset: 0, zIndex: 10, background: '#000',
      opacity:       heroHidden ? 0 : diveOpacity,
      transition:    'none',
      pointerEvents: (heroHidden || phase === 'EXITED') ? 'none' : 'auto',
    }}>
      <Canvas
        camera={{ position: [0, 7.5, 30], fov: 57, near: 0.05, far: 650 }}
        dpr={[1, 2]}
        gl={{
          antialias:         true,
          powerPreference:   'high-performance',
          toneMapping:       THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.82,
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
          <Bloom intensity={bloom} luminanceThreshold={0.68} luminanceSmoothing={0.18} />
          <Vignette eskil={false} offset={0.22} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <div className="hero-radial-scrim" />

      {/* MH name — appears automatically on scroll, no click needed */}
      {showName && (
        <div
          className={`mh-name${phase === 'EXPANDING' ? ' mh-name-expanding' : ' mh-name-revealed'}`}
          style={{ opacity: nameFade }}
        >
          <div className="mh-name-text">
            <div className="mh-name-row">
              <span className="mh-name-initial">M</span>
              <span className="mh-name-rest mh-name-rest-m">ohammed</span>
            </div>
            <div className="mh-name-row">
              <span className="mh-name-initial">H</span>
              <span className="mh-name-rest mh-name-rest-h">assoun</span>
            </div>
          </div>
        </div>
      )}

      <div className={`hero-sub${showSub ? ' hs-visible' : ''}`}>
        <div className="hero-sub-card">
          <p className="hs-role">Software Engineer</p>
          <p className="hs-tag">"I only design what's necessary, not what's flashy."</p>
          <div className="hs-cta">
            <button
              className="btn-primary"
              onClick={() => {
                if (phaseRef.current === 'REVEALED')
                  targetRef.current = DIVE_START + 0.05;
              }}
            >
              Explore Work
            </button>
            <button className="btn-secondary">Contact</button>
          </div>
        </div>
        <div className="hs-scroll-dive">
          <div className="hs-line" /><span>scroll to dive in</span>
        </div>
      </div>

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

      {/* ── Progress bar — same style as PostHeroSection ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px', background: 'rgba(255,255,255,.022)', zIndex: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          background: 'linear-gradient(to right, rgba(14,165,233,.40), rgba(125,211,252,.78))',
          boxShadow: '0 0 8px rgba(125,211,252,.28)',
          transition: 'width .18s ease',
        }} />
      </div>
    </div>
  );
}
