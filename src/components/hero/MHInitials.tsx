'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

export const MH_POSITION: [number, number, number] = [0, 0.2, -11];

interface Props {
  visible: boolean;
  revealed: boolean;
  onClick: () => void;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function Inner({ visible, revealed, onClick, mouseRef }: Props) {
  const group = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.MeshStandardMaterial>(null!);

  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);

  const [hovered, setHovered] = useState(false);

  const appear = useRef(0);
  const energy = useRef(0);
  const explode = useRef(0);

  const clickedAt = useRef<number | null>(null);

  // trigger explosion
  useEffect(() => {
    if (revealed) clickedAt.current = performance.now();
  }, [revealed]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!group.current) return;

    // ─────────────────────────────
    // APPEAR (materialize instead of pop)
    // ─────────────────────────────
    if (visible && !revealed) {
      appear.current += (1 - appear.current) * 0.05;
    }

    // ─────────────────────────────
    // ENERGY BUILDUP
    // ─────────────────────────────
    const targetEnergy = hovered ? 2.5 : 1.0;
    energy.current += (targetEnergy - energy.current) * 0.08;

    // ─────────────────────────────
    // EXPLOSION
    // ─────────────────────────────
    if (revealed && clickedAt.current) {
      const e = (performance.now() - clickedAt.current) / 700;
      explode.current = Math.min(e, 1);
    }

    // ─────────────────────────────
    // SCALE (non-linear)
    // ─────────────────────────────
    const s =
      appear.current *
      (1 + energy.current * 0.1) *
      (1 + explode.current * 6);

    group.current.scale.setScalar(s);

    // ─────────────────────────────
    // FLOAT (subtle)
    // ─────────────────────────────
    if (!revealed) {
      group.current.position.y =
        MH_POSITION[1] + Math.sin(t * 0.6) * 0.1;
    }

    // ─────────────────────────────
    // ROTATION (space instability)
    // ─────────────────────────────
    group.current.rotation.y += 0.002 + energy.current * 0.002;

    // mouse influence
    if (!revealed) {
      const { x, y } = mouseRef.current;

      group.current.rotation.x += (-y * 0.1 - group.current.rotation.x) * 0.06;
      group.current.rotation.y += (x * 0.12 - group.current.rotation.y) * 0.06;
    }

    // ─────────────────────────────
    // MATERIAL
    // ─────────────────────────────
    if (mat.current) {
      const pulse =
        2.0 +
        Math.sin(t * 1.5) * 0.6 +
        energy.current * 2.0;

      const blast = explode.current * 8;

      const target = pulse + blast;

      mat.current.emissiveIntensity +=
        (target - mat.current.emissiveIntensity) * 0.1;

      mat.current.opacity =
        (1 - explode.current) * appear.current;
    }

    // ─────────────────────────────
    // RINGS (gravitational field)
    // ─────────────────────────────
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.6;

      const scale =
        1 +
        Math.sin(t * 1.2) * 0.08 +
        energy.current * 0.2;

      ring1.current.scale.setScalar(scale);

      const m = ring1.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + energy.current * 0.2;
    }

    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.4;

      const scale =
        1 +
        Math.sin(t * 0.8 + 1.5) * 0.1 +
        energy.current * 0.3;

      ring2.current.scale.setScalar(scale);

      const m = ring2.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.1 + energy.current * 0.15;
    }
  });

  if (!visible) return null;

  return (
    <>
      <group ref={group} position={MH_POSITION}>
        {/* LIGHT ENERGY */}
        <pointLight position={[0, 0, 3]} intensity={6} />
        <pointLight position={[0, 2, 2]} intensity={4} color="#00D0FF" />

        <Center>
          <Text3D
            font="/fonts/Syne_Bold.json"
            size={1.1}
            height={0.28}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.018}
            bevelSegments={6}
            curveSegments={32}
            onClick={(e) => {
              e.stopPropagation();
              if (!revealed) onClick();
            }}
            onPointerOver={() => {
              setHovered(true);
              document.body.style.cursor = 'none';
            }}
            onPointerOut={() => setHovered(false)}
          >
            MH
            <meshStandardMaterial
              ref={mat}
              color="#F5F8FF"
              emissive="#00AAFF"
              emissiveIntensity={2}
              metalness={1}
              roughness={0.05}
              transparent
            />
          </Text3D>
        </Center>

        {/* GRAVITY RINGS */}
        <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.1, 0.015, 16, 120]} />
          <meshBasicMaterial color="#00D0FF" transparent />
        </mesh>

        <mesh ref={ring2} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[2.7, 0.008, 16, 120]} />
          <meshBasicMaterial color="#88EEFF" transparent />
        </mesh>
      </group>

      {/* UI REVEAL */}
      {revealed && (
        <div className="mh-overlay">
          <div className="mh-name">
            <span>Mohammed</span>
            <span>Hassoun</span>
          </div>

          <div className="mh-sub">
            Software Engineer — Systems • AI • Interfaces
          </div>

          <div className="mh-cta">
            <button>Explore Work</button>
            <button>Contact</button>
          </div>

          <div className="mh-scroll">
            <div className="line" />
            <span>scroll to continue</span>
          </div>
        </div>
      )}
    </>
  );
}

export default function MHInitials(props: Props) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}