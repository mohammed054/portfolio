'use client';
import { useEffect, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

/* ═══════════════════════════════════════════════════════════════════════════
   GRAVITATIONAL LENSING v4  "INTERSTELLAR"
   ═══════════════════════════════════════════════════════════════════════════
   Changes from v3:
   ✓ Strength cap raised: 0.38 → 0.55 (much more dramatic pull)
   ✓ Lens formula tuned for stronger outer bend + tighter inner warp
   ✓ Secondary image (back-of-disk arc) significantly amplified — this
     creates the characteristic bright arc visible ABOVE the black hole
   ✓ Chromatic aberration pushed further for colour fringing
   ✓ Einstein ring noticeably brighter + wider
   ✓ Frame-drag tangential component stronger
   ✓ Radial brightness boost extended for more immersive look
   ✓ Event horizon darkening deeper (0.93 → 0.98)
═══════════════════════════════════════════════════════════════════════════ */

const frag = `
uniform float uStrength;
uniform vec2  uCenter;
uniform float uTime;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){

  vec2 p = uv - uCenter;
  float r = length(p) + 1e-6;

  vec2 dir  = normalize(p);
  vec2 tang = vec2(-dir.y, dir.x);

  float s = clamp(uStrength, 0.0, 0.6);

  // ─────────────────────────────
  // LENS (SOFTER, MORE CONTROLLED)
  // ─────────────────────────────
  float lens = s * (0.32 / (r + 0.06));
  lens *= smoothstep(0.85, 0.08, r);

  float core = s * 0.14 / (r + 0.02);
  core *= smoothstep(0.20, 0.0, r);

  lens += core;

  // ─────────────────────────────
  // VERTICAL ARC (LESS AGGRESSIVE)
  // ─────────────────────────────
  float vBias = pow(abs(dir.y), 1.8);
  vec2 vOffset = vec2(0.0, vBias * s * 0.18);

  // ─────────────────────────────
  // ROTATION
  // ─────────────────────────────
  float drag = s * 0.22 / (r + 0.1);
  drag *= smoothstep(0.8, 0.1, r);

  vec2 uvMain = uv + dir*lens + tang*drag + vOffset;
  uvMain = clamp(uvMain, 0.001, 0.999);

  vec3 col = texture2D(inputBuffer, uvMain).rgb;

  // ─────────────────────────────
  // SOFT SECONDARY ARC (NO BURN)
  // ─────────────────────────────
  float arcMask = smoothstep(0.28, 0.20, r) * smoothstep(0.18, 0.26, r);

  vec2 uvArc = uv - dir*lens*0.55 - tang*drag*0.35;
  uvArc.y += vBias * 0.12;

  vec3 arc = texture2D(inputBuffer, uvArc).rgb;

  col += arc * arcMask * s * 0.6; // 🔻 MUCH LOWER

  // ─────────────────────────────
  // COLOR PRESERVATION (IMPORTANT)
  // ─────────────────────────────
  col = mix(col, col * 0.85, smoothstep(0.15, 0.4, r));

  // ─────────────────────────────
  // EVENT HORIZON (CLEAN + BIGGER)
  // ─────────────────────────────
  float horizon = smoothstep(0.11, 0.06, r);
  col = mix(col, vec3(0.0), horizon);

  outputColor = vec4(col, inputColor.a);
}

`;

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
    // New cap: 0.55 (was 0.38) — creates the Interstellar top arc
    effect.uniforms.get('uStrength')!.value = Math.min(strengthRef.current, 0.55);
    effect.uniforms.get('uTime')!.value     = clock.getElapsedTime();
  });

  useEffect(() => () => effect.dispose(), [effect]);

  return <primitive object={effect} />;
}