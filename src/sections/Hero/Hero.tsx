import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { SuperPETComputer } from './SuperPETComputer';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ['A Creative', 'Development', 'Studio, Plugged', 'into the Future'];

function HeroLights() {
  return (
    <>
      <ambientLight intensity={0.06} />
      {/* Key — warm top-right */}
      <spotLight
        position={[4, 5, 3]}
        angle={0.45}
        penumbra={0.9}
        intensity={2.5}
        color="#ffcc88"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill — cool blue left */}
      <pointLight position={[-5, 1, 2]} color="#4455ff" intensity={0.9} distance={12} decay={2} />
      {/* Rim — back */}
      <pointLight position={[0, 3, -4]} color="#8899ff" intensity={0.5} distance={8} decay={2} />
    </>
  );
}

function FogVolume() {
  return (
    <mesh position={[0, -2, 1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#200830" transparent opacity={0.0} />
    </mesh>
  );
}

function ComputerFallback() {
  // Simple boxy placeholder while model loads
  return (
    <group position={[0.8, -0.3, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2, 0.2, 1.4]} />
        <meshStandardMaterial color="#c8c0a8" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.9, 0.1]} castShadow>
        <boxGeometry args={[1.8, 1.4, 0.7]} />
        <meshStandardMaterial color="#c8c0a8" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.9, 0.46]}>
        <boxGeometry args={[1.3, 1.0, 0.02]} />
        <meshStandardMaterial color="#000" emissive="#00ff44" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = textRef.current?.querySelectorAll('.hero__line');
      if (lines) {
        gsap.fromTo(lines,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
        );
      }
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.9 }
        );
      }

      // Parallax on scroll
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -120,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Canvas parallax
      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      {/* 3D Canvas */}
      <div className="hero__canvas" ref={canvasRef} aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0.4, 5], fov: 42 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          shadows
          dpr={[1, 1.5]}
        >
          <HeroLights />
          <FogVolume />
          <fog attach="fog" args={['#110820', 4, 20]} />
          <Suspense fallback={<ComputerFallback />}>
            <SuperPETComputer />
          </Suspense>
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Atmospheric overlays */}
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__fog-bottom" aria-hidden="true" />
      <div className="hero__fog-left"   aria-hidden="true" />

      {/* Typography */}
      <div className="hero__text" ref={textRef}>
        <h1 className="hero__headline">
          {HEADLINE.map((line, i) => (
            <span key={i} className="hero__line">{line}</span>
          ))}
        </h1>

        <p className="hero__sub" ref={ctaRef}>
          Scroll to Inspect Our Closed Deals
          <span className="hero__scroll-icons" aria-hidden="true">
            <ScrollArrow delay={0} />
            <ScrollArrow delay={0.3} />
            <ScrollArrow delay={0.6} />
          </span>
        </p>
      </div>

      {/* Bottom scroll hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

function ScrollArrow({ delay }: { delay: number }) {
  return (
    <svg
      className="hero__arrow"
      style={{ animationDelay: `${delay}s` }}
      viewBox="0 0 16 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 2L8 18M8 18L3 13M8 18L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
