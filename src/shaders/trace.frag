// trace.frag — Animated data trace line fragment shader
// Draws the static dim trace line + a bright animated dash that travels along it.

uniform vec3  uColor;      // trace color (blue by default)
uniform float uTime;       // elapsed seconds
uniform float uSpeed;      // packet travel speed multiplier
uniform float uActive;     // 0.0 = dim/inactive, 1.0 = active
uniform float uDashLength; // length of the moving dash [0,1]

varying vec2 vUv;

void main() {
  // Static dim baseline — always visible when trace exists
  float baseline = 0.08 * uActive + 0.02;

  // Animated dash: moves from uv.x = 0 → 1 repeatedly
  float dashPos  = fract(uTime * uSpeed * 0.25);
  float halfDash = uDashLength * 0.5;

  // Wrap-safe distance from dash center
  float uvX      = vUv.x;
  float dist     = abs(uvX - dashPos);
  // Handle wrap-around at edges
  dist = min(dist, 1.0 - dist);

  float dashMask = smoothstep(halfDash, halfDash * 0.1, dist);
  float bright   = dashMask * uActive;

  // Combine: dim baseline + animated bright dash
  float intensity = baseline + bright * 0.9;

  // Edge fade along Y axis (line width feel)
  float yFade = 1.0 - abs(vUv.y - 0.5) * 2.0;
  yFade = smoothstep(0.0, 0.4, yFade);

  vec3 col = uColor * intensity;

  // Glow core: brighter at center of dash
  col += uColor * dashMask * bright * 0.6;

  gl_FragColor = vec4(col * yFade, intensity * yFade);
}
