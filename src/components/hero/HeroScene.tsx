'use client';

import BlackHoleLensing from './BlackHoleLensing';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import BlackHole from './BlackHoleModel';
import ParticleField from './ParticleField';
import MHInitials from './MHInitials';
import CameraController from './CameraController';
import { useMouse } from '@/hooks/useMouse';

type ScenePhase =
  | 'IDLE'
  | 'APPROACH'
  | 'HORIZON'
  | 'INSIDE'
  | 'MH_READY'
  | 'REVEALED'
  | 'RELEASED';

export default function HeroScene() {
  const scroll = useRef(0);
  const targetScroll = useRef(0);
  const velocity = useRef(0);

  const mouse = useMouse();

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<ScenePhase>('IDLE');

  // ─────────────────────────────
  // 🎯 PHASE SYSTEM
  // ─────────────────────────────
  useEffect(() => {
    if (progress > 0.02 && phase === 'IDLE') setPhase('APPROACH');
    if (progress > 0.55 && phase === 'APPROACH') setPhase('HORIZON');
    if (progress > 0.7 && phase === 'HORIZON') setPhase('INSIDE');
    if (progress > 0.82 && phase === 'INSIDE') setPhase('MH_READY');
  }, [progress, phase]);

  const showMH = phase === 'MH_READY' || phase === 'REVEALED' || phase === 'RELEASED';
  const revealed = phase === 'REVEALED' || phase === 'RELEASED';
  const released = phase === 'RELEASED';

  // ─────────────────────────────
  // 🌀 SCROLL ENGINE
  // ─────────────────────────────
  useEffect(() => {
    if (released) return;

    const SPEED = 0.0012;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      targetScroll.current += e.deltaY * SPEED;
      targetScroll.current = THREE.MathUtils.clamp(targetScroll.current, 0, 1);

      // lock before reveal
      if (phase !== 'REVEALED') {
        targetScroll.current = Math.min(targetScroll.current, 0.95);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [phase, released]);

  useEffect(() => {
    let raf: number;

    const update = () => {
      const diff = targetScroll.current - scroll.current;

      velocity.current = diff * 60;
      scroll.current += diff * 0.08;

      setProgress(scroll.current);
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─────────────────────────────
  // 🌌 GLOBAL GRAVITY SYSTEM (KEY)
  // ─────────────────────────────
  const gravity = useMemo(() => {
    return Math.min(
      1,
      progress * 1.3 + Math.abs(velocity.current) * 0.7
    );
  }, [progress]);

  const gravityRef = useRef(0);
  gravityRef.current = gravity;

  // ─────────────────────────────
  // 🎯 ACTIONS
  // ─────────────────────────────
  const handleMHClick = useCallback(() => {
    if (phase === 'MH_READY') setPhase('REVEALED');
  }, [phase]);

  // release scroll after reveal
  useEffect(() => {
    if (!revealed || released) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        setPhase('RELEASED');

        setTimeout(() => {
          document.body.style.overflow = 'auto';
        }, 1200);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [revealed, released]);

  // ─────────────────────────────
  // 🎬 CINEMATIC FX (NOW SYNCED)
  // ─────────────────────────────
  const bloom = 0.8 + gravity * 2.0;
  const chromatic = 0.0005 + gravity * 0.015;

  const textVisible = revealed;

  // ─────────────────────────────
  // 🎬 RENDER
  // ─────────────────────────────
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 22], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <ambientLight intensity={0.02} />

        {/* CORE SYSTEM */}
        <CameraController scrollProgress={scroll} />

        <ParticleField
          mouseRef={mouse}
          scrollProgress={scroll}
          scrollVelocity={velocity}
        />

        <BlackHole />

        {/* 🔥 LENSING (NOW CONNECTED) */}
        <BlackHoleLensing strengthRef={gravityRef} />

        {/* MH */}
        {showMH && (
          <MHInitials
            visible
            revealed={revealed}
            onClick={handleMHClick}
            mouseRef={mouse}
          />
        )}

        {/* POST */}
        <EffectComposer>
          <Bloom
            intensity={bloom}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.2}
          />

          {/* @ts-ignore */}
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(chromatic, chromatic)}
          />

          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      </Canvas>

      {/* UI */}
      <div className={`hero-text-overlay ${textVisible ? 'visible' : ''}`}>
        <h1 className="hero-name">
          Mohammed<br />Hassoun
        </h1>

        <p className="hero-role">Software Engineer</p>

        <p className="hero-tagline">
          "I only design what's necessary,<br />not what's flashy."
        </p>

        <div className="hero-cta">
          <button className="cta-btn cta-btn-primary">Explore Work</button>
          <button className="cta-btn cta-btn-secondary">Contact</button>
        </div>
      </div>

      {/* STATES */}
      {phase === 'IDLE' && (
        <div className="scroll-hint">
          <div className="sh-line" />
          <span>scroll to enter</span>
        </div>
      )}

      {phase === 'MH_READY' && (
        <div className="click-prompt">— click to reveal —</div>
      )}

      {phase === 'APPROACH' && (
        <div className="void-label">
          {progress < 0.55
            ? 'APPROACHING SINGULARITY'
            : progress < 0.7
            ? 'EVENT HORIZON'
            : 'SPAGHETTIFICATION'}
        </div>
      )}

      {released && <div style={{ height: '100vh', background: '#000' }} />}
    </div>
  );
}