'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';import { Environment } from '@react-three/drei';
import * as THREE from 'three';

import BlackHole from './BlackHoleModel';
import StarField from './StarField';
import MHInitials from './MHInitials';
import NameReveal from './NameReveal';
import CameraController from './CameraController';
import { useMouse } from '@/hooks/useMouse';

export default function HeroScene() {
  const scroll = useRef(0);
  const velocity = useRef(0);
  const mouse = useMouse();

  const [progress, setProgress] = useState(0);
  const [showMH, setShowMH] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [diveReady, setDiveReady] = useState(false);
  const [released, setReleased] = useState(false);

  // ─────────────────────────────────────────────
  // SCROLL ENGINE (stable + cinematic)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (released || diveReady) return;

    const SPEED = 0.0012;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const prev = scroll.current;
      let next = prev + e.deltaY * SPEED;

      next = Math.max(0, Math.min(1, next));
      if (!revealed) next = Math.min(next, 0.97);

      velocity.current = Math.abs(next - prev) * 60;
      scroll.current = next;

      setProgress(next);

      if (next > 0.78 && !showMH) setShowMH(true);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [revealed, released, diveReady, showMH]);

  // ─────────────────────────────────────────────
  // DIVE TRIGGER
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!diveReady || released) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();

        setReleased(true);

        setTimeout(() => {
          document.documentElement.style.overflow = 'auto';
          document.body.style.overflow = 'auto';
        }, 1800);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [diveReady, released]);

  const handleClick = useCallback(() => {
    if (!revealed) setRevealed(true);
  }, [revealed]);

  // ─────────────────────────────────────────────
  // CINEMATIC VALUES (balanced)
  // ─────────────────────────────────────────────
  const isInside = progress > 0.72;

  const bloom = isInside
    ? 2.4
    : 1.1 + progress * 1.3;

  const chromatic = isInside
    ? 0.004
    : 0.0007;

  const exposure = isInside
    ? 1.25
    : 1.1;

  // ─────────────────────────────────────────────
  // UI LABEL
  // ─────────────────────────────────────────────
  const label =
    revealed ? '' :
    progress < 0.1 ? 'MH / PORTFOLIO / 2025' :
    progress < 0.6 ? 'APPROACHING SINGULARITY' :
    progress < 0.72 ? 'EVENT HORIZON' :
    'BEYOND THE HORIZON';

  return (
    <>
      {/* ───────────────── FULLSCREEN WRAPPER (FIXES 20vh BUG) ───────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#000010',
          zIndex: 10
        }}
      >
        <Canvas
          camera={{ position: [0, 1.2, 22], fov: 60 }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: exposure,
          }}
        >
          {/* ───────── LIGHTING (GLB SAFE) ───────── */}
          <ambientLight intensity={0.08} />
          <pointLight position={[0, 0, 0]} intensity={2} />

          {/* REAL ENVIRONMENT = HUGE UPGRADE */}
          <Environment preset="city" />

          <fog attach="fog" args={['#000010', 30, 65]} />

          <CameraController scrollProgress={scroll} />

          <StarField
            mouseRef={mouse}
            scrollProgress={scroll}
            scrollVelocity={velocity}
          />

          <BlackHole />

          {showMH && (
            <MHInitials
              visible
              revealed={revealed}
              onClick={handleClick}
              mouseRef={mouse}
            />
          )}

          {/* ───────── POST FX (FIXED) ───────── */}
          <EffectComposer>
            <Bloom
              intensity={bloom}
              luminanceThreshold={0.05}
              luminanceSmoothing={0.9}
              mipmapBlur
            />

              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[chromatic, chromatic]}
              />

            <Vignette
              eskil={false}
              offset={0.18}
              darkness={0.9}
            />
          </EffectComposer>
        </Canvas>

        {/* UI */}
        {label && (
          <div className="void-label">
            {label}
          </div>
        )}
      </div>

      {/* NAME REVEAL */}
      <NameReveal
        visible={revealed}
        onDiveReady={() => setDiveReady(true)}
      />

      {/* RELEASED SCROLL SPACE */}
      {released && (
        <div style={{ height: '100vh', background: '#000010' }} />
      )}
    </>
  );
}