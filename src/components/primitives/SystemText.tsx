'use client';

import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystemStore } from '@/store/systemStore';

export interface SystemTextProps {
  text: string;
  position: [number, number, number];
  fontSize?: number;
  color?: THREE.ColorRepresentation;
  opacity?: number;
  rotation?: [number, number, number];
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  visible?: boolean;
  maxWidth?: number;
  onClick?: () => void;
  cursorContext?: 'hover' | 'view';
}

export const SystemText = ({
  text,
  position,
  fontSize = 1,
  color = '#FFFFFF',
  opacity = 1,
  rotation = [0, 0.03, 0],
  anchorX = 'center',
  anchorY = 'middle',
  letterSpacing = -0.04,
  visible = true,
  maxWidth,
  onClick,
  cursorContext = 'hover',
}: SystemTextProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const animatedOpacity = useRef(0);
  const animatedScale = useRef(0.95);
  const setCursorContext = useSystemStore((state) => state.setCursorContext);

  useFrame((_, delta) => {
    const nextOpacity = visible ? opacity : 0;
    const nextScale = visible ? 1 : 0.97;

    animatedOpacity.current = THREE.MathUtils.damp(
      animatedOpacity.current,
      nextOpacity,
      8,
      delta
    );
    animatedScale.current = THREE.MathUtils.damp(
      animatedScale.current,
      nextScale,
      8,
      delta
    );

    if (groupRef.current) {
      groupRef.current.scale.setScalar(animatedScale.current);
    }

    if (textRef.current) {
      const material = textRef.current.material as THREE.Material & {
        opacity: number;
      };
      material.opacity = animatedOpacity.current;
      material.transparent = true;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation as unknown as THREE.Euler}>
      <Text
        ref={textRef}
        font="/fonts/DM-Sans-Bold.ttf"
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        letterSpacing={letterSpacing}
        maxWidth={maxWidth}
        material-transparent
        material-opacity={0}
        material-toneMapped={false}
        fillOpacity={animatedOpacity.current}
        onClick={onClick}
        onPointerEnter={() => {
          if (onClick) {
            setCursorContext(cursorContext);
          }
        }}
        onPointerLeave={() => setCursorContext('default')}
      >
        {text}
      </Text>
    </group>
  );
};
