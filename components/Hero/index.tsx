import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ── Design Tokens ────────────────────────────────────────────────
const T = {
  bg: "#080B14",
  surface: "#0E1220",
  border: "#1A2035",
  accent1: "#4F8EF7",
  accent2: "#8B5CF6",
  accentGlow: "rgba(79,142,247,0.15)",
  textPrimary: "#F0F4FF",
  textSecondary: "#7A89A8",
  textMuted: "#3D4A66",
};

// ── Vertex Shader ────────────────────────────────────────────────
const VERT = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform vec2 uCursor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Drift
    pos.x += sin(uTime * 0.4 + aPhase) * 0.12;
    pos.y += cos(uTime * 0.3 + aPhase * 1.3) * 0.10;

    // Cursor repulsion
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec2 screenPos = mvPos.xy / mvPos.z;
    float dist = length(screenPos - uCursor * 2.0);
    float repel = smoothstep(0.8, 0.0, dist) * 0.6;
    pos.x += normalize(pos.xy - uCursor * 4.0).x * repel;
    pos.y += normalize(pos.xy - uCursor * 4.0).y * repel;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPos.z);
    vAlpha = 0.4 + 0.3 * sin(uTime * 0.6 + aPhase);
  }
`;

// ── Fragment Shader ───────────────────────────────────────────────
const FRAG = `
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ── Nebula BG Shader ──────────────────────────────────────────────
const NEBULA_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAG = `
  varying vec2 vUv;
  uniform float uTime;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1,0));
    float c = noise(i + vec2(0,1));
    float d = noise(i + vec2(1,1));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){v+=a*smoothNoise(p);p*=2.1;a*=0.5;}
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.06;
    float n = fbm(uv * 2.5 + vec2(t, t * 0.7));
    float n2 = fbm(uv * 1.8 - vec2(t * 0.5, t));

    vec3 deep   = vec3(0.031, 0.043, 0.078);   // #080B14
    vec3 nebula = vec3(0.310, 0.553, 0.969);   // #4F8EF7
    vec3 purple = vec3(0.545, 0.361, 0.965);   // #8B5CF6

    vec3 col = mix(deep, nebula, n * 0.18);
    col = mix(col, purple, n2 * 0.10);
    col += deep * (1.0 - n * 0.3);

    float vignette = 1.0 - smoothstep(0.3, 1.2, length(vUv - 0.5) * 1.6);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── Three.js Canvas Component ─────────────────────────────────────
function HeroCanvas({ cursorRef, scrollProgress }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x080B14, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    // ── Nebula background plane ───────────────────────────────────
    const nebulaGeo = new THREE.PlaneGeometry(20, 14);
    const nebulaMat = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERT,
      fragmentShader: NEBULA_FRAG,
      uniforms: { uTime: { value: 0 } },
      depthWrite: false,
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.z = -4;
    scene.add(nebulaMesh);

    // ── Particles ─────────────────────────────────────────────────
    const COUNT = 800;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      sizes[i]  = Math.random() * 2.5 + 0.8;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    partGeo.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));

    const partMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:   { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uColor:  { value: new THREE.Color(T.accent1) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // ── Line connections ──────────────────────────────────────────
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(COUNT * COUNT * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(T.accent1),
      transparent: true,
      opacity: 0.08,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // ── Extruded "MH" initials ────────────────────────────────────
    const makeInitials = () => {
      const group = new THREE.Group();
      const matMesh = new THREE.MeshStandardMaterial({
        color: new THREE.Color(T.accent1),
        metalness: 0.8,
        roughness: 0.15,
        emissive: new THREE.Color(T.accent2),
        emissiveIntensity: 0.12,
      });

      // Build "M" from boxes
      const addBox = (x, y, w, h, d = 0.35) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, matMesh);
        mesh.position.set(x, y, 0);
        group.add(mesh);
      };

      // M: left leg, right leg, two diagonal strokes (simplified as boxes)
      addBox(-1.05, 0, 0.22, 1.4);       // left leg
      addBox( 1.05, 0, 0.22, 1.4);       // right leg
      addBox(-0.60, 0.38, 0.22, 0.72, 0.35); // left diag
      addBox( 0.60, 0.38, 0.22, 0.72, 0.35); // right diag
      addBox( 0,    0.58, 0.22, 0.32);   // center peak

      // H
      addBox( 1.70, 0, 0.22, 1.4);       // left leg H
      addBox( 2.80, 0, 0.22, 1.4);       // right leg H
      addBox( 2.25, 0, 0.72, 0.22);      // crossbar

      group.position.set(-0.85, 0, 0.5);
      group.scale.setScalar(0.52);
      return group;
    };

    const initials = makeInitials();
    scene.add(initials);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(new THREE.Color(T.accent1), 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(new THREE.Color(T.accent2), 0.8, 10);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    // ── Animation loop ────────────────────────────────────────────
    let raf;
    let t = 0;
    const tmp = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;

      const cursor = cursorRef.current || { x: 0, y: 0 };
      partMat.uniforms.uTime.value   = t;
      partMat.uniforms.uCursor.value.set(cursor.x, cursor.y);
      nebulaMat.uniforms.uTime.value = t;

      // Idle rotation of initials
      initials.rotation.y = Math.sin(t * 0.15) * 0.08 + cursor.x * 0.12;
      initials.rotation.x = Math.sin(t * 0.12) * 0.04 - cursor.y * 0.08;

      // Update line connections (cheaply — sample subset)
      const pos = partGeo.attributes.position.array;
      let lineIdx = 0;
      const linePosArr = lineGeo.attributes.position.array;
      const THRESH = 2.2;

      for (let i = 0; i < COUNT; i += 4) {
        for (let j = i + 4; j < COUNT; j += 4) {
          const dx = pos[i*3]   - pos[j*3];
          const dy = pos[i*3+1] - pos[j*3+1];
          const dz = pos[i*3+2] - pos[j*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < THRESH && lineIdx < linePosArr.length - 6) {
            linePosArr[lineIdx++] = pos[i*3];
            linePosArr[lineIdx++] = pos[i*3+1];
            linePosArr[lineIdx++] = pos[i*3+2];
            linePosArr[lineIdx++] = pos[j*3];
            linePosArr[lineIdx++] = pos[j*3+1];
            linePosArr[lineIdx++] = pos[j*3+2];
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx / 3);

      // Scroll: camera dolly forward
      const scroll = stateRef.current.scrollProgress || 0;
      camera.position.z = 6 - scroll * 2.5;
      camera.position.y = -scroll * 0.5;
      particles.material.uniforms.uColor.value.lerp(
        new THREE.Color(scroll > 0.5 ? T.accent2 : T.accent1), 0.05
      );

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // sync scroll
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />;
}

// ── Scroll Indicator ──────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        color: T.textMuted, fontSize: 11, letterSpacing: "0.15em",
        fontFamily: "'DM Sans', sans-serif", zIndex: 20,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
    >
      <span style={{ textTransform: "uppercase" }}>Scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        style={{
          width: 1, height: 32,
          background: `linear-gradient(to bottom, ${T.accent1}, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────
export default function Hero() {
  const cursorRef = useRef({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef(null);

  // Cursor tracking
  const onMouseMove = useCallback((e) => {
    const nx = (e.clientX / window.innerWidth)  * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    cursorRef.current = { x: nx, y: ny };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Stagger config
  const stagger = {
    eyebrow:  { delay: 0.8,  duration: 0.7 },
    headline: { delay: 1.1,  duration: 0.9 },
    subline:  { delay: 1.5,  duration: 0.7 },
    cta:      { delay: 1.9,  duration: 0.6 },
  };
  const fadeUp = (cfg) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: cfg.delay, duration: cfg.duration, ease: [0.22, 1, 0.36, 1] },
  });

  const heroOpacity = Math.max(0, 1 - scrollProgress * 2.5);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.bg}; overflow-x: hidden; }

        .hero-cta {
          position: relative;
          padding: 14px 32px;
          border: 1.5px solid ${T.accent1};
          background: transparent;
          color: ${T.accent1};
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          transition: color 300ms ease, box-shadow 300ms ease;
        }
        .hero-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${T.accentGlow};
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .hero-cta:hover::before { opacity: 1; }
        .hero-cta:hover {
          box-shadow: 0 0 28px rgba(79,142,247,0.35), 0 0 60px rgba(79,142,247,0.12);
          color: #fff;
        }
        .hero-cta:focus-visible {
          outline: 2px solid ${T.accent1};
          outline-offset: 3px;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Noise grain */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section
        ref={containerRef}
        onMouseMove={onMouseMove}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: T.bg,
          fontFamily: "'DM Sans', sans-serif",
        }}
        aria-label="Hero section"
      >
        {/* 3D Canvas */}
        {!prefersReduced && (
          <motion.div
            style={{ position: "absolute", inset: 0, opacity: heroOpacity }}
          >
            <HeroCanvas cursorRef={cursorRef} scrollProgress={scrollProgress} />
          </motion.div>
        )}

        {/* Fallback gradient for reduced motion */}
        {prefersReduced && (
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 30% 40%, rgba(79,142,247,0.12) 0%, transparent 60%),
                         radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.08) 0%, transparent 50%),
                         ${T.bg}`,
          }} />
        )}

        {/* Horizontal separator lines (aesthetic) */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${T.border}, transparent)`,
          zIndex: 5,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${T.border}, transparent)`,
          zIndex: 5,
        }} />

        {/* Corner marks */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24 },
          { bottom: 24, left: 24 },
          { bottom: 24, right: 24 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 16, height: 16,
            borderTop: i < 2 ? `1px solid ${T.border}` : "none",
            borderBottom: i >= 2 ? `1px solid ${T.border}` : "none",
            borderLeft: i % 2 === 0 ? `1px solid ${T.border}` : "none",
            borderRight: i % 2 === 1 ? `1px solid ${T.border}` : "none",
            zIndex: 10,
          }} />
        ))}

        {/* Nav bar */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            padding: "24px 48px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            zIndex: 20,
          }}
        >
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: T.textPrimary,
            letterSpacing: "-0.01em",
          }}>
            MH<span style={{ color: T.accent1 }}>.</span>
          </span>

          <div style={{ display: "flex", gap: 32 }}>
            {["About", "Projects", "Skills", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: T.textSecondary,
                  textDecoration: "none",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  transition: "color 200ms ease",
                }}
                whileHover={{ color: T.textPrimary }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.nav>

        {/* Vertical label left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{
            position: "absolute", left: 48, top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: T.textMuted,
            letterSpacing: "0.2em",
            whiteSpace: "nowrap",
            zIndex: 20,
          }}
        >
          PORTFOLIO · 2025
        </motion.div>

        {/* Main content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          zIndex: 15,
          padding: "0 24px",
          opacity: heroOpacity,
        }}>
          {/* Eyebrow */}
          <motion.div {...fadeUp(stagger.eyebrow)} style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          }}>
            <div style={{ width: 32, height: 1, background: T.accent1 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: T.textSecondary,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}>
              Full Stack Engineer · AI Specialist
            </span>
            <div style={{ width: 32, height: 1, background: T.accent1 }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(stagger.headline)}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(48px, 8vw, 96px)",
              color: T.textPrimary,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Mohammed{" "}
            <span style={{
              background: `linear-gradient(135deg, ${T.accent1} 0%, ${T.accent2} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Hassoun
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            {...fadeUp(stagger.subline)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(16px, 2.2vw, 24px)",
              fontWeight: 400,
              color: T.textSecondary,
              marginBottom: 48,
              letterSpacing: "0.01em",
            }}
          >
            I build things that{" "}
            <span style={{ color: T.textPrimary, fontWeight: 500, fontStyle: "italic" }}>
              matter.
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(stagger.cta)}>
            <motion.button
              className="hero-cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Explore My Universe →
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            style={{
              position: "absolute",
              bottom: 72,
              display: "flex",
              gap: 48,
              alignItems: "center",
            }}
          >
            {[
              { val: "5+", label: "Years Exp." },
              { val: "40+", label: "Projects" },
              { val: "AI", label: "Specialist" },
            ].map(({ val, label }, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 22,
                  fontWeight: 500,
                  color: T.accent1,
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: 11,
                  color: T.textMuted,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {scrollProgress < 0.05 && <ScrollIndicator />}
      </section>

      {/* Below-fold placeholder */}
      <section style={{
        minHeight: "100vh",
        background: T.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: T.textPrimary,
            marginBottom: 12,
          }}>
            About Section
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            color: T.textSecondary,
            fontSize: 16,
          }}>
            Scroll transition demo — camera dollies forward into this section
          </p>
        </div>
      </section>
    </>
  );
}