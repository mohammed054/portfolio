'use client';
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
import InsideScene          from './InsideScene';

type Phase = 'SPACE'|'APPROACH'|'HORIZON'|'LOCKED'|'EXPANDING'|'REVEALED'|'DIVING'|'INSIDE';

function SetBlack() {
  const { scene } = useThree();
  useMemo(()=>{ scene.background = new THREE.Color(0,0,0); },[scene]);
  return null;
}

export default function HeroScene() {
  const scrollRef    = useRef(0);
  const targetRef    = useRef(0);
  const velRef       = useRef(0);
  const bodyScroll   = useRef(0);   // 0→1 through portfolio after dive
  const lensingRef   = useRef(0);
  const lightRayRef  = useRef(0);
  const insideMixRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState<Phase>('SPACE');
  const phaseRef = useRef<Phase>('SPACE');

  function setP(p: Phase) { phaseRef.current = p; setPhase(p); }

  // ── PHASE TRANSITIONS ─────────────────────────────────────────────────────
  useEffect(()=>{
    const p = progress;
    const ph = phaseRef.current;
    if(ph==='INSIDE'||ph==='DIVING') return;
    if(p>0.04 && ph==='SPACE')    setP('APPROACH');
    if(p<0.03 && ph==='APPROACH') setP('SPACE');
    if(p>0.50 && ph==='APPROACH') setP('HORIZON');
    if(p<0.44 && ph==='HORIZON')  setP('APPROACH');
    if(p>0.86 && ph==='HORIZON')  setP('LOCKED');
    if(p<0.79 && ph==='LOCKED')   setP('HORIZON');
  },[progress]);

  // ── WHEEL HIJACK ──────────────────────────────────────────────────────────
  useEffect(()=>{
    const SPEED = 0.0011;
    const onWheel = (e: WheelEvent) => {
      const ph = phaseRef.current;
      if(ph==='LOCKED'||ph==='EXPANDING') { e.preventDefault(); return; }
      if(ph==='REVEALED') {
        e.preventDefault();
        if(e.deltaY>0) {
          setP('DIVING');
          setTimeout(()=>{
            document.body.style.overflow='auto';
            document.body.style.overflowX='hidden';
            setP('INSIDE');
          }, 1450);
        }
        return;
      }
      if(ph==='DIVING'||ph==='INSIDE') return;
      e.preventDefault();
      targetRef.current = THREE.MathUtils.clamp(targetRef.current+e.deltaY*SPEED,0,0.97);
    };
    window.addEventListener('wheel', onWheel, {passive:false});
    return ()=>window.removeEventListener('wheel', onWheel);
  },[]);

  // ── SCROLL ANIMATION LOOP ─────────────────────────────────────────────────
  useEffect(()=>{
    let raf: number;
    const tick = ()=>{
      const diff = targetRef.current - scrollRef.current;
      velRef.current    = diff * 60;
      scrollRef.current += diff * 0.07;
      const s = scrollRef.current;
      // Lensing grows smoothly, capped
      lensingRef.current  += (THREE.MathUtils.smootherstep(s,0.10,0.62)*0.32 - lensingRef.current)*0.06;
      // Light rays appear from 20% onward
      lightRayRef.current += (THREE.MathUtils.smootherstep(s,0.18,0.72)*0.88 - lightRayRef.current)*0.05;
      // Inside mix (particle tunnel)
      insideMixRef.current += (THREE.MathUtils.smootherstep(s,0.70,0.92) - insideMixRef.current)*0.05;
      setProgress(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  },[]);

  // ── BODY SCROLL TRACKING (for inside camera drift) ────────────────────────
  useEffect(()=>{
    if(phase!=='INSIDE') return;
    const onScroll = ()=>{
      const max = document.body.scrollHeight - window.innerHeight;
      bodyScroll.current = max>0 ? window.scrollY/max : 0;
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=>window.removeEventListener('scroll', onScroll);
  },[phase]);

  // ── MH CLICK ──────────────────────────────────────────────────────────────
  const handleMHClick = useCallback(()=>{
    if(phaseRef.current!=='LOCKED') return;
    setP('EXPANDING');
    setTimeout(()=>setP('REVEALED'), 1650);
  },[]);

  // ── DERIVED ───────────────────────────────────────────────────────────────
  const insideMix  = THREE.MathUtils.smootherstep(progress,0.70,0.92);
  const outsideMix = 1 - insideMix;
  const starOp     = outsideMix*(1-THREE.MathUtils.smootherstep(progress,0.75,0.97)*0.5)+0.04;
  const bloom      = 0.36 + progress*0.58*outsideMix + (phase==='INSIDE'?0.22:0);

  const showMH    = phase==='LOCKED'||phase==='EXPANDING'||phase==='REVEALED';
  const expanding = phase==='EXPANDING'||phase==='REVEALED';
  const diving    = phase==='DIVING';
  const inside    = phase==='INSIDE';

  return (
    <div
      className={`hero-wrap${diving?' hero-diving':''}`}
      style={{
        position:'fixed', inset:0, zIndex:10, background:'#000',
        pointerEvents: inside ? 'none' : 'auto',
      }}
    >
      {/* ── CANVAS ─────────────────────────────────────────────────────── */}
      <Canvas
        camera={{position:[0,7.5,30], fov:57, near:0.05, far:650}}
        dpr={[1,2]}
        gl={{antialias:true, powerPreference:'high-performance', toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.0}}
      >
        <SetBlack/>

        {!inside && <CameraController scrollRef={scrollRef}/>}

        {!inside && (<>
          <Starfield opacity={starOp}/>
          <ParticleField scrollRef={scrollRef} velRef={velRef} insideMixRef={insideMixRef}/>
          <BlackHole/>
          <LightRays strengthRef={lightRayRef}/>
        </>)}

        <InsideScene visible={inside} bodyScroll={bodyScroll}/>

        <EffectComposer>
          {!inside && <GravitationalLensing strengthRef={lensingRef}/>}
          <Bloom intensity={bloom} luminanceThreshold={0.68} luminanceSmoothing={0.20}/>
          <Vignette eskil={false} offset={0.22} darkness={0.80}/>
        </EffectComposer>
      </Canvas>

      {/* ── MH REVEAL ──────────────────────────────────────────────────── */}
      {showMH && (
        <div
          className={`mh-container${phase==='LOCKED'?' mh-idle':''}${expanding?' mh-expanding':''}`}
          onClick={handleMHClick}
          style={{pointerEvents: phase==='LOCKED'?'auto':'none'}}
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
          {phase==='LOCKED' && <p className="mh-hint">— click to reveal —</p>}
        </div>
      )}

      {/* ── SUBTITLE ───────────────────────────────────────────────────── */}
      <div className={`hero-sub${phase==='REVEALED'?' hs-visible':''}`}>
        <p className="hs-role">Software Engineer</p>
        <p className="hs-tag">"I only design what's necessary, not what's flashy."</p>
        <div className="hs-cta">
          <button className="btn-primary"
            onClick={()=>{ if(phaseRef.current==='REVEALED'){ setP('DIVING'); setTimeout(()=>{ document.body.style.overflow='auto'; setP('INSIDE'); },1450); } }}>
            Explore Work
          </button>
          <button className="btn-secondary">Contact</button>
        </div>
        <div className="hs-dive-hint">
          <div className="hs-line"/>
          <span>scroll to dive in</span>
        </div>
      </div>

      {/* ── HUD ─────────────────────────────────────────────────────────── */}
      {phase==='SPACE' && (
        <div className="scroll-hint visible">
          <div className="sh-line"/><span className="sh-text">scroll to enter</span>
        </div>
      )}
      {(phase==='APPROACH'||phase==='HORIZON') && (
        <div className="void-label">
          {progress<0.50?'APPROACHING SINGULARITY':progress<0.70?'EVENT HORIZON':'CROSSING THRESHOLD'}
        </div>
      )}
    </div>
  );
}
