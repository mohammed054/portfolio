'use client';
/**
 * HeroScene v9 — tuned bloom for log-polar disk
 *
 * Disk max intensity: 0.88 (hot spots only)
 * Most disk surface: 0.10–0.45 (turbulent bands)
 * Dark gaps: 0.0
 *
 * Bloom threshold 0.68 → photon rings + hot blobs glow, disk texture preserved
 * toneMappingExposure 0.82 → saturated gold without clipping darks
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
import { useSceneStore }    from '@/store/scene';

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

  // Resume at end of hero when returning from post-hero
  const prevExitedRef = useRef(heroExited);
  useEffect(() => {
    const prev = prevExitedRef.current;
    prevExitedRef.current = heroExited;

    // Returning from post-hero → resume at the revealed state (not reset)
    if (prev && !heroExited) {
      const resume = DIVE_START + 0.08;
      scrollRef.current = resume;
      targetRef.current = resume;
      velRef.current    = 0;
      hasExpandedRef.current = true;
      phaseRef.current  = 'REVEALED';
      setPhase('REVEALED');
      setProgress(resume);
      const dp = THREE.MathUtils.clamp((resume - DIVE_START) / (DIVE_END - DIVE_START), 0, 1);
      setDiveProgress(dp);
      setHeroHidden(false);
      return;
    }
  }, [heroExited]);

  useEffect(() => {
    const p  = progress;
    const ph = phaseRef.current;
    if (ph === 'EXITED') return;
    if (hasExpandedRef.current && (ph === 'EXPANDING' || ph === 'REVEALED')) {
      if (p >= DIVE_END - 0.02 && ph === 'REVEALED') {
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
      }
      return;
    }
    if (p > 0.04  && ph === 'SPACE')    set('APPROACH');
    if (p > 0.45  && ph === 'APPROACH') set('HORIZON');
    if (p > APPROACH_END && (ph === 'HORIZON' || ph === 'APPROACH')) set('LOCKED');
    if (!hasExpandedRef.current) {
      if (p < 0.03  && ph === 'APPROACH') set('SPACE');
      if (p < 0.40  && ph === 'HORIZON')  set('APPROACH');
      if (p < APPROACH_END - 0.06 && ph === 'LOCKED') set('HORIZON');
    }
  }, [progress, setHeroExited]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const ph = phaseRef.current;
      if (ph === 'EXITED') return;
      e.preventDefault();
      if (ph === 'LOCKED' || ph === 'EXPANDING') {
        if (e.deltaY < 0 && !hasExpandedRef.current)
          targetRef.current = Math.max(0, targetRef.current + e.deltaY * SCROLL_SPEED);
        return;
      }
      if (ph === 'REVEALED') {
        targetRef.current = THREE.MathUtils.clamp(
          targetRef.current + e.deltaY * SCROLL_SPEED * 0.9, 0, DIVE_END);
        return;
      }
      targetRef.current = THREE.MathUtils.clamp(
        targetRef.current + e.deltaY * SCROLL_SPEED, 0, APPROACH_END + 0.01);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

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
      const dp = THREE.MathUtils.clamp((s-DIVE_START)/(DIVE_END-DIVE_START),0,1);
      setDiveProgress(dp);
      setProgress(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMHClick = useCallback(() => {
    if (phaseRef.current !== 'LOCKED') return;
    hasExpandedRef.current = true;
    set('EXPANDING');
    setTimeout(() => set('REVEALED'), 1700);
  }, []);

  const ap     = THREE.MathUtils.clamp(progress, 0, 1);
  const outMix = 1 - THREE.MathUtils.smootherstep(ap, 0.65, 0.85);
  const starOp = outMix * (1 - THREE.MathUtils.smootherstep(ap, 0.70, 0.90)*0.5) + 0.05;

  // Bloom: disk surface 0.10–0.45, threshold 0.68 → only hot spots/rings bloom
  const bloom = 0.20 + ap * 0.25 * outMix + diveProgress * 0.42;

  const diveOpacity = diveProgress > 0.45
    ? Math.max(0, 1-((diveProgress-0.45)/0.55)) : 1;

  const showBadge = phase === 'LOCKED';
  const showName  = phase === 'EXPANDING' || phase === 'REVEALED';
  const nameFade  = showName ? Math.max(0,1-Math.max(0,(diveProgress-0.30)/0.25)) : 0;
  const showSub   = phase === 'REVEALED' && diveProgress > 0.05;

  if (heroHidden) return null;

  return (
    <div className="hero-wrap" style={{
      position:'fixed', inset:0, zIndex:10, background:'#000',
      opacity:diveOpacity, transition:'none',
      pointerEvents: phase==='EXITED' ? 'none' : 'auto',
    }}>
      <Canvas
        camera={{ position:[0,7.5,30], fov:57, near:0.05, far:650 }}
        dpr={[1,2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
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
          <Bloom
            intensity={bloom}
            luminanceThreshold={0.68}
            luminanceSmoothing={0.18}
          />
          <Vignette eskil={false} offset={0.22} darkness={0.85} />
        </EffectComposer>
      </Canvas>

      <div className="hero-radial-scrim" />

      {showBadge && (
        <div className="mh-badge" onClick={handleMHClick}>
          <div className="mh-badge-inner">
            <span className="mh-badge-letter">M</span>
            <div className="mh-badge-sep" />
            <span className="mh-badge-letter">H</span>
          </div>
          <p className="mh-hint">— click to reveal —</p>
        </div>
      )}

      {showName && (
        <div
          className={`mh-name${phase==='EXPANDING'?' mh-name-expanding':' mh-name-revealed'}`}
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

      <div className={`hero-sub${showSub?' hs-visible':''}`}>
        <div className="hero-sub-card">
          <p className="hs-role">Software Engineer</p>
          <p className="hs-tag">"I only design what's necessary, not what's flashy."</p>
          <div className="hs-cta">
            <button className="btn-primary"
              onClick={()=>{ if(phaseRef.current==='REVEALED') targetRef.current=DIVE_START+0.05; }}>
              Explore Work
            </button>
            <button className="btn-secondary">Contact</button>
          </div>
        </div>
        <div className="hs-scroll-dive">
          <div className="hs-line" /><span>scroll to dive in</span>
        </div>
      </div>

      {phase==='SPACE' && (
        <div className="scroll-hint visible">
          <div className="sh-line" /><span className="sh-text">scroll to enter</span>
        </div>
      )}
      {(phase==='APPROACH'||phase==='HORIZON') && (
        <div className="void-label">
          {progress<0.42?'APPROACHING SINGULARITY':progress<0.65?'EVENT HORIZON':'CROSSING THRESHOLD'}
        </div>
      )}
    </div>
  );
}
