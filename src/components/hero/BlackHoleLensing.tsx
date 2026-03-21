'use client';

import { useRef, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

const fragmentShader = `
uniform float uTime;
uniform vec2 uCenter;
uniform float uStrength;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 p = uv - uCenter;
  float r = length(p) + 1e-6;

  float gravity = uStrength * (0.3 / (r + 0.04));
  float outer = gravity * 0.3;
  float mid   = gravity * 0.8;
  float inner = gravity * 1.6;
  float zone = smoothstep(0.9, 0.25, r);
  float lens = mix(outer, mid, zone);
  lens = mix(lens, inner, smoothstep(0.25, 0.05, r));

  float swirl = uStrength * (0.6 / (r + 0.12)) * (1.0 + sin(uTime * 0.6) * 0.15);

  vec2 dir = normalize(p);
  vec2 tangent = vec2(-p.y, p.x);

  float compress = smoothstep(0.75, 0.05, r);
  float compression = compress * uStrength * 0.35;

  vec2 warpedUV = uv + dir * lens + tangent * swirl - dir * compression;
  vec4 color = texture2D(inputBuffer, warpedUV);

  float ring = smoothstep(0.22, 0.18, r) * smoothstep(0.18, 0.26, r);
  float ringGlow = ring * 1.4 * uStrength;
  float boost = smoothstep(0.65, 0.2, r) * uStrength * 0.5;
  float shimmer = sin(uTime * 2.2 + r * 25.0) * 0.0025 * uStrength;

  vec3 finalColor = color.rgb * (1.0 + boost) + ringGlow + shimmer;
  outputColor = vec4(finalColor, color.a);
}
`;

class LensingEffect extends Effect {
  constructor() {
    super('LensingEffect', fragmentShader, {
      // ✅ Must be a Map<string, Uniform>, not a plain object
      uniforms: new Map<string, Uniform>([
        ['uTime', new Uniform(0)],
        ['uCenter', new Uniform(new Vector2(0.5, 0.5))],
        ['uStrength', new Uniform(0)],
      ]),
    });
  }
}

export default function BlackHoleLensing({
  strengthRef,
}: {
  strengthRef: React.MutableRefObject<number>;
}) {
  // ✅ Use the memoised instance directly — no need for effectRef
  const effect = useMemo(() => new LensingEffect(), []);

  useFrame(({ clock }) => {
    // ✅ Fully typed — no 'any' cast needed
    effect.uniforms.get('uTime')!.value = clock.getElapsedTime();
    effect.uniforms.get('uStrength')!.value = strengthRef.current;
  });

  return <primitive object={effect} />;
}