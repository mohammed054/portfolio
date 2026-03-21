'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

import BlackHole        from './BlackHole';
import StarField        from './StarField';
import MHInitials       from './MHInitials';
import NameReveal       from './NameReveal';
import CameraController from './CameraController';
import { useMouse }     from '@/hooks/useMouse';

// ─── Custom cursor ──────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cur = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  useEffect(() => {
    let raf: number;
    const mv = (e: MouseEvent) => { cur.current = { x: e.clientX, y: e.clientY }; };
    const tick = () => {
      lag.current.x += (cur.current.x - lag.current.x) * 0.12;
      lag.current.y += (cur.current.y - lag.current.y) * 0.12;
      if (dot.current) dot.current.style.transform = `translate(calc(-50% + ${cur.current.x}px), calc(-50% + ${cur.current.y}px))`;
      if (ring.current) ring.current.style.transform = `translate(calc(-50% + ${lag.current.x}px), calc(-50% + ${lag.current.y}px))`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', mv, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);
  return (<><div ref={dot} className="c-dot" /><div ref={ring} className="c-ring" /></>);
}

function ScrollHint({ show }: { show: boolean }) {
  return (
    <div className={`scroll-hint ${show ? 'visible' : ''}`}>
      <div className="sh-line" />
      <span className="sh-text">scroll to travel</span>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ height: `${progress * 100}%` }} />
    </div>
  );
}

function ClickPrompt({ show }: { show: boolean }) {
  return (
    <div className={`click-prompt ${show ? 'visible' : ''}`}>
      <span>click MH to reveal</span>
    </div>
  );
}

function TransitDark({ progress }: { progress: number }) {
  const t = progress;
  let raw = 0;
  if (t > 0.61 && t < 0.76) raw = 1 - Math.abs((t - 0.685) / 0.075);
  const op = Math.max(0, Math.min(1, raw)) * 0.82;
  if (op < 0.01) return null;
  return <div className="transit-dark" style={{ opacity: op }} />;
}

function InterstellarGlow({ progress }: { progress: number }) {
  let op = 0;
  if (progress > 0.70) {
    const enter = Math.min((progress - 0.70) / 0.07, 1.0);
    op = enter * 0.55;
  }
  if (op < 0.01) return null;
  return <div className="interstellar-glow" style={{ opacity: op }} />;
}

function VoidLabel({ progress, revealed }: { progress: number; revealed: boolean }) {
  let label = '';
  if (revealed)              label = '';
  else if (progress < 0.12)  label = 'MH / PORTFOLIO / 2025';
  else if (progress < 0.60)  label = 'APPROACHING SINGULARITY';
  else if (progress < 0.72)  label = 'EVENT HORIZON';
  else if (progress < 0.94)  label = 'BEYOND THE HORIZON';
  else                        label = 'IDENTITY: ENCRYPTED';
  return label ? <div className="void-label">{label}</div> : null;
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function HeroScene() {
  const scrollProgress = useRef(0);
  const scrollVelocity = useRef(0);
  const mouseRef       = useMouse();

  const [uiProgress,   setUiProgress]   = useState(0);
  const [showInitials, setShowInitials] = useState(false);
  const [revealed,     setRevealed]     = useState(false);
  const [diveReady,    setDiveReady]    = useState(false);  // NameReveal done → scroll to dive
  const [diving,       setDiving]       = useState(false);
  const [released,     setReleased]     = useState(false);

  const velDecay = useRef<ReturnType<typeof setInterval>>();

  // ── Approach scroll capture ────────────────────────────────────────────────
  useEffect(() => {
    if (released || diveReady) return;  // stop capturing when dive is ready

    const SPEED = 0.0012;
    let touchY = 0;

    const advance = (delta: number) => {
      if (released || diveReady) return;
      const prev = scrollProgress.current;
      let next = Math.max(0, Math.min(1, prev + delta));
      if (!revealed && next > 0.97) next = 0.97;
      scrollVelocity.current = Math.abs(next - prev) / (1 / 60);
      scrollProgress.current = next;
      setUiProgress(next);
      if (next >= 0.78 && !showInitials) setShowInitials(true);
    };

    const onWheel      = (e: WheelEvent) => { e.preventDefault(); advance(e.deltaY * SPEED); };
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      advance(dy * SPEED * 1.5);
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    velDecay.current = setInterval(() => { scrollVelocity.current *= 0.85; }, 50);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      clearInterval(velDecay.current);
    };
  }, [released, revealed, diveReady, showInitials]);

  // ── Dive-on-scroll — activated after NameReveal finishes ──────────────────
  useEffect(() => {
    if (!diveReady || diving || released) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        setDiving(true);
        // Unlock page scroll after dive animation completes
        setTimeout(() => {
          setReleased(true);
          document.documentElement.style.overflow = 'auto';
          document.documentElement.style.height = 'auto';
          document.body.style.overflow = 'auto';
        }, 2100);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [diveReady, diving, released]);

  const handleMHClick = useCallback(() => {
    if (!revealed) setRevealed(true);
  }, [revealed]);

  const handleDiveReady = useCallback(() => {
    setDiveReady(true);
  }, []);

  // ── Post-processing ───────────────────────────────────────────────────────
  const isTransit = uiProgress > 0.61 && uiProgress < 0.76;
  const isInside  = uiProgress > 0.73;

  let bloomIntensity: number;
  if (isTransit) {
    const dip = Math.max(0, 1 - Math.abs((uiProgress - 0.685) / 0.075));
    bloomIntensity = 0.9 + (1 - dip) * 1.6;
  } else if (isInside) {
    bloomIntensity = 2.0 + Math.min((uiProgress - 0.73) / 0.24, 1) * 2.5;
  } else {
    bloomIntensity = 1.4 + uiProgress * 2.0;
  }

  const chromAb = isInside
    ? 0.005 + Math.sin(uiProgress * 15) * 0.003
    : uiProgress > 0.35 && uiProgress < 0.62
      ? 0.001 + (uiProgress - 0.35) / 0.27 * 0.005
      : 0.0006;

  return (
    <>
      <div
        className={`hero-fixed ${diving ? 'dive-out' : ''}`}
        style={{ position:'fixed', inset:0, width:'100vw', height:'100vh', overflow:'hidden', zIndex: released ? 1 : 10 }}
      >
        <Canvas
          key="hero-canvas"
          camera={{ position: [0, 1.2, 22], fov: 60 }}
          gl={{
            antialias: true, alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          style={{ width:'100%', height:'100%', background:'#000010', display:'block' }}
          frameloop="always"
          onCreated={({ gl }) => { gl.setSize(window.innerWidth, window.innerHeight); }}
        >
          <fog attach="fog" args={['#000010', 30, 65]} />
          <ambientLight intensity={0.018} />

          <CameraController scrollProgress={scrollProgress} />

          <StarField
            mouseRef={mouseRef}
            scrollProgress={scrollProgress}
            scrollVelocity={scrollVelocity}
            count={800}
          />

          {/* ParticleField removed — the corona inside BlackHole is sufficient */}

          <BlackHole
            scrollProgress={scrollProgress}
            mouseRef={mouseRef}
            onClick={handleMHClick}
          />

          {showInitials && (
            <MHInitials
              visible={showInitials}
              revealed={revealed}
              onClick={handleMHClick}
              mouseRef={mouseRef}
            />
          )}

          <EffectComposer>
            <Bloom
              intensity={bloomIntensity}
              luminanceThreshold={0.05}
              luminanceSmoothing={0.88}
              kernelSize={KernelSize.LARGE}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[chromAb, chromAb] as any}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.18} darkness={0.94} />
          </EffectComposer>
        </Canvas>

        <TransitDark      progress={uiProgress} />
        <InterstellarGlow progress={uiProgress} />
        <ScrollHint       show={uiProgress < 0.04} />
        <ProgressBar      progress={uiProgress} />
        <ClickPrompt      show={showInitials && !revealed} />
        <VoidLabel        progress={uiProgress} revealed={revealed} />
        <Cursor />
      </div>

      <NameReveal visible={revealed} onDiveReady={handleDiveReady} />

      {released && <div style={{ height:'100vh', background:'#000010' }} />}
    </>
  );
}