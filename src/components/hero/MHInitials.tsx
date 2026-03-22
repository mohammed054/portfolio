'use client';

/**
 * MHInitials — 3D text anchored in space.
 *
 * Fixes:
 *   ✓ No continuous rotation.y accumulation (no flip)
 *   ✓ Camera-facing via lookAt — always readable
 *   ✓ Mouse influence = gentle tilt, not rotation override
 *   ✓ Click: energy-pulse dissolve → smooth UI fade-in
 *   ✓ Position z=-6.5 → clear of camera near-plane
 *   ✓ Scale driven by appear/energy, not explode-scale (no clip)
 */
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

export const MH_POSITION: [number, number, number] = [0, 0.1, -6.5];

interface Props {
  visible:  boolean;
  revealed: boolean;
  onClick:  () => void;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function Inner({ visible, revealed, onClick, mouseRef }: Props) {
  const { camera } = useThree();

  const group    = useRef<THREE.Group>(null!);
  const mat      = useRef<THREE.MeshStandardMaterial>(null!);
  const ring1    = useRef<THREE.Mesh>(null!);
  const ring2    = useRef<THREE.Mesh>(null!);

  const [hovered, setHovered] = useState(false);

  const appear   = useRef(0);
  const energy   = useRef(0);
  const dissolve = useRef(0);

  // Smooth mouse target to avoid jitter
  const smoothTilt = useRef(new THREE.Vector2());

  useEffect(() => {
    if (revealed) {
      // Dissolve triggers the energy-out animation
      dissolve.current = 0;
    }
  }, [revealed]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;

    // ── APPEAR (gradual materialise) ──
    if (visible) {
      appear.current += (1 - appear.current) * 0.04;
    } else {
      appear.current += (0 - appear.current) * 0.1;
    }

    // ── ENERGY BUILDUP (hover) ──
    const eTarget = hovered ? 2.2 : 1.0;
    energy.current += (eTarget - energy.current) * 0.07;

    // ── DISSOLVE ON REVEAL ──
    if (revealed) {
      dissolve.current += (1 - dissolve.current) * 0.04;
    }

    // ── LOOK AT CAMERA (no flip, always readable) ──
    // Use quaternion lookAt so we never accumulate euler angles
    const worldPos = new THREE.Vector3(...MH_POSITION);
    const dir      = camera.position.clone().sub(worldPos).normalize();
    const up       = new THREE.Vector3(0, 1, 0);
    const mat4     = new THREE.Matrix4().lookAt(worldPos, worldPos.clone().add(dir), up);
    group.current.setRotationFromMatrix(mat4);

    // ── MOUSE TILT (subtle, additive on top of lookAt) ──
    smoothTilt.current.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y), 0.04
    );
    group.current.rotation.x += smoothTilt.current.y * -0.08;
    group.current.rotation.y += smoothTilt.current.x *  0.10;

    // ── FLOAT ──
    const floatY = Math.sin(t * 0.55) * 0.09;
    group.current.position.set(
      MH_POSITION[0],
      MH_POSITION[1] + floatY * (1 - dissolve.current),
      MH_POSITION[2]
    );

    // ── SCALE: no jump, no explode past safe size ──
    const s = appear.current * (1 + energy.current * 0.08) * (1 - dissolve.current * 0.98);
    group.current.scale.setScalar(Math.max(0, s));

    // ── MATERIAL ──
    if (mat.current) {
      const pulse = 1.8 + Math.sin(t * 1.4) * 0.5 + energy.current * 1.5;
      const blast = dissolve.current * 12;
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity, pulse + blast, 0.1
      );
      mat.current.opacity = Math.max(0, (1 - dissolve.current) * appear.current);
    }

    // ── RINGS ──
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.55;
      const rs1 = 1 + Math.sin(t * 1.1) * 0.07 + energy.current * 0.18;
      ring1.current.scale.setScalar(rs1);
      (ring1.current.material as THREE.MeshBasicMaterial).opacity =
        (0.22 + energy.current * 0.15) * (1 - dissolve.current);
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.38;
      const rs2 = 1 + Math.sin(t * 0.75 + 1.5) * 0.09 + energy.current * 0.25;
      ring2.current.scale.setScalar(rs2);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity =
        (0.10 + energy.current * 0.12) * (1 - dissolve.current);
    }
  });

  if (!visible) return null;

  return (
    <group ref={group} position={MH_POSITION}>
      <pointLight position={[0, 1, 2.5]} intensity={5}  color="#ffffff" />
      <pointLight position={[0, 2, 1.5]} intensity={3.5} color="#00BBFF" />

      <Center>
        <Text3D
          font="/fonts/Syne_Bold.json"
          size={2.2}
          height={0.34}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.016}
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
            color="#F0F5FF"
            emissive="#00A8FF"
            emissiveIntensity={1.8}
            metalness={0.9}
            roughness={0.06}
            transparent
          />
        </Text3D>
      </Center>

      {/* Gravity rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.014, 16, 128]} />
        <meshBasicMaterial color="#00CCFF" transparent />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.9, 0.008, 16, 128]} />
        <meshBasicMaterial color="#88DDFF" transparent />
      </mesh>
    </group>
  );
}

export default function MHInitials(props: Props) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}
