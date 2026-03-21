'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Must match CameraController MH_POS
export const MH_POSITION: [number, number, number] = [0, 0.2, -11.0];

interface Props {
  visible: boolean;
  revealed: boolean;      // true = animate OUT (zoom blast)
  onClick: () => void;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function Inner({ visible, revealed, onClick, mouseRef }: Props) {
  const gRef      = useRef<THREE.Group>(null!);
  const matRef    = useRef<THREE.MeshStandardMaterial>(null!);
  const [hovered, setHovered] = useState(false);

  // Animated values stored in refs (no re-renders)
  const scaleVal   = useRef(0);
  const opacityVal = useRef(0);
  const clickedAt  = useRef<number | null>(null);

  // Trigger zoom-blast when revealed flips true
  useEffect(() => {
    if (revealed) {
      clickedAt.current = performance.now();
    }
  }, [revealed]);

  useFrame(({ clock }) => {
    if (!gRef.current) return;
    const t = clock.getElapsedTime();

    // ── Scale-in spring when first appearing ──
    if (!revealed && visible) {
      scaleVal.current   += (1.0 - scaleVal.current)   * 0.055;
      opacityVal.current += (1.0 - opacityVal.current) * 0.055;
    }

    // ── Zoom-blast out when revealed ──
    if (revealed && clickedAt.current !== null) {
      const elapsed = (performance.now() - clickedAt.current) / 1000;
      // Rapid scale surge: 1 → 6 over 0.5s
      const zoomT = Math.min(elapsed / 0.5, 1.0);
      scaleVal.current   = 1.0 + zoomT * 5.0;
      opacityVal.current = 1.0 - zoomT;
    }

    const s = Math.max(0, scaleVal.current);
    gRef.current.scale.set(s, s, s);

    // Opacity via material
    if (matRef.current) {
      matRef.current.opacity = opacityVal.current;

      // Emissive: idle pulse → max on click
      const pulseBase = 2.2 + Math.sin(t * 1.2) * 0.7;
      const hoverBoost = hovered ? 2.0 : 0;
      const blastBoost = revealed ? 8.0 * (1 - Math.min((performance.now() - (clickedAt.current ?? 0)) / 500, 1)) : 0;
      const target = pulseBase + hoverBoost + blastBoost;
      matRef.current.emissiveIntensity += (target - matRef.current.emissiveIntensity) * 0.1;
    }

    // Gentle float
    if (!revealed) {
      gRef.current.position.y = MH_POSITION[1] + Math.sin(t * 0.55) * 0.12;
    }

    // Mouse tilt — only when idle
    if (!revealed) {
      const { x, y } = mouseRef.current;
      gRef.current.rotation.x += (-y * 0.10 - gRef.current.rotation.x) * 0.05;
      gRef.current.rotation.y += ( x * 0.12 - gRef.current.rotation.y) * 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group ref={gRef} position={MH_POSITION}>
      {/* Focused lighting just for MH */}
      <pointLight position={[0, 0, 3]} intensity={6} color="#ffffff" distance={10} decay={2} />
      <pointLight position={[0, 2, 2]} intensity={3} color="#00D0FF" distance={8}  decay={2} />

      <Center>
        <Text3D
          font="/fonts/Syne_Bold.json"
          size={1.1}
          height={0.28}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.018}
          bevelSegments={6}
          curveSegments={24}
          onClick={(e) => { e.stopPropagation(); if (!revealed) onClick(); }}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'none'; }}
          onPointerOut={() => setHovered(false)}
        >
          MH
          <meshStandardMaterial
            ref={matRef}
            color="#F0F4FF"
            emissive="#00AAFF"   /* cyan-white — no purple */
            emissiveIntensity={2.2}
            metalness={0.95}
            roughness={0.05}
            transparent
            opacity={1}
          />
        </Text3D>
      </Center>

      {/* Single clean orbit ring — replaces the two purple pulse rings */}
      <OrbitRing />
    </group>
  );
}

function OrbitRing() {
  const r = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!r.current) return;
    const t = clock.getElapsedTime();
    r.current.rotation.z = t * 0.4;
    const s = 1 + Math.sin(t * 0.9) * 0.04;
    r.current.scale.set(s, s, s);
    (r.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(t * 0.9) * 0.1;
  });
  return (
    <mesh ref={r} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <torusGeometry args={[2.0, 0.015, 8, 80]} />
      <meshBasicMaterial color="#00D0FF" transparent opacity={0.25} />
    </mesh>
  );
}

export default function MHInitials(props: Props) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}