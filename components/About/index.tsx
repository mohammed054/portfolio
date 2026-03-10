"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#080B14",
  surface: "#0E1220",
  border: "#1A2035",
  accent1: "#4F8EF7",
  accent2: "#8B5CF6",
  textPrimary: "#F0F4FF",
  textSecondary: "#7A89A8",
  textMuted: "#3D4A66",
} as const;

// ─── Timeline Data ────────────────────────────────────────────────────────────
interface Milestone {
  id: string;
  year: string;
  title: string;
  desc: string;
  tags: string[];
  color: string;
  position: [number, number, number];
}

const MILESTONES: Milestone[] = [
  {
    id: "edu",
    year: "2023",
    title: "Education Begins",
    desc: "High school in UAE — deep focus on CS & AI. First lines of real code, first obsession with how things are built.",
    tags: ["CS", "Algorithms", "AI Fundamentals"],
    color: T.accent1,
    position: [-3, 2.2, 0],
  },
  {
    id: "skills",
    year: "2024",
    title: "Stack Mastery",
    desc: "Full modern stack acquired — React, Express, MongoDB. Then Three.js, GSAP, and Framer Motion pulled me into the creative web.",
    tags: ["React", "Express", "MongoDB", "Three.js", "GSAP"],
    color: T.accent2,
    position: [-1, 0.4, 0.3],
  },
  {
    id: "project",
    year: "2025",
    title: "Edu Bridge Platform",
    desc: "Built a full-stack school operations platform — React + Express + MongoDB. 3D dashboards, real-time analytics, AI-driven insights. Real users. Production code.",
    tags: ["React", "Express", "MongoDB", "Three.js", "GSAP", "AI"],
    color: T.accent1,
    position: [1, -1.2, 0.2],
  },
  {
    id: "future",
    year: "2025+",
    title: "What's Next",
    desc: "Open source, WebGL experiments, AI tooling. Pushing what the browser can feel like — one project at a time.",
    tags: ["Open Source", "WebGL", "AI", "Next.js"],
    color: T.accent2,
    position: [3, -2.8, 0],
  },
];

// ─── Utility Hooks ────────────────────────────────────────────────────────────
function useScrollProgress(ref: React.RefObject<HTMLDivElement>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const p = Math.max(0, Math.min(1, -top / (height - winH)));
      setProgress(p);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ref]);
  return progress;
}

function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

// ─── 3D: Glowing Tube ────────────────────────────────────────────────────────
function TubePath({ progress }: { progress: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  const curve = new THREE.CatmullRomCurve3(
    MILESTONES.map((m) => new THREE.Vector3(...m.position)),
    false,
    "catmullrom",
    0.5
  );

  const clampedP = Math.max(0.02, progress);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i++) {
    pts.push(curve.getPoint((i / 80) * clampedP));
  }
  const partial = new THREE.CatmullRomCurve3(pts);
  const geom = new THREE.TubeGeometry(partial, 80, 0.022, 8, false);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
    }
  });

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        ref={matRef}
        color={T.accent1}
        emissive={T.accent1}
        emissiveIntensity={0.7}
        transparent
        opacity={0.9}
        roughness={0.1}
        metalness={0.7}
      />
    </mesh>
  );
}

// ─── 3D: Icosahedron Node ─────────────────────────────────────────────────────
function Node({
  milestone,
  active,
  onClick,
  appeared,
}: {
  milestone: Milestone;
  active: boolean;
  onClick: () => void;
  appeared: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const scaleCurrent = useRef(0);
  const scaleTarget = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !wireRef.current) return;
    const t = state.clock.elapsedTime;

    scaleTarget.current = appeared ? (hovered ? 1.4 : active ? 1.15 : 1.0) : 0;
    scaleCurrent.current += (scaleTarget.current - scaleCurrent.current) * 0.1;
    const s = scaleCurrent.current;

    meshRef.current.scale.setScalar(s);
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.rotation.x = t * 0.15;

    wireRef.current.scale.setScalar(s * 1.05);
    wireRef.current.rotation.y = -t * 0.25;

    const gs = s * (1 + Math.sin(t * 3) * 0.07);
    glowRef.current.scale.setScalar(gs * 1.7);
    (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
      hovered ? 0.28 : active ? 0.16 : 0.07;
  });

  return (
    <group
      position={milestone.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Soft glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={milestone.color} transparent opacity={0.1} roughness={1} />
      </mesh>

      {/* Solid icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.17, 0]} />
        <meshStandardMaterial
          color={hovered || active ? milestone.color : "#1A2035"}
          emissive={milestone.color}
          emissiveIntensity={hovered ? 0.95 : active ? 0.55 : 0.18}
          metalness={0.85}
          roughness={0.12}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={milestone.color}
          transparent
          opacity={hovered ? 0.55 : 0.18}
          wireframe
        />
      </mesh>
    </group>
  );
}

// ─── 3D: Camera Rig ───────────────────────────────────────────────────────────
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(5, 4, 8));
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const p = ease(progress);
    pos.current.set(
      THREE.MathUtils.lerp(5, -5, p),
      THREE.MathUtils.lerp(4, -4, p),
      THREE.MathUtils.lerp(8, 6.5, p)
    );
    look.current.set(0, THREE.MathUtils.lerp(1.5, -1.5, p), 0);
    camera.position.lerp(pos.current, 0.055);
    camera.lookAt(look.current);
  });

  return null;
}

// ─── 3D: Particles ───────────────────────────────────────────────────────────
function Particles({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.018;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color={T.accent1} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
function Scene({
  scrollProgress,
  activeNode,
  onNodeClick,
  particleCount,
}: {
  scrollProgress: number;
  activeNode: string | null;
  onNodeClick: (id: string) => void;
  particleCount: number;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 5, 6]} intensity={3.5} color={T.accent1} />
      <pointLight position={[-4, -4, 4]} intensity={2} color={T.accent2} />
      <pointLight position={[0, 0, 8]} intensity={0.8} color="#ffffff" />
      {particleCount > 0 && <Particles count={particleCount} />}
      <TubePath progress={scrollProgress} />
      {MILESTONES.map((m, i) => (
        <Node
          key={m.id}
          milestone={m}
          active={activeNode === m.id}
          onClick={() => onNodeClick(m.id)}
          appeared={scrollProgress >= (i / MILESTONES.length) - 0.06}
        />
      ))}
      <CameraRig progress={scrollProgress} />
    </>
  );
}

// ─── Frosted Glass Panel ──────────────────────────────────────────────────────
function Panel({ milestone, onClose }: { milestone: Milestone; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={milestone.title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(8,11,20,0.65)",
        backdropFilter: "blur(10px)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 300ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(14,18,32,0.88)",
          backdropFilter: "blur(28px) saturate(180%)",
          border: `1px solid ${milestone.color}44`,
          borderRadius: "20px",
          padding: "48px",
          maxWidth: "520px",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px ${milestone.color}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(36px) scale(0.95)",
          transition: "transform 450ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Corner glow */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "220px", height: "220px", background: `radial-gradient(circle at top right, ${milestone.color}22, transparent 65%)`, pointerEvents: "none" }} />

        {/* Year pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${milestone.color}18`, border: `1px solid ${milestone.color}35`, borderRadius: "6px", padding: "5px 14px", marginBottom: "22px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: milestone.color, boxShadow: `0 0 8px ${milestone.color}`, display: "inline-block" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: milestone.color, letterSpacing: "0.1em" }}>{milestone.year}</span>
        </div>

        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "30px", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "16px", background: `linear-gradient(135deg, ${T.textPrimary}, ${milestone.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {milestone.title}
        </h3>

        <p style={{ color: T.textSecondary, fontSize: "15px", lineHeight: 1.75, marginBottom: "28px" }}>
          {milestone.desc}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
          {milestone.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", padding: "5px 12px", borderRadius: "4px", background: `${milestone.color}15`, border: `1px solid ${milestone.color}30`, color: milestone.color, letterSpacing: "0.04em" }}>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          autoFocus
          style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: "8px", color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", padding: "10px 22px", cursor: "pointer", letterSpacing: "0.06em", transition: "all 150ms ease", outline: "none" }}
          onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = `2px solid ${T.accent1}`; (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px"; }}
          onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = "none"; }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.accent1; (e.currentTarget as HTMLButtonElement).style.color = T.accent1; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.color = T.textMuted; }}
        >
          Close ✕
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────
function MobileCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null!);
  const visible = useInView(ref as React.RefObject<HTMLElement>, 0.15);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${index * 140}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${index * 140}ms`,
        background: "rgba(14,18,32,0.8)",
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${milestone.color}`,
        borderRadius: "12px",
        padding: "28px 24px",
        marginBottom: "14px",
      }}
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: milestone.color, letterSpacing: "0.1em", marginBottom: "8px" }}>{milestone.year}</p>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "20px", color: T.textPrimary, marginBottom: "10px", letterSpacing: "-0.01em" }}>{milestone.title}</h3>
      <p style={{ color: T.textSecondary, fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>{milestone.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {milestone.tags.map((t) => (
          <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", padding: "3px 10px", borderRadius: "4px", background: `${milestone.color}15`, border: `1px solid ${milestone.color}30`, color: milestone.color, letterSpacing: "0.04em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: T.border, zIndex: 10 }}>
      <div style={{ width: "100%", height: `${progress * 100}%`, background: `linear-gradient(to bottom, ${T.accent1}, ${T.accent2})`, boxShadow: `0 0 10px ${T.accent1}88`, transition: "height 80ms linear" }} />
      <div style={{ position: "absolute", left: "50%", top: `${progress * 100}%`, transform: "translate(-50%,-50%)", width: "8px", height: "8px", borderRadius: "50%", background: T.accent1, boxShadow: `0 0 14px ${T.accent1}`, transition: "top 80ms linear" }} />
    </div>
  );
}

// ─── Info Overlay (bottom-left) ───────────────────────────────────────────────
function InfoOverlay({ milestone, onExpand }: { milestone: Milestone; onExpand: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, [milestone.id]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "48px",
        left: "56px",
        zIndex: 10,
        maxWidth: "340px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 350ms cubic-bezier(0.22,1,0.36,1), transform 350ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        style={{
          background: "rgba(14,18,32,0.78)",
          backdropFilter: "blur(18px)",
          border: `1px solid ${milestone.color}33`,
          borderRadius: "14px",
          padding: "24px 28px",
          boxShadow: `0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: milestone.color, boxShadow: `0 0 8px ${milestone.color}`, display: "inline-block" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: milestone.color, letterSpacing: "0.08em" }}>{milestone.year}</span>
        </div>
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: T.textPrimary, marginBottom: "8px", letterSpacing: "-0.01em" }}>{milestone.title}</h4>
        <p style={{ color: T.textSecondary, fontSize: "13px", lineHeight: 1.65, marginBottom: "14px" }}>{milestone.desc.split("—")[0].trim()}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
          {milestone.tags.slice(0, 4).map((t) => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: `${milestone.color}15`, border: `1px solid ${milestone.color}28`, color: milestone.color, letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
        <button
          onClick={onExpand}
          style={{ background: `${milestone.color}18`, border: `1px solid ${milestone.color}44`, borderRadius: "6px", color: milestone.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", padding: "7px 14px", cursor: "pointer", letterSpacing: "0.06em", transition: "background 150ms ease", outline: "none" }}
          onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = `2px solid ${T.accent1}`; (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px"; }}
          onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = "none"; }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${milestone.color}30`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${milestone.color}18`; }}
        >
          Read more →
        </button>
      </div>
    </div>
  );
}

// ─── Year Nav Pills (bottom center) ──────────────────────────────────────────
function YearNav({
  activeId,
  onSelect,
  scrollProgress,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  scrollProgress: number;
}) {
  return (
    <div style={{ position: "absolute", bottom: "48px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px", zIndex: 10 }}>
      {MILESTONES.map((m, i) => {
        const appeared = scrollProgress >= (i / MILESTONES.length) - 0.06;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            aria-label={`Jump to ${m.title}`}
            style={{
              background: activeId === m.id ? `${m.color}25` : "rgba(14,18,32,0.65)",
              border: `1px solid ${activeId === m.id ? m.color + "66" : T.border}`,
              borderRadius: "8px",
              padding: "8px 16px",
              color: activeId === m.id ? m.color : T.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              cursor: "pointer",
              letterSpacing: "0.06em",
              backdropFilter: "blur(12px)",
              transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
              opacity: appeared ? 1 : 0,
              transform: appeared ? "translateY(0)" : "translateY(10px)",
              outline: "none",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = `2px solid ${T.accent1}`; (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px"; }}
            onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = "none"; }}
          >
            {m.year}
          </button>
        );
      })}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null!);
  const visible = useInView(ref as React.RefObject<HTMLElement>, 0.05);
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "64px",
        left: "56px",
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: T.accent1, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "16px", height: "1px", background: T.accent1, display: "inline-block" }} />
        About Me
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 5vw, 76px)", lineHeight: 1.0, letterSpacing: "-0.03em", color: T.textPrimary }}>
        The
        <br />
        <span style={{ background: `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Timeline
        </span>
      </h2>
      <p style={{ color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.05em", marginTop: "10px" }}>
        Click a node · scroll to advance
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const [activeNode, setActiveNode] = useState<string | null>(MILESTONES[0].id);
  const [openPanel, setOpenPanel] = useState<Milestone | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress(sectionRef);

  // Responsive
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-activate node by scroll
  useEffect(() => {
    const idx = Math.min(MILESTONES.length - 1, Math.floor(scrollProgress * MILESTONES.length));
    setActiveNode(MILESTONES[idx]?.id ?? null);
  }, [scrollProgress]);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenPanel(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleNodeClick = useCallback((id: string) => {
    setActiveNode(id);
    const m = MILESTONES.find((m) => m.id === id);
    if (m) setOpenPanel(m);
  }, []);

  const activeMilestone = MILESTONES.find((m) => m.id === activeNode) ?? null;
  const particleCount = isTablet ? 140 : 280;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* ── Mobile ───────────────────────────────────────────────────────────── */}
      {isMobile && (
        <section style={{ background: T.bg, padding: "96px 24px 64px", minHeight: "100vh" }}>
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: T.accent1, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "14px", height: "1px", background: T.accent1, display: "inline-block" }} />
              About Me
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "44px", lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: "12px", color: T.textPrimary }}>
              The{" "}
              <span style={{ background: `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Timeline
              </span>
            </h2>
            <p style={{ color: T.textSecondary, fontSize: "15px", lineHeight: 1.7 }}>A developer's story — from curiosity to craft.</p>
          </div>
          {MILESTONES.map((m, i) => <MobileCard key={m.id} milestone={m} index={i} />)}
        </section>
      )}

      {/* ── Desktop / Tablet ──────────────────────────────────────────────────── */}
      {!isMobile && (
        <div ref={sectionRef} style={{ height: "400vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: T.bg }}>

            {/* Left progress bar */}
            <ScrollProgressBar progress={scrollProgress} />

            {/* Header */}
            <SectionHeader />

            {/* 3D Canvas */}
            <Canvas
              frameloop={reducedMotion ? "never" : "always"}
              camera={{ position: [5, 4, 8], fov: 45 }}
              gl={{ antialias: !isTablet, alpha: true }}
              style={{ position: "absolute", inset: 0 }}
            >
              <Suspense fallback={null}>
                <Scene
                  scrollProgress={scrollProgress}
                  activeNode={activeNode}
                  onNodeClick={handleNodeClick}
                  particleCount={particleCount}
                />
              </Suspense>
            </Canvas>

            {/* Info overlay bottom-left */}
            {activeMilestone && (
              <InfoOverlay
                key={activeMilestone.id}
                milestone={activeMilestone}
                onExpand={() => setOpenPanel(activeMilestone)}
              />
            )}

            {/* Year nav bottom-center */}
            <YearNav activeId={activeNode} onSelect={handleNodeClick} scrollProgress={scrollProgress} />
          </div>
        </div>
      )}

      {/* Frosted panel modal */}
      {openPanel && <Panel milestone={openPanel} onClose={() => setOpenPanel(null)} />}
    </>
  );
}