'use client';
import { useEffect, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

/* ═══════════════════════════════════════════════════════════════════════════
   GRAVITATIONAL LENSING v3  "PREMIUM"
   ───────────────────────────────────────────────────────────────────────────
   User feedback: "I like how the pull is smooth and clean, a little more
   without ruining it."

   Changes from v2:
   ✓ Lensing strength cap raised: 0.32 → 0.38 (≈18% stronger pull)
   ✓ Lens formula tuned for slightly more dramatic inner warp
   ✓ Chromatic aberration preserved (R/G/B bend differently)
   ✓ Secondary image preserved (ghost arc outside ring)
   ✓ Einstein ring glow slightly brighter + shimmer preserved
   ✓ Event horizon darkening preserved
   ✓ Smooth, no harsh discontinuities
═══════════════════════════════════════════════════════════════════════════ */

const frag = `
uniform float uStrength;
uniform vec2  uCenter;
uniform float uTime;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
  vec2  p   = uv - uCenter;
  float r   = length(p) + 1e-6;
  vec2  dir  = normalize(p);
  vec2  tang = vec2(-p.y, p.x);

  // Slightly stronger cap than before (0.38 vs 0.32)
  float s = clamp(uStrength, 0.0, 0.38);

  // Schwarzschild bending — lens formula with gentle extra inner zone
  float lensOuter = s * (0.22 / (r + 0.062)) * smoothstep(0.92, 0.08, r);
  float lensInner = s * (0.08 / (r + 0.025)) * smoothstep(0.12, 0.00, r);
  float lens      = lensOuter + lensInner;

  // Frame-dragging tangential drag
  float drag = s * 0.20 / (r + 0.11) * smoothstep(0.84, 0.04, r);

  // Chromatic aberration — blue bends more
  float chromR = lens * 0.968;
  float chromG = lens * 1.000;
  float chromB = lens * 1.036;
  float dragR  = drag * 0.974;
  float dragG  = drag * 1.000;
  float dragB  = drag * 1.030;

  vec2 uvR = clamp(uv + dir*chromR + tang*dragR, 0.001, 0.999);
  vec2 uvG = clamp(uv + dir*chromG + tang*dragG, 0.001, 0.999);
  vec2 uvB = clamp(uv + dir*chromB + tang*dragB, 0.001, 0.999);

  float red   = texture2D(inputBuffer, uvR).r;
  float green = texture2D(inputBuffer, uvG).g;
  float blue  = texture2D(inputBuffer, uvB).b;

  // Secondary image (light going around the back)
  float secW = smoothstep(0.24, 0.19, r) * smoothstep(0.16, 0.21, r) * s * 0.60;
  vec2 uvSecR = clamp(uv - dir*chromR*0.45 - tang*dragR*0.30, 0.001, 0.999);
  vec2 uvSecG = clamp(uv - dir*chromG*0.45 - tang*dragG*0.30, 0.001, 0.999);
  vec2 uvSecB = clamp(uv - dir*chromB*0.45 - tang*dragB*0.30, 0.001, 0.999);

  vec3 col = vec3(red, green, blue);
  col += vec3(texture2D(inputBuffer,uvSecR).r,
              texture2D(inputBuffer,uvSecG).g,
              texture2D(inputBuffer,uvSecB).b) * secW;

  // Einstein ring — slightly more prominent
  float ring  = smoothstep(0.215, 0.176, r) * smoothstep(0.172, 0.218, r);
  float shim  = 1.0 + 0.065 * sin(uTime * 2.8 + r * 40.0);
  col += ring * 1.80 * s * shim;

  // Radial brightness boost
  float boost = smoothstep(0.65, 0.11, r) * s * 0.45;
  col *= (1.0 + boost);

  // Event horizon absolute dark
  float horizon = smoothstep(0.088, 0.054, r);
  col = mix(col, vec3(0.0), horizon * 0.93);

  outputColor = vec4(col, inputColor.a);
}`;

class LensEffect extends Effect {
  constructor() {
    super('LensEffect', frag, {
      uniforms: new Map<string, Uniform>([
        ['uStrength', new Uniform(0)],
        ['uCenter',   new Uniform(new Vector2(0.5, 0.5))],
        ['uTime',     new Uniform(0)],
      ]),
    });
  }
}

export default function GravitationalLensing({
  strengthRef,
}: {
  strengthRef: React.MutableRefObject<number>;
}) {
  const effect = useMemo(() => new LensEffect(), []);

  useFrame(({ clock }) => {
    // Use 0.38 as new cap (slightly stronger than before)
    effect.uniforms.get('uStrength')!.value = Math.min(strengthRef.current, 0.38);
    effect.uniforms.get('uTime')!.value     = clock.getElapsedTime();
  });

  useEffect(() => () => effect.dispose(), [effect]);

  return <primitive object={effect} />;
}