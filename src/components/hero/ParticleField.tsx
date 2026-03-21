'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  scrollVelocity: React.MutableRefObject<number>;
  count?: number;
}

export default function ParticleField({
  mouseRef,
  scrollProgress,
  scrollVelocity,
  count = 1400,
}: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null!);

  const smoothMouse = useRef(new THREE.Vector2());
  const warp = useRef(0);
  const inside = useRef(0);

  // ─────────────────────────────
  // GEOMETRY (single unified system)
  // ─────────────────────────────
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();

    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    const radius = new Float32Array(count);
    const angle = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 30;
      const a = Math.random() * Math.PI * 2;

      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = Math.sin(a) * r - 10;

      size[i] = 0.6 + Math.random() * 2.5;
      seed[i] = Math.random();
      radius[i] = r;
      angle[i] = a;
    }

    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
    g.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));

    return g;
  }, [count]);

  // ─────────────────────────────
  // FRAME LOOP
  // ─────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sp = scrollProgress.current;
    const sv = scrollVelocity.current;

    // WARP (speed + scroll)
    const warpTarget = Math.min(sp * 1.2 + sv * 3.0, 1);
    warp.current += (warpTarget - warp.current) * 0.06;

    // INSIDE STATE
    const insideTarget = sp > 0.7 ? Math.min((sp - 0.7) * 6, 1) : 0;
    inside.current += (insideTarget - inside.current) * 0.06;

    // mouse smoothing
    smoothMouse.current.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      0.05
    );

    if (mat.current) {
      mat.current.uniforms.uTime.value = t;
      mat.current.uniforms.uWarp.value = warp.current;
      mat.current.uniforms.uInside.value = inside.current;
      mat.current.uniforms.uMouse.value.copy(smoothMouse.current);
    }
  });

  // ─────────────────────────────
  // SHADERS (CINEMATIC + GRAVITY)
  // ─────────────────────────────
  const VERT = `
attribute float aSize;
attribute float aSeed;
attribute float aRadius;
attribute float aAngle;

uniform float uTime;
uniform float uWarp;
uniform float uInside;
uniform vec2 uMouse;

varying float vAlpha;

void main() {
  float angle = aAngle;

  // ─────────────────────────────
  // ORBIT + TIME
  // ─────────────────────────────
  float speed = 0.2 + aSeed * 0.8;
  angle += uTime * speed * (0.2 + uWarp * 1.5);

  vec3 pos = vec3(
    cos(angle) * aRadius,
    sin(angle * 0.7) * 0.7,
    sin(angle) * aRadius
  );

  float dist = length(pos);

  // ─────────────────────────────
  // GRAVITY PULL
  // ─────────────────────────────
  float gravity = uWarp * (1.0 / (dist + 1.0));
  pos *= mix(1.0, 0.3, gravity);

  // tighten orbit near center
  angle += gravity * 2.0;

  // ─────────────────────────────
  // MOUSE DISTORTION (spacetime drag)
  // ─────────────────────────────
  vec2 m = uMouse * 6.0;
  pos.xy += (pos.xy - m) * 0.03 * (1.0 - uInside);

  // ─────────────────────────────
  // WARP STRETCH
  // ─────────────────────────────
  pos.z += uWarp * 10.0 * (1.0 - aSeed);

  // ─────────────────────────────
  // INSIDE TUNNEL MODE
  // ─────────────────────────────
  if (uInside > 0.01) {
    float tunnel = mix(pos.x, sign(pos.x) * (5.0 + aSeed * 10.0), uInside);
    pos.x = tunnel;

    pos.z -= uInside * 20.0;
  }

  // ─────────────────────────────
  // FINAL
  // ─────────────────────────────
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  float size = aSize * (300.0 / -mv.z);
  size *= (1.0 + uWarp * 2.0);

  gl_PointSize = size;
  gl_Position = projectionMatrix * mv;

  vAlpha = (1.0 - uInside) + uInside * aSeed;
}
`;

  const FRAG = `
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  if (d > 0.5) discard;

  float glow = exp(-d * 8.0);

  vec3 cold = vec3(0.6, 0.8, 1.0);
  vec3 warm = vec3(1.0, 0.85, 0.6);

  vec3 col = mix(cold, warm, vAlpha);

  gl_FragColor = vec4(col, glow * vAlpha);
}
`;

  return (
    <points frustumCulled={false}>
      <primitive object={geo} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTime: { value: 0 },
          uWarp: { value: 0 },
          uInside: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}